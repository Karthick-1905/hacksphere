import React, { useState } from 'react';
import { Truck, UserPlus, LogIn, Map } from 'lucide-react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import DemandForecast from './components/DemandForecast';
import OrderSimulation from './components/OrderSimulation';
import InventoryManagement from './components/InventoryManagement';
import OrderTracking from './components/OrderTracking';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Temporarily set to true for testing
  const [activeTab, setActiveTab] = useState('forecast');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Truck className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">SRK Supply Chain Management</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {isAuthenticated ? (
        <main className="container mx-auto">
          {/* Navigation Tabs */}
          <div className="flex space-x-4 p-6">
            <button
              onClick={() => setActiveTab('forecast')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'forecast'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              Demand Forecast
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'simulation'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              Order Simulation
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'inventory'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              Inventory Management
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'tracking'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Map className="h-5 w-5" />
                <span>Order Tracking</span>
              </div>
            </button>
          </div>
          
          {activeTab === 'forecast' ? (
            <DemandForecast />
          ) : activeTab === 'simulation' ? (
            <OrderSimulation />
          ) : activeTab === 'tracking' ? (
            <OrderTracking />
          ) : (
            <InventoryManagement />
          )}
        </main>
      ) : (
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-md mx-auto">
            {/* Toggle Buttons */}
            <div className="flex mb-8 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-6 rounded-md font-medium transition-all duration-200 ${
                  isLogin
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </div>
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-6 rounded-md font-medium transition-all duration-200 ${
                  !isLogin
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <UserPlus className="h-5 w-5" />
                  <span>Register</span>
                </div>
              </button>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              {isLogin ? <LoginForm /> : <RegisterForm />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;