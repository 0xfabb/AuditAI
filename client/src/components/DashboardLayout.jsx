import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import ContractAnalyzer from "./ContractAnalyzer";

export default function DashboardLayout() {
  const [page, setPage] = useState("analyze");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when page changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [page]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-['Open Sans'] bg-dark-1">
      {/* Mobile Header */}
      <div className="md:hidden bg-dark-2 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">AuditAI</h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white p-2"
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar - hidden on mobile unless menu is open */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block md:relative z-10`}>
        <Sidebar setPage={setPage} activePage={page} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-3 md:p-6 bg-dark-1 text-white overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {page === "analyze" && <ContractAnalyzer />}
          {page === "home" && (
            <div className="bg-dark-2 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Welcome to AuditAI</h2>
              <p className="text-gray-300">Analyze smart contracts with AI-powered security auditing.</p>
            </div>
          )}
          {page === "reports" && (
            <div className="bg-dark-2 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Your Reports</h2>
              <p className="text-gray-300">No reports found. Analyze a contract to generate reports.</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <footer className="mt-auto text-center p-4 text-gray-500 text-sm">
          <p>AuditAI © 2025 - {new Date().getFullYear()} | User: 0xfabb</p>
          <p>Last updated: 2025-03-09</p>
        </footer>
      </div>
    </div>
  );
}