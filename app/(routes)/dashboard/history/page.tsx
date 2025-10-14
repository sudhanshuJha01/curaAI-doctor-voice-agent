import React from 'react';
import HistoryList from '../_components/HistoryList';
import { Clock, FileText } from 'lucide-react';

const HistoryPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Consultation History
              </h1>
              <p className="text-gray-600 mt-1">
                View all your past medical consultations and reports
              </p>
            </div>
          </div>
        </div>

        <HistoryList />
      </div>
    </div>
  );
};

export default HistoryPage;