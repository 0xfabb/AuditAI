import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import axios from "axios";

export default function ContractAnalyzer() {
  const [contractAddress, setContractAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyzeContract = async () => {
    if (!contractAddress) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post("http://localhost:5000/contract", {
        prompt: contractAddress, // Corrected key name to match backend
      });

      console.log("Response:", response.data);
      setResult(response.data.result); // Extracting correct response field
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError("Failed to analyze contract. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl mb-4 font-bold text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
        Smart Contract Analyzer
      </h2>
      
      <div className="space-y-4 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <label className="text-sm text-gray-400 block mb-1">Contract Address or Code</label>
        <Input
          placeholder="Enter Contract Address or Paste Contract Code"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          className="p-3 text-lg rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <Button
          onClick={analyzeContract}
          className="bg-blue-600 hover:bg-blue-700 p-3 w-full font-medium text-white transition-all duration-200 transform hover:scale-[1.02]"
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
      </div>

      {error && (
        <div className="mt-6 bg-red-900/40 border border-red-700 p-4 rounded-lg text-white">
          <div className="flex items-center mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-bold">Error</span>
          </div>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-gray-800 border border-gray-700 p-5 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-3 text-blue-400">Analysis Result</h3>
          <div className="bg-gray-700 p-4 rounded-md overflow-auto max-h-[70vh] text-gray-200 whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}