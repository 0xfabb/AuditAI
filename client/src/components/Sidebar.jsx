import { Home, Search, FileText } from "lucide-react";

export default function Sidebar({ setPage }) {
  return (
    <div className="h-screen w-64 bg-dark-2 text-white p-6 flex flex-col font-bold">
      <h1 className="text-2xl font-bold mb-6">AuditAI</h1>
      <nav className="space-y-4">
        <button onClick={() => setPage("home")} className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded">
          <Home size={20} />
          <span>Home</span>
        </button>
        <button onClick={() => setPage("analyze")} className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded">
          <Search size={20} />
          <span>Analyze Contract</span>
        </button>
        <button onClick={() => setPage("reports")} className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded">
          <FileText size={20} />
          <span>Reports</span>
        </button>
      </nav>
    </div>
  );
}
