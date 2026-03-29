"use client";
import { useState } from "react";
import axios from "axios";

export default function Verify() {
  const [id, setId] = useState("");
  const [valid, setValid] = useState<string | null>(null);

  const handleVerify = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/credentials/verify/${id}`);
      setValid(res.data.valid ? "Valid" : "Revoked");
    } catch (err) {
      console.error(err);
      alert("Error verifying credential");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>VeriChain - Verify Credential</h1>
      <input
        type="number"
        placeholder="Credential ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        style={{ marginRight: "1rem" }}
      />
      <button onClick={handleVerify}>Verify</button>

      {valid && <p>Status: {valid}</p>}
    </div>
  );
}
