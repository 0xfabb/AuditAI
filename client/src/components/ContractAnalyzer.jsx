import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";


export default function ContractAnalyzer() {
  const [contractAddress, setContractAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeContract = () => {
    if (!contractAddress) return;
    setLoading(true);

    // Simulate API Call
    setTimeout(() => {
      setResult({
        risk: "Medium",
        summary: "This contract has some security concerns...",
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div>
      <h2 className="text-2xl mb-4 font-bold">Analyze a Smart Contract</h2>
      <div className="space-y-4">
        <Input 
          placeholder="Enter Contract Address" 
          value={contractAddress} 
          onChange={(e) => setContractAddress(e.target.value)}
          className="p-3 text-lg rounded bg-gray-700 border border-gray-600"
        />
        <Button 
          onClick={analyzeContract} 
          className="bg-blue-600 hover:bg-blue-700 p-3 w-full"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Contract"}
        </Button>
      </div>

      {result && (
        <div className="mt-6 bg-gray-700 p-4 rounded">
          <h3 className="text-lg font-semibold">Analysis Result</h3>
          <p><strong>Risk Level:</strong> {result.risk}</p>
          <p>{result.summary}</p>
        </div>
      )}
    </div>
  );
}
