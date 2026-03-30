'use client';

import { useState } from 'react';

export default function RevokePage() {
  const [id, setId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRevoke = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/credentials/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(id) }),
      });

      if (res.ok) {
        setMessage('Credential revoked successfully!');
        setId('');
      } else {
        const error = await res.json();
        setMessage(`Error: ${error.error || 'Failed to revoke'}`);
      }
    } catch (err) {
      setMessage('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Revoke Credential</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-md">
        <form onSubmit={handleRevoke}>
          <div className="mb-4">
            <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
              Credential ID
            </label>
            <input
              type="number"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-700 disabled:bg-red-300 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? 'Revoking...' : 'Revoke Credential'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}