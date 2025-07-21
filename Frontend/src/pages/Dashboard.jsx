// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import DonutChart from '../components/DonutChart';
import axios from 'axios';

export default function Dashboard() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/api/sheet-data');
      setData(res?.data || {});
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const items = Object.entries(data.Sheet1 || {});

  if (loading) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
      <svg
        className="animate-spin h-8 w-8 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
        ></path>
      </svg>
      <p className="text-gray-700 text-lg font-medium">
        Refreshing...
      </p>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-10 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
          🔐 Security Dashboard
        </h1>
        <button
          onClick={fetchData}
          className="px-5 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md transition-all"
        >
          🔄 Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map(([title, values], idx) => {
          const status = values.Status || 'N/A';
          const compliant = values.Compliant ?? 0;
          const total = values.Total ?? 0;
          const percent = values['% Compliant'] || 'N/A';

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-lg font-semibold text-center text-gray-800 w-full truncate">
                  {title}
                </h2>

                <div className="flex gap-2 text-xs font-semibold">
                  <span className="px-3 py-1 rounded-full bg-green-700 text-white">
                    {status}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-red-400 text-gray-700">
                    Not {status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center mt-6">
                <DonutChart compliant={compliant} total={total} />
                <p className="text-sm mt-3 text-gray-600 font-medium">
                  {compliant} / {total} &nbsp; ({percent})
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
