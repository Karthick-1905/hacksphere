import React, { useState } from 'react';
import { Building2, Plus, MapPin, Package, BarChart3, Warehouse } from 'lucide-react';

interface RetailCenter {
  id: string;
  name: string;
  location: string;
  address: string;
  maxCapacity: number;
  currentStock: number;
  safetyStock: number;
  turnoverRate: number;
  lastRestocked: string;
}

const InventoryManagement = () => {
  const [showAddCenter, setShowAddCenter] = useState(false);
  const [newCenter, setNewCenter] = useState({
    name: '',
    location: '',
    address: '',
    maxCapacity: 10000,
    safetyStock: 1000,
  });

  // Sample data - replace with actual data from backend
  const [retailCenters, setRetailCenters] = useState<RetailCenter[]>([
    {
      id: '1',
      name: 'Downtown Hub',
      location: 'New York',
      address: '123 Main St, New York, NY 10001',
      maxCapacity: 10000,
      currentStock: 7500,
      safetyStock: 1000,
      turnoverRate: 85,
      lastRestocked: '2024-03-10',
    },
    {
      id: '2',
      name: 'West Coast Center',
      location: 'Los Angeles',
      address: '456 Palm Ave, Los Angeles, CA 90001',
      maxCapacity: 15000,
      currentStock: 12000,
      safetyStock: 2000,
      turnoverRate: 92,
      lastRestocked: '2024-03-12',
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRetailCenter: RetailCenter = {
      id: Date.now().toString(),
      ...newCenter,
      currentStock: 0,
      turnoverRate: 0,
      lastRestocked: new Date().toISOString().split('T')[0],
    };
    setRetailCenters([...retailCenters, newRetailCenter]);
    setShowAddCenter(false);
    setNewCenter({
      name: '',
      location: '',
      address: '',
      maxCapacity: 10000,
      safetyStock: 1000,
    });
  };

  const getStockStatus = (center: RetailCenter) => {
    const stockPercentage = (center.currentStock / center.maxCapacity) * 100;
    if (stockPercentage < 20) return 'bg-red-500';
    if (stockPercentage < 40) return 'bg-orange-500';
    if (stockPercentage < 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Inventory Management</h1>
            <p className="text-gray-600">
              Manage retail centers and monitor inventory levels
            </p>
          </div>
          <button
            onClick={() => setShowAddCenter(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Retail Center
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Total Centers</h3>
              <Building2 className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{retailCenters.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Total Capacity</h3>
              <Warehouse className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {retailCenters.reduce((sum, center) => sum + center.maxCapacity, 0).toLocaleString()} units
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Total Stock</h3>
              <Package className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {retailCenters.reduce((sum, center) => sum + center.currentStock, 0).toLocaleString()} units
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Avg Turnover Rate</h3>
              <BarChart3 className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(retailCenters.reduce((sum, center) => sum + center.turnoverRate, 0) / retailCenters.length)}%
            </p>
          </div>
        </div>
      </div>

      {/* Retail Centers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {retailCenters.map((center) => (
          <div key={center.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{center.name}</h3>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {center.location}
                  </div>
                </div>
                <div className={`h-3 w-3 rounded-full ${getStockStatus(center)}`} />
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Inventory Status</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getStockStatus(center)}`}
                      style={{ width: `${(center.currentStock / center.maxCapacity) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>{center.currentStock.toLocaleString()} units</span>
                    <span>{center.maxCapacity.toLocaleString()} max</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Safety Stock</p>
                    <p className="font-semibold">{center.safetyStock.toLocaleString()} units</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Turnover Rate</p>
                    <p className="font-semibold">{center.turnoverRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Restocked</p>
                    <p className="font-semibold">{center.lastRestocked}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Center Modal */}
      {showAddCenter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Retail Center</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Center Name
                </label>
                <input
                  type="text"
                  required
                  value={newCenter.name}
                  onChange={(e) => setNewCenter({ ...newCenter, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={newCenter.location}
                  onChange={(e) => setNewCenter({ ...newCenter, location: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  required
                  value={newCenter.address}
                  onChange={(e) => setNewCenter({ ...newCenter, address: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Capacity (units)
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  value={newCenter.maxCapacity}
                  onChange={(e) => setNewCenter({ ...newCenter, maxCapacity: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Safety Stock Level (units)
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  value={newCenter.safetyStock}
                  onChange={(e) => setNewCenter({ ...newCenter, safetyStock: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddCenter(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Center
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;