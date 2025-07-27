import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';

// Color mapper
const getColor = (colour) => {
  const colorMap = {
    Green: '#228B22',
    Red: '#D93434',
    Gray: '#A0AEC0',
  };
  return colorMap[colour?.trim()] || '#A0AEC0';
};

const SubheadingModal = ({ service, onClose }) => {
  const subheadings = Object.entries(service.Subheading || {});

  return (
    <Dialog open={!!service} onClose={onClose} className="relative z-50">
      {/* Blurred Background */}
      <div className="fixed inset-0 bg-white/10 backdrop-blur-md" aria-hidden="true" />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl max-w-4xl w-full p-8 relative ring-1 ring-gray-300">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title */}
          <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {service.title} - Overview
          </Dialog.Title>

          {/* Donut Charts Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {subheadings.map(([subTitle, val], i) => {
              const color = getColor(val.colour);
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 border shadow flex flex-col items-center justify-center"
                >
                  <div className="relative w-24 h-24">
                    <PieChart width={96} height={96}>
                      <Pie
                        data={[{ name: 'Filled', value: 100 }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={48}
                        dataKey="value"
                        startAngle={90}
                        endAngle={450}
                      >
                        <Cell key="cell" fill={color} />
                      </Pie>
                    </PieChart>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">100%</span>
                    </div>
                  </div>
                  <p className="text-sm mt-3 text-gray-800 font-semibold text-center">{subTitle}</p>
                </div>
              );
            })}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default SubheadingModal;
