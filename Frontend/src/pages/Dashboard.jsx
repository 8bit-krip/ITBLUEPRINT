import React, { useState, useEffect } from 'react';
import DonutChart from '../components/DonutChart';
import SubheadingModal from '../components/SubheadingModal';
import { fetchSheetData } from '../utils/fetchData';

const COLOR_MAP = {
  Green: '#228B22',
  Red: '#D93434',
  Gray: '#A0AEC0',
};

function Dashboard() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchSheetData();
      setData(res);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.message === "Network Error"
          ? "Could not connect to the API. Please ensure the server is running and the API URL is correct."
          : "An unexpected error occurred while fetching data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCardClick = (title, values) => {
    const hasSubheadings = values?.Subheading && Object.keys(values.Subheading).length > 0;
    if (hasSubheadings) {
      setSelectedService({ title, ...values });
    }
  };

  const items = Object.entries(data?.Sheet1 || {});

  // ---------- Loading UI ----------
  if (loading && !items.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
        </svg>
        <p className="text-gray-700 text-lg font-medium">Loading Dashboard...</p>
      </div>
    );
  }

  // ---------- Error UI ----------
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700 p-8">
        <div className="text-center bg-white p-10 rounded-2xl shadow-lg border border-red-200">
          <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
          <p className="max-w-md mx-auto">{error}</p>
          <button
            onClick={fetchData}
            className="mt-6 px-6 py-2.5 text-sm bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ---------- Main UI ----------
  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-10 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <h1 className="text-3xl font-bold text-gray-800">🔐 Security Dashboard</h1>
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-5 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8l-4 4 4 4v-4a8 8 0 010 16z" />
              </svg>
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              🔄 <span>Refresh Data</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map(([title, values], idx) => {
          const compliantColor = COLOR_MAP[values?.status_C?.colour] || COLOR_MAP.Green;
          const nonCompliantColor = COLOR_MAP[values?.status_E?.colour] || COLOR_MAP.Red;
          const hasSubheadings = values?.Subheading && Object.keys(values.Subheading).length > 0;

          return (
            <div
              key={idx}
              onClick={() => handleCardClick(title, values)}
              className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between transition duration-300 ${
                hasSubheadings ? 'cursor-pointer hover:shadow-lg hover:border-blue-400' : ''
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-lg font-semibold text-center text-gray-800 w-full truncate">{title}</h2>
                <div className="flex gap-2 text-xs font-semibold">
                  {values?.status_C && (
                    <span className="px-3 py-1 rounded-full text-white" style={{ backgroundColor: compliantColor }}>
                      {values.status_C.name}
                    </span>
                  )}
                  {values?.status_E && (
                    <span className="px-3 py-1 rounded-full text-white" style={{ backgroundColor: nonCompliantColor }}>
                      {values.status_E.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center mt-6">
                <DonutChart
                  compliant={values.Compliant}
                  total={values.Total}
                  colors={[compliantColor, nonCompliantColor]}
                  labels={[
                    values?.status_C?.name || 'Compliant',
                    values?.status_E?.name || 'Non-Compliant',
                  ]}
                />
                <p className="text-sm mt-3 text-gray-600 font-medium">
                  {values.Compliant} / {values.Total} &nbsp; ({values['%Compliant'] || 'N/A'})
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {selectedService && (
        <SubheadingModal service={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </div>
  );
}

export default Dashboard;
