import React, { useState } from 'react';
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { FileText, Link, Upload, Download, Clipboard } from 'lucide-react';
import axios from 'axios';

export default function WhitepaperAnalyzer() {
  const [inputType, setInputType] = useState('url');
  const [inputValue, setInputValue] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.pdf')) {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError("Please upload a valid PDF file");
    }
  };

  const handleSubmit = async () => {
    if (inputType !== 'file' && !inputValue.trim()) {
      setError("Please enter a valid URL");
      return;
    }
    
    if (inputType === 'file' && !file) {
      setError("Please upload a PDF file");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let response;
      
      if (inputType === 'url') {
        // Send URL to server
        response = await axios.post('http://localhost:5000/api/analyze-whitepaper-url', {
          url: inputValue.trim()
        });
      } else {
        // Send file to server
        const formData = new FormData();
        formData.append('whitepaper', file);
        
        response = await axios.post(
          'http://localhost:5000/api/analyze-whitepaper-file',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }
      
      setResult(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'Failed to analyze whitepaper. Please try again.');
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
  };

  const downloadReport = () => {
    if (!result) return;
    
    // Format the report content
    const content = `
# ${result.projectName} Analysis Report

## Overview
${result.overview}

## Team
${result.team}

## Tokenomics
${result.tokenomics}

## Technology
${result.technology}

## Risk Factors
${result.risks}

Analysis generated on ${new Date().toISOString().split('T')[0]}
    `;
    
    // Create a blob and download it
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.projectName.replace(/\s+/g, '-')}-analysis.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Whitepaper Analysis
        </h2>
        <p className="text-sm text-gray-400">
          Extract key insights from whitepapers and tokenomics
        </p>
      </div>
      
      <div className="space-y-4 bg-dark-2 p-4 rounded-xl shadow-lg border border-gray-700">
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setInputType('url')}
            className={`px-3 py-1 rounded-md text-sm ${inputType === 'url' ? 'bg-red-600 text-white' : 'bg-dark-1 text-gray-400'}`}
          >
            <Link size={14} className="inline mr-1" />
            URL
          </button>
          <button
            onClick={() => setInputType('file')}
            className={`px-3 py-1 rounded-md text-sm ${inputType === 'file' ? 'bg-red-600 text-white' : 'bg-dark-1 text-gray-400'}`}
          >
            <Upload size={14} className="inline mr-1" />
            Upload PDF
          </button>
        </div>
        
        {inputType === 'url' && (
          <div>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="https://project.com/whitepaper.pdf"
              className="p-2 text-sm rounded bg-dark-1 border border-gray-600"
            />
          </div>
        )}
        
        {inputType === 'file' && (
          <div>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center bg-dark-1">
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                id="whitepaper-file"
                onChange={handleFileChange}
              />
              <label htmlFor="whitepaper-file" className="cursor-pointer block">
                <FileText size={24} className="mx-auto text-gray-500 mb-2" />
                <p className="text-gray-400 text-sm">
                  {file ? file.name : "Drop PDF file here or click to browse"}
                </p>
              </label>
            </div>
          </div>
        )}
        
        <Button
          onClick={handleSubmit}
          className="bg-red-600 hover:bg-red-700 cursor-pointer p-2 w-full font-medium text-sm"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Document"}
        </Button>
      </div>

      {error && (
        <div className="mt-4 bg-red-900/40 border border-red-700 p-3 rounded-lg text-white text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 bg-dark-2 border border-gray-700 p-4 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-white">{result.projectName}</h3>
            <div className="flex space-x-1">
              <button 
                className="p-1 hover:bg-gray-700 rounded" 
                title="Copy to clipboard"
                onClick={copyToClipboard}
              >
                <Clipboard className="h-4 w-4 text-gray-400" />
              </button>
              <button 
                className="p-1 hover:bg-gray-700 rounded" 
                title="Download report"
                onClick={downloadReport}
              >
                <Download className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="text-blue-400 font-medium mb-1">Overview</h4>
              <p className="text-gray-300">{result.overview}</p>
            </div>
            
            <div>
              <h4 className="text-blue-400 font-medium mb-1">Team</h4>
              <p className="text-gray-300">{result.team}</p>
            </div>
            
            <div>
              <h4 className="text-blue-400 font-medium mb-1">Tokenomics</h4>
              <p className="text-gray-300 whitespace-pre-line">{result.tokenomics}</p>
            </div>
            
            <div>
              <h4 className="text-blue-400 font-medium mb-1">Technology</h4>
              <p className="text-gray-300">{result.technology}</p>
            </div>
            
            <div>
              <h4 className="text-blue-400 font-medium mb-1">Risk Factors</h4>
              <p className="text-gray-300">{result.risks}</p>
            </div>
            
            <div className="text-xs text-gray-500 text-right mt-2">
              Analysis generated for 0xfabb on 2025-03-10 05:13:19
            </div>
          </div>
        </div>
      )}
    </div>
  );
}