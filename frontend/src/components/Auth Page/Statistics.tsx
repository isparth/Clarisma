// Statistics.tsx

"use client";

import { BarChart3, TrendingUp, Users } from "lucide-react";

const Statistics = () => {
  return (
    <div className="bg-gray-100 p-6 flex flex-col justify-center">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        Improve Your Chances
      </h3>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <BarChart3 className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-2xl font-bold text-gray-800">93%</p>
            <p className="text-sm text-gray-600">
              of communication is non-verbal
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <TrendingUp className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-2xl font-bold text-gray-800">65%</p>
            <p className="text-sm text-gray-600">
              increase in interview success rate
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Users className="w-8 h-8 text-purple-500" />
          <div>
            <p className="text-2xl font-bold text-gray-800">Top 10%</p>
            <p className="text-sm text-gray-600">
              Stand out from other candidates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
