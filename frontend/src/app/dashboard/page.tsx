'use client';

import { useEffect, useState } from 'react';

interface Credential {
  id: number;
  issuer: string;
  recipient: string;
  metadataURI: string;
  timestamp: number;
  revoked: boolean;
}

export default function Dashboard() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + '/credentials/all')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCredentials(data);
        } else {
          console.error('Received data is not an array:', data);
          setError('Invalid data format received');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load credentials');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6">Loading credentials...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        VeriChain Dashboard
      </h1>

      {credentials.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          No credentials found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Recipient</th>
                <th className="py-3 px-4 text-left">Issuer</th>
                <th className="py-3 px-4 text-left">Issued At</th>
              </tr>
            </thead>

            <tbody>
              {credentials.map((cred) => (
                <tr
                  key={cred.id}
                  className="border-b hover:bg-gray-100"
                >
                  <td className="py-3 px-4">{cred.id}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        cred.revoked
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {cred.revoked ? 'Revoked' : 'Active'}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    {cred.recipient}
                  </td>

                  <td className="py-3 px-4 font-mono">
                    {cred.issuer}
                  </td>

                  <td className="py-3 px-4">
                    {new Date(
                      cred.timestamp * 1000
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}