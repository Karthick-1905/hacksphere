import React, { useState } from 'react';
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
import { Settings, DollarSign, Package, TrendingUp, AlertTriangle } from 'lucide-react';

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

const OrderSimulation = () => {
  // Simulation parameters
  const [supplyLevel, setSupplyLevel] = useState(1000);
  const [pricePerUnit, setPricePerUnit] = useState(100);
  const [leadTime, setLeadTime] = useState(5);
  const [safetyStock, setSafetyStock] = useState(200);
  const [reorderPoint, setReorderPoint] = useState(300);

  // Sample base forecast data
  const dates = ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5', 'Jan 6', 'Jan 7'];
  const baseDemand = [800, 850, 900, 950, 1000, 1050, 1100];

  // Calculate simulated values based on parameters
  const calculateSimulatedDemand = () => {
    const priceElasticity = -0.5; // Sample price elasticity
    const priceEffect = (100 - pricePerUnit) * priceElasticity;
    return baseDemand.map(demand => 
      Math.max(0, demand * (1 + priceEffect / 100))
    );
  };

  const simulatedDemand = calculateSimulatedDemand();
  const simulatedSupply = Array(7).fill(supplyLevel);
  
  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Simulated Demand',
        data: simulatedDemand,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Supply Level',
        data: simulatedSupply,
        borderColor: 'rgb(22, 163, 74)',
        borderDash: [5, 5],
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
        text: 'Supply and Demand Simulation',
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
    },
  };

  // Calculate key metrics
  const averageDemand = simulatedDemand.reduce((a, b) => a + b, 0) / simulatedDemand.length;
  const stockoutRisk = supplyLevel < averageDemand ? 'High' : supplyLevel < averageDemand * 1.2 ? 'Medium' : 'Low';
  const profitMargin = ((pricePerUnit - 70) / pricePerUnit) * 100; // Assuming cost is 70
  const totalRevenue = averageDemand * pricePerUnit;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Simulation</h1>
        <p className="text-gray-600">
          Adjust supply chain parameters to simulate different scenarios
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Simulation Controls
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supply Level
            </label>
            <input
              type="range"
              min="500"
              max="2000"
              value={supplyLevel}
              onChange={(e) => setSupplyLevel(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-600 mt-1">{supplyLevel} units</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per Unit
            </label>
            <input
              type="range"
              min="50"
              max="200"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-600 mt-1">${pricePerUnit}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lead Time (days)
            </label>
            <input
              type="range"
              min="1"
              max="14"
              value={leadTime}
              onChange={(e) => setLeadTime(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-600 mt-1">{leadTime} days</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Safety Stock
            </label>
            <input
              type="range"
              min="100"
              max="500"
              value={safetyStock}
              onChange={(e) => setSafetyStock(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-600 mt-1">{safetyStock} units</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reorder Point
            </label>
            <input
              type="range"
              min="200"
              max="600"
              value={reorderPoint}
              onChange={(e) => setReorderPoint(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-600 mt-1">{reorderPoint} units</div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-gray-700">Average Demand</div>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(averageDemand)} units
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-gray-700">Stock-out Risk</div>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stockoutRisk}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-gray-700">Profit Margin</div>
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{profitMargin.toFixed(1)}%</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-gray-700">Est. Revenue</div>
            <Package className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${Math.round(totalRevenue).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Simulation Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <Line options={options} data={data} height={80} />
      </div>

      {/* Analysis and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Simulation Analysis</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
              <span>Current supply level {supplyLevel < averageDemand ? 'may not meet' : 'should meet'} expected demand</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-2 mr-2"></span>
              <span>Price point suggests a {profitMargin > 25 ? 'healthy' : 'tight'} profit margin</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mt-2 mr-2"></span>
              <span>Lead time of {leadTime} days requires careful inventory management</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h2>
          <ul className="space-y-3">
            {stockoutRisk === 'High' && (
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mt-2 mr-2"></span>
                <span>Consider increasing supply level to reduce stock-out risk</span>
              </li>
            )}
            {profitMargin < 20 && (
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mt-2 mr-2"></span>
                <span>Review pricing strategy to improve profit margins</span>
              </li>
            )}
            {leadTime > 7 && (
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mt-2 mr-2"></span>
                <span>Look for suppliers with shorter lead times</span>
              </li>
            )}
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mt-2 mr-2"></span>
              <span>Maintain safety stock at {safetyStock} units for optimal buffer</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderSimulation;