import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Package, Truck, Cloud, CloudRain, CloudSnow, CloudSun, Wind } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Order {
  id: string;
  origin: [number, number];
  destination: [number, number];
  currentLocation: [number, number];
  status: 'Processing' | 'In Transit' | 'Delivered';
  description: string;
  estimatedDelivery: string;
}

type WeatherCondition = 'clear' | 'rain' | 'snow' | 'cloudy' | 'windy';

interface WeatherSimulation {
  position: [number, number];
  condition: WeatherCondition;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    origin: [40.7128, -74.006], // New York
    destination: [41.8781, -87.6298], // Chicago
    currentLocation: [41.2033, -79.3832], // Somewhere in between
    status: 'In Transit',
    description: 'Electronics Shipment',
    estimatedDelivery: '2024-03-25'
  },
  {
    id: 'ORD-002',
    origin: [34.0522, -118.2437], // Los Angeles
    destination: [37.7749, -122.4194], // San Francisco
    currentLocation: [35.9132, -120.3344], // Somewhere in between
    status: 'Processing',
    description: 'Medical Supplies',
    estimatedDelivery: '2024-03-24'
  }
];

const weatherColors: Record<WeatherCondition, string> = {
  clear: '#FFD700',
  rain: '#4169E1',
  snow: '#F0F8FF',
  cloudy: '#708090',
  windy: '#20B2AA'
};

// Component to handle map bounds
const MapBounds: React.FC<{ order: Order }> = ({ order }) => {
  const map = useMap();
  
  React.useEffect(() => {
    const bounds = L.latLngBounds([
      order.origin,
      order.destination,
      order.currentLocation
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, order]);

  return null;
};

// Component to handle map clicks for weather simulation
const MapClickHandler: React.FC<{
  onMapClick: (position: [number, number]) => void;
  isWeatherMode: boolean;
}> = ({ onMapClick, isWeatherMode }) => {
  const map = useMap();

  React.useEffect(() => {
    if (isWeatherMode) {
      map.getContainer().style.cursor = 'crosshair';
    } else {
      map.getContainer().style.cursor = '';
    }
  }, [isWeatherMode, map]);

  React.useEffect(() => {
    if (!isWeatherMode) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [isWeatherMode, onMapClick, map]);

  return null;
};

const OrderTracking: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [weatherMode, setWeatherMode] = useState(false);
  const [selectedWeather, setSelectedWeather] = useState<WeatherCondition>('clear');
  const [weatherSimulations, setWeatherSimulations] = useState<WeatherSimulation[]>([]);

  const handleMapClick = useCallback((position: [number, number]) => {
    if (weatherMode) {
      setWeatherSimulations(prev => [...prev, { position, condition: selectedWeather }]);
    }
  }, [weatherMode, selectedWeather]);

  const getWeatherIcon = (condition: WeatherCondition) => {
    switch (condition) {
      case 'clear':
        return <CloudSun className="h-5 w-5" />;
      case 'rain':
        return <CloudRain className="h-5 w-5" />;
      case 'snow':
        return <CloudSnow className="h-5 w-5" />;
      case 'cloudy':
        return <Cloud className="h-5 w-5" />;
      case 'windy':
        return <Wind className="h-5 w-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Order List and Weather Controls */}
      <div className="md:col-span-1 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Orders</h2>
        
        {/* Weather Simulation Controls */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Weather Simulation</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Enable Weather Mode</span>
              <button
                onClick={() => setWeatherMode(!weatherMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  weatherMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {weatherMode ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            
            {weatherMode && (
              <div className="grid grid-cols-2 gap-2">
                {(['clear', 'rain', 'snow', 'cloudy', 'windy'] as WeatherCondition[]).map((condition) => (
                  <button
                    key={condition}
                    onClick={() => setSelectedWeather(condition)}
                    className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg font-medium capitalize transition-all duration-200 ${
                      selectedWeather === condition
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {getWeatherIcon(condition)}
                    <span>{condition}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Orders List */}
        {mockOrders.map((order) => (
          <div
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedOrder?.id === order.id
                ? 'bg-blue-50 border-2 border-blue-500'
                : 'bg-white border-2 border-gray-100 hover:border-blue-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-800">{order.id}</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'Processing'
                    ? 'bg-yellow-100 text-yellow-800'
                    : order.status === 'In Transit'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {order.status}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 mb-2">
              <Package className="h-4 w-4" />
              <span>{order.description}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Truck className="h-4 w-4" />
              <span>ETA: {order.estimatedDelivery}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Map Container */}
      <div className="md:col-span-2">
        <MapContainer
          center={[39.8283, -98.5795]}
          zoom={4}
          className="w-full h-[600px] rounded-lg shadow-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickHandler onMapClick={handleMapClick} isWeatherMode={weatherMode} />
          
          {selectedOrder && (
            <>
              <MapBounds order={selectedOrder} />
              
              {/* Route Polyline */}
              <Polyline
                positions={[
                  selectedOrder.origin,
                  selectedOrder.currentLocation,
                  selectedOrder.destination
                ]}
                color="#3B82F6"
                weight={3}
                dashArray="5, 10"
              />

              {/* Origin Marker */}
              <Marker position={selectedOrder.origin}>
                <Popup>
                  <div className="font-semibold">Origin</div>
                  <div className="text-sm text-gray-600">Departure Point</div>
                </Popup>
              </Marker>

              {/* Destination Marker */}
              <Marker position={selectedOrder.destination}>
                <Popup>
                  <div className="font-semibold">Destination</div>
                  <div className="text-sm text-gray-600">Arrival Point</div>
                </Popup>
              </Marker>

              {/* Current Location Marker */}
              <Marker position={selectedOrder.currentLocation}>
                <Popup>
                  <div className="font-semibold">Current Location</div>
                  <div className="text-sm text-gray-600">
                    Status: {selectedOrder.status}
                  </div>
                </Popup>
              </Marker>
            </>
          )}

          {/* Weather Simulation Circles */}
          {weatherSimulations.map((simulation, index) => (
            <Circle
              key={index}
              center={simulation.position}
              radius={50000}
              pathOptions={{
                color: weatherColors[simulation.condition],
                fillColor: weatherColors[simulation.condition],
                fillOpacity: 0.3
              }}
            >
              <Popup>
                <div className="font-semibold capitalize">{simulation.condition} Weather Zone</div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default OrderTracking;