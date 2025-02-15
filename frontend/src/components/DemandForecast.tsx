import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, Box, Calendar } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DemandForecast = () => {
  // Sample data - replace with actual data from your backend
  const dates = ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5', 'Jan 6', 'Jan 7', 'Jan 8', 'Jan 9', 'Jan 10'];
  const actualDemand = [150, 180, 160, 200, 175, 190, 220, 210, 230, 200];
  const predictedDemand = [155, 175, 165, 195, 180, 185, 215, 205, 225, 210];
  const supply = [160, 170, 155, 190, 180, 195, 210, 200, 220, 205];
  
  // Forecast data for next 5 days
  const futureDates = ['Jan 11', 'Jan 12', 'Jan 13', 'Jan 14', 'Jan 15'];
  const forecastDemand = [215, 225, 235, 240, 250];

  const data = {
    labels: [...dates, ...futureDates],
    datasets: [
      {
        label: 'Actual Demand',
        data: [...actualDemand, ...Array(futureDates.length).fill(null)],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Predicted Demand',
        data: [...predictedDemand, ...forecastDemand],
        borderColor: 'rgb(234, 88, 12)',
        borderDash: [5, 5],
        tension: 0.4,
      },
      {
        label: 'Supply',
        data: [...supply, ...Array(futureDates.length).fill(null)],
        borderColor: 'rgb(22, 163, 74)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Demand Forecast Analysis',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Units',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Demand Forecasting</h1>
        <p className="text-gray-600">
          Analyze historical demand patterns and view predictions for upcoming periods
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold text-gray-700">Current Demand</div>
            <TrendingUp className="h-6 w-6 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">230</div>
          <div className="text-sm text-green-600 mt-2">↑ 12% from last period</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold text-gray-700">Forecast Accuracy</div>
            <Box className="h-6 w-6 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">94%</div>
          <div className="text-sm text-blue-600 mt-2">↑ 2% improvement</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold text-gray-700">Forecast Period</div>
            <Calendar className="h-6 w-6 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">15 Days</div>
          <div className="text-sm text-gray-600 mt-2">Updated daily</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <Line options={options} data={data} className="h-[400px]" />
      </div>

      {/* Analysis Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Forecast Insights</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
              <span>Demand is expected to increase by 15% in the next period</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mt-2 mr-2"></span>
              <span>Historical forecast accuracy remains above 90%</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-2 mr-2"></span>
              <span>Supply has consistently met demand in the past week</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommendations</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mt-2 mr-2"></span>
              <span>Consider increasing inventory by 10% to meet rising demand</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 mt-2 mr-2"></span>
              <span>Monitor supplier capacity for upcoming demand spike</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mt-2 mr-2"></span>
              <span>Review safety stock levels based on forecast uncertainty</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DemandForecast;