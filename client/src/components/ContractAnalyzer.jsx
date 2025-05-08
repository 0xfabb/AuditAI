import { useState } from "react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import axios from "axios";
import { Clipboard, Download, AlertTriangle, CheckCircle, Info, Shield } from "lucide-react";

export default function ContractAnalyzer() {
  const [contractInput, setContractInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum");
  const [analysisData, setAnalysisData] = useState(null);

  const networks = [
    { id: "ethereum", name: "Ethereum" },
    { id: "bsc", name: "BSC" },
    { id: "polygon", name: "Polygon" },
    { id: "avalanche", name: "Avalanche" }
  ];

  const analyzeContract = async () => {
    if (!contractInput) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setAnalysisData(null);

    try {
      const response = await axios.post("http://localhost:5000/contract", {
        address: contractInput,
        network: selectedNetwork
      });

      console.log("Response:", response.data);
      setResult(response.data.result);
      setAnalysisData({
        address: response.data.address,
        network: response.data.network,
        timestamp: response.data.timestamp
      });

      // Extract security score if available
      try {
        const scoreMatch = response.data.result.match(/## SECURITY SCORE\s+(\d+)/);
        if (scoreMatch && scoreMatch[1]) {
          const score = parseInt(scoreMatch[1]);
          setAnalysisData(prev => ({ ...prev, securityScore: score }));
        }
      } catch (e) {
        console.log("Could not parse security score", e);
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to analyze contract. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      // You could add toast notification here
    }
  };

  const downloadReport = () => {
    if (result) {
      const element = document.createElement("a");
      const file = new Blob([`AuditAI Security Report\n${new Date().toISOString()}\n\n${result}`], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `auditai-report-${new Date().toISOString().slice(0,10)}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  // Function to get proper color based on security score
  const getScoreColor = (score) => {
    if (!score) return 'text-gray-400';
    if (score >= 8) return 'text-green-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Format the markdown result into sections with better styling
  const formatResultSections = () => {
    if (!result) return null;
    
    // Split into sections
    const sections = result.split(/##\s+([A-Z\s/]+)/);
    if (sections.length <= 1) {
      return <pre className="whitespace-pre-wrap">{result}</pre>;
    }

    const formattedSections = [];
    // Skip the first empty item
    for (let i = 1; i < sections.length; i += 2) {
      const title = sections[i];
      const content = sections[i + 1] || "";
      
      let icon = <Info size={18} />;
      let titleClass = "text-blue-400";
      
      if (title.includes("CRITICAL") || title.includes("VULNERABILITIES")) {
        icon = <AlertTriangle size={18} className="text-red-400" />;
        titleClass = "text-red-400";
      } else if (title.includes("RECOMMENDATIONS")) {
        icon = <CheckCircle size={18} className="text-green-400" />;
        titleClass = "text-green-400";
      }
      
      formattedSections.push(
        <div key={i} className="mb-6">
          <div className="flex items-center mb-2">
            {icon}
            <h4 className={`font-bold text-md ml-2 ${titleClass}`}>{title}</h4>
          </div>
          <div className="pl-6 border-l border-gray-700">
            <pre className="whitespace-pre-wrap text-gray-300">{content}</pre>
          </div>
        </div>
      );
    }
    
    return formattedSections;
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Smart Contract Analyzer
        </h2>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          Paste a contract address or code for AI-powered security audit
        </p>
      </div>
      
      <div className="space-y-4 bg-dark-2 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-700">
        <div>
          <label className="text-sm text-gray-400 block mb-1">Contract Address or Source Code</label>
          <textarea
            placeholder="Enter a 0x... contract address or paste contract source code directly"
            value={contractInput}
            onChange={(e) => setContractInput(e.target.value)}
            rows={3}
            className="w-full p-3 text-base sm:text-lg rounded bg-dark-1 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y"
          />
          
          <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div>
              <label className="text-sm text-gray-400 block mb-1">Network (for addresses)</label>
              <div className="flex space-x-1">
                {networks.map(network => (
                  <button
                    key={network.id}
                    onClick={() => setSelectedNetwork(network.id)}
                    className={`px-2 py-1 text-xs rounded ${
                      selectedNetwork === network.id 
                        ? 'bg-red-600 text-white' 
                        : 'bg-dark-1 hover:bg-gray-700 text-gray-400'
                    }`}
                  >
                    {network.name}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Supports verified contract addresses or direct source code input
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={analyzeContract}
            className="bg-red-600 hover:bg-red-700 cursor-pointer p-3 flex-1 font-medium text-white transition-all duration-200 transform hover:scale-[1.02]"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </div>
            ) : (
              "Analyze Contract"
            )}
          </Button>
          <Button 
            onClick={() => setContractInput('')}
            className="bg-transparent hover:bg-dark-1 p-3 border border-gray-600 font-medium transition-all duration-200"
            disabled={loading || !contractInput}
          >
            Clear
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-900/40 border border-red-700 p-4 rounded-lg text-white animate-fadeIn">
          <div className="flex items-center mb-1">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
            <span className="font-bold">Error</span>
          </div>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-dark-2 border border-gray-700 p-4 sm:p-5 rounded-lg shadow-lg animate-fadeIn">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-blue-400">Analysis Result</h3>
            <div className="flex space-x-1">
              <button 
                className="p-1 hover:bg-gray-700 rounded" 
                title="Copy to clipboard"
                onClick={copyToClipboard}
              >
                <Clipboard className="h-5 w-5 text-gray-400" />
              </button>
              <button 
                className="p-1 hover:bg-gray-700 rounded" 
                title="Download report"
                onClick={downloadReport}
              >
                <Download className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
          
          {/* Analysis metadata */}
          {analysisData && analysisData.address && (
            <div className="mb-4 bg-dark-1 p-3 rounded-md text-sm">
              <div className="flex justify-between flex-wrap">
                <div>
                  <span className="text-gray-400">Contract:</span>{" "}
                  <span className="text-gray-200">{analysisData.address.substring(0, 8)}...{analysisData.address.substring(36)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Network:</span>{" "}
                  <span className="text-gray-200">{analysisData.network}</span>
                </div>
                <div>
                  <span className="text-gray-400">Date:</span>{" "}
                  <span className="text-gray-200">{new Date(analysisData.timestamp).toLocaleString()}</span>
                </div>
              </div>
              
              {analysisData.securityScore !== undefined && (
                <div className="mt-2 flex items-center">
                  <Shield className={`mr-2 ${getScoreColor(analysisData.securityScore)}`} size={18} />
                  <span className="text-gray-400">Security Score:</span>{" "}
                  <span className={`ml-1 font-bold ${getScoreColor(analysisData.securityScore)}`}>
                    {analysisData.securityScore}/10
                  </span>
                </div>
              )}
            </div>
          )}
          
          {/* Formatted result sections */}
          <div className="bg-dark-1 p-4 rounded-md overflow-auto max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] text-gray-200 text-sm sm:text-base">
            {formatResultSections()}
          </div>
        </div>
      )}
    </div>
  );
}
