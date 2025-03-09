const cors = require("cors");
const express = require("express");
const axios = require("axios")
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const AuditAI = new GoogleGenerativeAI(
  process.env.API_KEY || "AIzaSyAgRdhRht2XFaH-rHJ5qTCM_C061X34v6w"
);
const model = AuditAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Etherscan API configuration
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "REJ27MRQ4RFIW16CH55GVTE11Y5FYMGKD2";
const ETHERSCAN_BASE_URL = "https://api.etherscan.io/api";

app.use(express.json());
app.use(cors());

const PORT = 5000;

// Helper function to determine which network API to use
function getNetworkApiUrl(network) {
  switch (network.toLowerCase()) {
    case 'ethereum':
      return "https://api.etherscan.io/api";
    case 'bsc':
      return "https://api.bscscan.com/api";
    case 'polygon':
      return "https://api.polygonscan.com/api";
    case 'avalanche':
      return "https://api.snowtrace.io/api";
    default:
      return "https://api.etherscan.io/api";
  }
}

app.post("/contract", async (req, res) => {
  try {
    const { address, network = "ethereum" } = req.body;

    if (!address) {
      return res.status(400).json({ error: "Contract address is required" });
    }

    // Step 1: Determine if input is an address or direct contract code
    const isAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
    let contractCode;

    if (isAddress) {
      console.log(`Fetching contract code for address: ${address} on ${network}`);
      // Get contract source code from blockchain explorer API
      const apiUrl = getNetworkApiUrl(network);
      const response = await axios.get(apiUrl, {
        params: {
          module: "contract",
          action: "getsourcecode",
          address: address,
          apikey: ETHERSCAN_API_KEY
        }
      });

      if (response.data.status !== "1" || !response.data.result || response.data.result.length === 0) {
        return res.status(404).json({ error: "Contract source code not found or not verified" });
      }

      contractCode = response.data.result[0].SourceCode;
      
      // Handle proxy contracts or multi-file contracts
      if (contractCode.startsWith("{")) {
        try {
          // Handle JSON encoded source code (multi-file contracts)
          const parsed = JSON.parse(contractCode);
          if (parsed.sources) {
            // Get main contract file from multi-file contract
            const mainFile = Object.keys(parsed.sources)[0];
            contractCode = parsed.sources[mainFile].content;
          } else {
            contractCode = "Contract source code format not supported for detailed analysis";
          }
        } catch (e) {
          console.error("Error parsing contract JSON:", e);
        }
      }
    } else {
      // Direct code analysis
      contractCode = address;
    }

    // Step 2: Analyze with Gemini AI
    console.log("Sending contract to Gemini for analysis...");
    
    // Create a detailed prompt for the AI
    const analysisPrompt = `
    You are AuditAI, an expert smart contract security auditor.
    Analyze the following smart contract code for security vulnerabilities, gas optimizations,
    and best practice recommendations. Format your response as follows:

    ## SECURITY SCORE
    [Provide a score from 1-10, where 10 is most secure]

    ## CRITICAL VULNERABILITIES
    [List any critical security issues with code references]

    ## MEDIUM/LOW VULNERABILITIES
    [List any medium or low severity issues with code references]

    ## GAS OPTIMIZATIONS
    [Suggest optimizations to reduce gas costs]

    ## CODE QUALITY
    [Comment on code quality, readability and best practices]

    ## RECOMMENDATIONS
    [Provide specific recommendations to improve the contract]

    Here's the smart contract code:
    \`\`\`
    ${contractCode}
    \`\`\`
    `;

    const response = await model.generateContent(analysisPrompt);
    
    let resultText;
    
    if (response.response) {
      resultText = response.response.text();
    } else if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        resultText = candidate.content.parts[0].text;
      }
    } else if (response.text) {
      resultText = response.text;
    } else {
      console.log("Unexpected response structure:", response);
      resultText = "Response structure not recognized";
    }
    
    // Return formatted analysis
    res.json({ 
      result: resultText || "No response generated.", 
      address: isAddress ? address : null,
      network: isAddress ? network : null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error generating content:", error);
    
    if (error.response) {
      console.error("API Error Response:", error.response.data);
    }
    
    res.status(500).json({ 
      error: "Internal server error", 
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});