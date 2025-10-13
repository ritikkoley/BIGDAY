import React, { useState } from 'react';
import {
  Bus,
  MapPin,
  Users,
  Clock,
  TrendingDown,
  AlertCircle,
  Plus,
  Search,
  Download,
  Save,
  Play,
  Edit2,
  Trash2,
  Navigation,
  RouteIcon
} from 'lucide-react';

interface Rider {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  assignedStop?: string;
  assignedRoute?: string;
}

interface BusVehicle {
  id: string;
  name: string;
  capacity: number;
  driver: string;
  status: 'In Service' | 'Maintenance' | 'Available';
}

interface Route {
  id: string;
  name: string;
  bus: string;
  stops: { lat: number; lng: number; name: string; riders: string[] }[];
  riders: string[];
  color: string;
}

const MOCK_RIDERS: Rider[] = [
  { id: 'R001', name: 'Aarav Kumar', address: '123 MG Road, Jaipur', lat: 26.9124, lng: 75.7873 },
  { id: 'R002', name: 'Vivaan Singh', address: '456 Station Road, Jaipur', lat: 26.9200, lng: 75.7800 },
  { id: 'R003', name: 'Aditya Sharma', address: '789 Civil Lines, Jaipur', lat: 26.9050, lng: 75.8000 },
  { id: 'R004', name: 'Vihaan Patel', address: '321 MI Road, Jaipur', lat: 26.9180, lng: 75.7950 },
  { id: 'R005', name: 'Arjun Reddy', address: '654 Tonk Road, Jaipur', lat: 26.8800, lng: 75.8100 },
  { id: 'R006', name: 'Sai Mehta', address: '987 Malviya Nagar, Jaipur', lat: 26.8500, lng: 75.8200 },
  { id: 'R007', name: 'Dhruv Gupta', address: '159 Vaishali Nagar, Jaipur', lat: 26.9250, lng: 75.7600 },
  { id: 'R008', name: 'Krishna Joshi', address: '753 C-Scheme, Jaipur', lat: 26.9100, lng: 75.8050 },
  { id: 'R009', name: 'Atharv Verma', address: '852 Mansarovar, Jaipur', lat: 26.8700, lng: 75.7700 },
  { id: 'R010', name: 'Reyansh Nair', address: '951 Raja Park, Jaipur', lat: 26.9000, lng: 75.7850 },
  { id: 'R011', name: 'Aadhya Desai', address: '147 Bani Park, Jaipur', lat: 26.9300, lng: 75.7900 },
  { id: 'R012', name: 'Ananya Iyer', address: '258 Shastri Nagar, Jaipur', lat: 26.9400, lng: 75.7750 },
  { id: 'R013', name: 'Diya Kapoor', address: '369 Bapu Nagar, Jaipur', lat: 26.8900, lng: 75.7650 },
  { id: 'R014', name: 'Isha Malhotra', address: '471 Sodala, Jaipur', lat: 26.9350, lng: 75.8150 },
  { id: 'R015', name: 'Pari Chatterjee', address: '582 Gopalpura, Jaipur', lat: 26.8400, lng: 75.7900 },
  { id: 'R016', name: 'Saanvi Das', address: '693 Jagatpura, Jaipur', lat: 26.8300, lng: 75.8500 },
  { id: 'R017', name: 'Navya Bose', address: '704 Sanganer, Jaipur', lat: 26.8250, lng: 75.8000 },
  { id: 'R018', name: 'Kiara Sen', address: '815 Ajmer Road, Jaipur', lat: 26.9450, lng: 75.7500 },
  { id: 'R019', name: 'Myra Rao', address: '926 Sikar Road, Jaipur', lat: 26.9550, lng: 75.7850 },
  { id: 'R020', name: 'Sara Pillai', address: '037 Harmara, Jaipur', lat: 26.9150, lng: 75.7400 },
  { id: 'R021', name: 'Advait Khanna', address: '148 Nirman Nagar, Jaipur', lat: 26.9300, lng: 75.8300 },
  { id: 'R022', name: 'Kabir Bhatt', address: '259 Kardhani, Jaipur', lat: 26.8650, lng: 75.7800 },
  { id: 'R023', name: 'Shivansh Jain', address: '360 Murlipura, Jaipur', lat: 26.8850, lng: 75.8400 },
  { id: 'R024', name: 'Ayaan Trivedi', address: '461 Chitrakoot', lat: 26.8550, lng: 75.7500 },
  { id: 'R025', name: 'Ishaan Saxena', address: '562 Pratap Nagar', lat: 26.8750, lng: 75.7950 },
  { id: 'R026', name: 'Riya Agarwal', address: '663 Jawahar Nagar', lat: 26.9500, lng: 75.8000 },
  { id: 'R027', name: 'Prisha Bansal', address: '764 Model Town', lat: 26.9350, lng: 75.7700 },
  { id: 'R028', name: 'Aanya Sinha', address: '865 Paldi Extension', lat: 26.8600, lng: 75.8350 },
  { id: 'R029', name: 'Avni Pandey', address: '966 Tilak Nagar', lat: 26.9100, lng: 75.7600 },
  { id: 'R030', name: 'Zara Mishra', address: '067 Khatipura', lat: 26.8950, lng: 75.8250 },
  { id: 'R031', name: 'Aryan Chopra', address: '168 Vidhyadhar Nagar', lat: 26.9600, lng: 75.8100 },
  { id: 'R032', name: 'Rohan Tiwari', address: '269 Transport Nagar', lat: 26.8450, lng: 75.7650 },
  { id: 'R033', name: 'Karan Dubey', address: '370 Durgapura', lat: 26.8700, lng: 75.8150 },
  { id: 'R034', name: 'Arnav Kulkarni', address: '471 Lal Kothi', lat: 26.9050, lng: 75.7900 },
  { id: 'R035', name: 'Dev Bhargava', address: '572 Gandhi Path', lat: 26.8800, lng: 75.7750 },
  { id: 'R036', name: 'Samaira Shah', address: '673 Mahesh Nagar', lat: 26.9200, lng: 75.8200 },
  { id: 'R037', name: 'Myra Gupta', address: '774 Girdhar Marg', lat: 26.9400, lng: 75.7950 },
  { id: 'R038', name: 'Aarna Saxena', address: '875 Jhotwara', lat: 26.9350, lng: 75.7550 },
  { id: 'R039', name: 'Mira Verma', address: '976 Patrakar Colony', lat: 26.8650, lng: 75.8050 },
  { id: 'R040', name: 'Aarohi Sharma', address: '077 Hasanpura', lat: 26.9250, lng: 75.8350 }
];

const MOCK_BUSES: BusVehicle[] = [
  { id: 'B001', name: 'North Express', capacity: 45, driver: 'Rajesh Kumar', status: 'In Service' },
  { id: 'B002', name: 'South Liner', capacity: 40, driver: 'Amit Patel', status: 'In Service' },
  { id: 'B003', name: 'East Shuttle', capacity: 35, driver: 'Vijay Singh', status: 'Available' },
  { id: 'B004', name: 'West Cruiser', capacity: 42, driver: 'Suresh Yadav', status: 'In Service' },
  { id: 'B005', name: 'Central Route', capacity: 38, driver: 'Manoj Sharma', status: 'Maintenance' }
];

export const RouteWise: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'management' | 'planner'>('dashboard');
  const [managementTab, setManagementTab] = useState<'riders' | 'fleet'>('riders');
  const [riders] = useState<Rider[]>(MOCK_RIDERS);
  const [buses] = useState<BusVehicle[]>(MOCK_BUSES);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [plannerStep, setPlannerStep] = useState<number>(1);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const generateRoutes = () => {
    const newRoutes: Route[] = [
      {
        id: 'RW-01',
        name: 'North Route',
        bus: 'North Express',
        color: '#3B82F6',
        stops: [
          { lat: 26.9400, lng: 75.7750, name: 'Stop A - Shastri Nagar', riders: ['R012', 'R026', 'R027'] },
          { lat: 26.9300, lng: 75.7900, name: 'Stop B - Bani Park', riders: ['R011', 'R021'] },
          { lat: 26.9200, lng: 75.7800, name: 'Stop C - Station Road', riders: ['R002', 'R036'] }
        ],
        riders: ['R002', 'R011', 'R012', 'R021', 'R026', 'R027', 'R036']
      },
      {
        id: 'RW-02',
        name: 'South Route',
        bus: 'South Liner',
        color: '#10B981',
        stops: [
          { lat: 26.8500, lng: 75.8200, name: 'Stop D - Malviya Nagar', riders: ['R006', 'R032'] },
          { lat: 26.8400, lng: 75.7900, name: 'Stop E - Gopalpura', riders: ['R015', 'R024'] },
          { lat: 26.8300, lng: 75.8500, name: 'Stop F - Jagatpura', riders: ['R016', 'R023'] }
        ],
        riders: ['R006', 'R015', 'R016', 'R023', 'R024', 'R032']
      },
      {
        id: 'RW-03',
        name: 'West Route',
        bus: 'West Cruiser',
        color: '#F59E0B',
        stops: [
          { lat: 26.9250, lng: 75.7600, name: 'Stop G - Vaishali Nagar', riders: ['R007', 'R029'] },
          { lat: 26.9150, lng: 75.7400, name: 'Stop H - Harmara', riders: ['R020', 'R038'] },
          { lat: 26.8700, lng: 75.7700, name: 'Stop I - Mansarovar', riders: ['R009', 'R025'] }
        ],
        riders: ['R007', 'R009', 'R020', 'R025', 'R029', 'R038']
      },
      {
        id: 'RW-04',
        name: 'East Route',
        bus: 'East Shuttle',
        color: '#8B5CF6',
        stops: [
          { lat: 26.9350, lng: 75.8150, name: 'Stop J - Sodala', riders: ['R014', 'R031'] },
          { lat: 26.8850, lng: 75.8400, name: 'Stop K - Murlipura', riders: ['R023', 'R028'] },
          { lat: 26.8700, lng: 75.8150, name: 'Stop L - Durgapura', riders: ['R033', 'R039'] }
        ],
        riders: ['R014', 'R023', 'R028', 'R031', 'R033', 'R039']
      }
    ];

    setRoutes(newRoutes);
    setPlannerStep(3);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="apple-card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Riders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{riders.length}</p>
            </div>
          </div>
        </div>

        <div className="apple-card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <Bus className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Buses on Route</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{routes.length}</p>
            </div>
          </div>
        </div>

        <div className="apple-card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Travel Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">32m</p>
            </div>
          </div>
        </div>

        <div className="apple-card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <TrendingDown className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fleet Utilized</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">78%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 apple-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Routes Map</h3>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg h-96 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {routes.length > 0 ? (
                <div className="relative w-full h-full p-6">
                  {routes.map((route, idx) => (
                    <div
                      key={route.id}
                      className="absolute"
                      style={{
                        left: `${15 + idx * 20}%`,
                        top: `${20 + idx * 15}%`,
                        width: '200px'
                      }}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: route.color }}
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {route.name}
                        </span>
                      </div>
                      <div
                        className="h-1 rounded-full"
                        style={{ backgroundColor: route.color, width: '150px' }}
                      />
                      {route.stops.map((stop, stopIdx) => (
                        <div
                          key={stopIdx}
                          className="flex items-center space-x-1 mt-2 ml-4"
                        >
                          <MapPin className="w-3 h-3" style={{ color: route.color }} />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {stop.name.split(' - ')[1]}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <Navigation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No active routes</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="apple-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Alerts</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Route RW-02</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Operating at 95% capacity</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Bus B005</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Scheduled maintenance due</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('planner')}
            className="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Plan New Routes</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setManagementTab('riders')}
          className={`px-4 py-3 font-medium transition-colors ${
            managementTab === 'riders'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Riders
        </button>
        <button
          onClick={() => setManagementTab('fleet')}
          className={`px-4 py-3 font-medium transition-colors ${
            managementTab === 'fleet'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Fleet
        </button>
      </div>

      {managementTab === 'riders' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search riders..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Rider</span>
            </button>
          </div>

          <div className="apple-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Assigned Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {riders.slice(0, 15).map((rider) => (
                    <tr key={rider.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{rider.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{rider.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{rider.address}</td>
                      <td className="px-6 py-4 text-sm">
                        {rider.assignedRoute ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs">
                            {rider.assignedRoute}
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-full text-xs">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Bus</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buses.map((bus) => (
              <div key={bus.id} className="apple-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <Bus className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{bus.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{bus.id}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      bus.status === 'In Service'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : bus.status === 'Available'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}
                  >
                    {bus.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Capacity:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{bus.capacity} seats</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Driver:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{bus.driver}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex space-x-2">
                  <button className="flex-1 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPlanner = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <div className="apple-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Route Planning</h3>

          {plannerStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Route Duration
                </label>
                <input
                  type="number"
                  defaultValue={60}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                />
                <p className="text-xs text-gray-500 mt-1">Minutes</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Walking Distance
                </label>
                <input
                  type="number"
                  defaultValue={500}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                />
                <p className="text-xs text-gray-500 mt-1">Meters</p>
              </div>

              <button
                onClick={() => setPlannerStep(2)}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Load Unassigned Riders</span>
              </button>
            </div>
          )}

          {plannerStep === 2 && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>{riders.length} riders</strong> loaded on map
                </p>
              </div>

              <button
                onClick={generateRoutes}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <RouteIcon className="w-4 h-4" />
                <span>Generate Optimal Routes</span>
              </button>
            </div>
          )}

          {plannerStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                {routes.map((route) => (
                  <div
                    key={route.id}
                    onClick={() => setSelectedRoute(route.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedRoute === route.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500'
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: route.color }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">{route.name}</span>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{route.id}</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="text-gray-600 dark:text-gray-400">
                        <Bus className="w-3 h-3 inline mr-1" />
                        {route.bus}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <Users className="w-3 h-3 inline mr-1" />
                        {route.riders.length} riders, {route.stops.length} stops
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Plan</span>
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export Manifests</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="apple-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interactive Map</h3>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg h-[600px] relative overflow-hidden">
            {plannerStep === 1 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Configure constraints and load riders</p>
                </div>
              </div>
            )}

            {plannerStep === 2 && (
              <div className="absolute inset-0 p-6">
                <div className="relative w-full h-full">
                  {riders.slice(0, 25).map((rider, idx) => (
                    <div
                      key={rider.id}
                      className="absolute"
                      style={{
                        left: `${(rider.lng - 75.74) * 1000}%`,
                        top: `${(26.96 - rider.lat) * 1000}%`
                      }}
                    >
                      <div className="relative group">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-10">
                          {rider.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {plannerStep === 3 && (
              <div className="absolute inset-0 p-6">
                <div className="relative w-full h-full">
                  {routes.map((route) => (
                    <div key={route.id} className={selectedRoute === route.id || !selectedRoute ? 'opacity-100' : 'opacity-30'}>
                      {route.stops.map((stop, stopIdx) => (
                        <div
                          key={stopIdx}
                          className="absolute"
                          style={{
                            left: `${(stop.lng - 75.74) * 1000}%`,
                            top: `${(26.96 - stop.lat) * 1000}%`
                          }}
                        >
                          <div className="relative group">
                            <div
                              className="w-6 h-6 rounded-full border-4 flex items-center justify-center text-white text-xs font-bold"
                              style={{
                                backgroundColor: route.color,
                                borderColor: route.color
                              }}
                            >
                              {stopIdx + 1}
                            </div>
                            <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded whitespace-nowrap z-10">
                              <div className="font-medium">{stop.name}</div>
                              <div className="text-gray-300 mt-1">{stop.riders.length} riders</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Bus className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
                RouteWise
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Intelligent route planning and bus assignment system
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="apple-card">
        <div className="flex items-center space-x-1 border-b border-gray-200 dark:border-gray-700 px-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('management')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'management'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Management
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'planner'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Route Planner
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'management' && renderManagement()}
          {activeTab === 'planner' && renderPlanner()}
        </div>
      </div>
    </div>
  );
};
