import Sidebar from "./Sidebar";
import { useState } from "react";
import ContractAnalyzer from "./ContractAnalyzer";

export default function DashboardLayout() {
  const [page, setPage] = useState("analyze");

  return (
    <div className="flex h-screen font-[Open Sans] ">
      <Sidebar setPage={setPage} />
      <div className="flex-1 p-6 bg-dark-1 text-white">
        {page === "analyze" && <ContractAnalyzer />}
        {page === "home" && <h2 className="text-3xl font-bold">Welcome to AuditAI</h2>}
        {page === "reports" && <h2 className="text-3xl font-bold">Your Reports</h2>}
      </div>
    </div>
  );
}
