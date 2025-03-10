
# **📌 AuditAI – AI-Powered Smart Contract Auditor**  

> 🚀 **Secure Your Smart Contracts with AI Intelligence**  

AuditAI is an **AI-driven security tool** that scans **Ethereum smart contracts** for vulnerabilities and security flaws. It leverages **Gemini AI** and **Etherscan API** to detect potential exploits and provide actionable security insights.  

---

## **📖 Table of Contents**  

1. [Introduction](#introduction)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [System Architecture](#system-architecture)  
5. [Installation & Setup](#installation--setup)  
6. [Usage Guide](#usage-guide)  
7. [API Endpoints](#api-endpoints)  
8. [Future Enhancements](#future-enhancements)  
9. [Contributing](#contributing)  
10. [License](#license)  

---

## **📌 Introduction**  

AuditAI ensures **smart contract security** before deployment by **analyzing vulnerabilities** and **generating AI-powered security reports**.  

### **Who is it for?**  
✅ **Developers** – Test contract security before deployment  
✅ **Security Auditors** – Automate vulnerability analysis  
✅ **Blockchain Projects** – Improve trust and safety in DeFi & Web3  

---

## **🌟 Features**  

| Feature | Description |
|---------|------------|
| **🚀 AI-Powered Analysis** | Uses **Gemini AI** to scan Solidity contracts and detect vulnerabilities |
| **🔍 Smart Contract Fetching** | Automatically pulls contract code from **Etherscan** using an address |
| **📂 Solidity File Upload** | Allows manual contract uploads for auditing |
| **🛑 Risk Level Indicator** | AI categorizes risk as **Low, Medium, or High** |
| **📊 Detailed Security Report** | Displays detected vulnerabilities and suggested fixes |
| **📄 Report Download (PDF)** | Users can download a professional security report |
| **🔗 Wallet Authentication (Future)** | Connect via WalletConnect for contract ownership verification |
| **🏆 Gamification (Future)** | Earn badges & rankings for security contributions |

---

## **🛠️ Tech Stack**  

| **Technology** | **Purpose** |
|---------------|------------|
| **React.js (Vite)** | Frontend UI |
| **Tailwind CSS** | Modern UI design |
| **Node.js + Express.js** | Backend API |
| **MongoDB (Optional)** | Storing analysis history |
| **Gemini AI API** | AI-powered contract analysis |
| **Etherscan API** | Fetching live smart contract data |

---

## **⚙️ System Architecture**  

```mermaid
graph TD;
  User -->|Inputs Contract Address or Uploads File| Frontend;
  Frontend -->|Sends Request| Backend(API Server);
  Backend -->|Fetches Contract| Etherscan API;
  Backend -->|Sends Contract Code| Gemini AI API;
  Gemini AI API -->|Returns Analysis| Backend;
  Backend -->|Sends Security Report| Frontend;
  Frontend -->|Displays Audit Report| User;
```

---

## **🚀 Installation & Setup**  

### **🔹 Prerequisites**  
- **Node.js** (v18+ recommended)  
- **MongoDB** (if using database)  
- **Etherscan API Key**  
- **Gemini API Key**  

### **🔹 Clone the Repository**  
```bash
git clone https://github.com/yourusername/auditai.git
cd auditai
```

### **🔹 Install Dependencies**  
```bash
npm install
```

### **🔹 Set Up Environment Variables**  
Create a `.env` file in the root directory:  
```
GEMINI_API_KEY=your-gemini-api-key
ETHERSCAN_API_KEY=your-etherscan-api-key
PORT=5000
```

### **🔹 Run the Project**  
```bash
npm run dev
```

---

## **📖 Usage Guide**  

### **1️⃣ Analyze a Smart Contract**  
- Enter a **contract address** (fetched from Etherscan)  
- OR upload a **Solidity contract file**  
- Click **Analyze**  

### **2️⃣ Review Security Report**  
- AI-generated **summary** of vulnerabilities  
- **Risk level classification** (Low, Medium, High)  
- **Recommended Fixes**  

### **3️⃣ Download Report**  
- Option to download a **PDF audit report**  

---

## **📡 API Endpoints**  

### **🔍 Fetch Smart Contract from Etherscan**  
```http
GET /fetch-contract?address={contract_address}
```
📌 **Returns:**  
```json
{
  "contract": "pragma solidity ^0.8.0; contract Test {...}"
}
```

---

### **🔎 Analyze Smart Contract with AI**  
```http
POST /analyze-contract
```
📌 **Body:**  
```json
{
  "contract_code": "pragma solidity ^0.8.0; contract Test {...}"
}
```
📌 **Returns:**  
```json
{
  "risk": "Medium",
  "issues": [
    { "type": "Reentrancy", "description": "Function X is vulnerable." }
  ],
  "recommendations": ["Use reentrancy guard."]
}
```

---

## **🎯 Why Choose AuditAI?**  

✅ **Instant AI-powered contract analysis** – No need for manual audits  
✅ **Simple & Developer-Friendly** – Just enter a contract address or upload a file  
✅ **AI-Generated Security Reports** – Comprehensive, readable, and actionable  
✅ **Scalable & Future-Proof** – Wallet authentication & gamification coming soon  

---

## **🚀 Future Enhancements**  

🔹 **📡 Real-time contract monitoring**  
🔹 **🛠️ AI-powered auto-fixes for vulnerabilities**  
🔹 **🔗 On-chain verification of audit reports**  
🔹 **🏆 Leaderboard & rewards for security contributors**  

---

## **👨‍💻 How to Contribute**  

1. **Fork the repo**  
2. **Create a feature branch** (`git checkout -b feature-name`)  
3. **Commit your changes** (`git commit -m "Added new feature"`)  
4. **Push and create a Pull Request**  

> **GitHub Repo:** [🔗 Add link here]  

---

## **📝 License**  

AuditAI is **open-source** under the **MIT License**.  

---

## **🚀 Ready to Secure Web3?**  

🔗 **Try AuditAI today & protect your smart contracts!** 🚀  


