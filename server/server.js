const cors = require("cors");
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const AuditAI = new GoogleGenerativeAI(
  process.env.API_KEY || "AIzaSyAgRdhRht2XFaH-rHJ5qTCM_C061X34v6w"
);
const model = AuditAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.use(express.json());
app.use(cors());

const PORT = 5000;

app.post("/contract", async (req, res) => {
  try {
    const { prompt } = req.body; // Ensure correct property name

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("Sending prompt to Gemini:", prompt);
    
    const response = await model.generateContent(prompt);
    console.log("Response received:", JSON.stringify(response, null, 2));
    
    // Access the response differently based on the API's response structure
    let resultText;
    
    if (response.response) {
      // For newer versions of the API
      resultText = response.response.text();
    } else if (response.candidates && response.candidates.length > 0) {
      // For structure with candidates
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        resultText = candidate.content.parts[0].text;
      }
    } else if (response.text) {
      // Direct text access
      resultText = response.text;
    } else {
      // Fallback for unknown structure - log the complete response
      console.log("Unexpected response structure:", response);
      resultText = "Response structure not recognized";
    }
    
    res.json({ result: resultText || "No response generated." });
  } catch (error) {
    console.error("Error generating content:", error);
    
    // More detailed error logging
    if (error.response) {
      console.error("API Error Response:", error.response);
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