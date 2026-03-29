"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [recipient, setRecipient] = useState("");
  const [uri, setUri] = useState("");
  const [txHash, setTxHash] = useState("");

  const handleIssue = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/credentials/issue`, {
        recipient,
        uri,
      });
      setTxHash(res.data.txHash);
    } catch (err) {
      console.error(err);
      alert("Error issuing credential");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>VeriChain - Issue Credential</h1>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        style={{ marginRight: "1rem" }}
      />
      <input
        type="text"
        placeholder="Metadata URI"
        value={uri}
        onChange={(e) => setUri(e.target.value)}
        style={{ marginRight: "1rem" }}
      />
      <button onClick={handleIssue}>Issue Credential</button>

      {txHash && (
        <p>
          Transaction Hash: <code>{txHash}</code>
        </p>
      )}
    </div>
  );
}
