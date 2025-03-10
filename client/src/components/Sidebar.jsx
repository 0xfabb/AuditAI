import { Home, Search, FileText, Shield, FileSearch } from "lucide-react";

export default function Sidebar({ setPage, activePage }) {
  const menuItems = [
    { id: "home", label: "Home", icon: <Home size={20} /> },
    { id: "analyze", label: "Analyze Contract", icon: <Search size={20} /> },
    { id: "whitepaper", label: "Whitepaper Analysis", icon: <FileSearch size={20} /> },
    { id: "reports", label: "Reports", icon: <FileText size={20} /> }
  ];

  return (
    <div className="h-full md:h-screen w-full md:w-64 bg-dark-2 text-white flex flex-col shadow-lg">
      <div className="p-4 md:p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Shield size={24} className="text-blue-400" />
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            AuditAI
          </h1>
        </div>
        <p className="text-xs text-gray-400 mt-1 pl-9">Smart Contract Security</p>
      </div>
      
      <nav className="flex-1 p-2 md:p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`flex items-center w-full space-x-3 p-3 rounded-lg transition-all duration-200 
              ${activePage === item.id 
                ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-400' 
                : 'hover:bg-gray-700/50 border-l-4 border-transparent'}`}
          >
            <div className="text-gray-400">{item.icon}</div>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 p-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="font-medium text-sm">0x</span>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-300">0xfabb</p>
            <p className="text-xs text-gray-500">Connected</p>
          </div>
        </div>
      </div>
    </div>
  );
}