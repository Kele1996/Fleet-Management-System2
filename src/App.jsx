import { useState, useEffect } from 'react'
import './App.css'
import VehicleManagement from './components/VehicleManagement'
import TripForm from './components/TripForm'
import TripHistory from './components/TripHistory'
import FuelDashboard from './components/FuelDashboard'
import DriverLeaderboard from './components/DriverLeaderboard'
import MaintenanceAlerts from './components/MaintenanceAlerts'
import CostAnalysis from './components/CostAnalysis'
import DataExport from './components/DataExport'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [vehicles, setVehicles] = useState([])
  const [trips, setTrips] = useState([])

  useEffect(() => {
    const savedVehicles = localStorage.getItem('fleet_vehicles')
    const savedTrips = localStorage.getItem('fleet_trips')

    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles))
    } else {
      const mockVehicles = [
        { id: 1, truckId: 'TRK001', licensePlate: 'ABC123', model: 'Volvo FH16', year: 2022, type: 'Box Truck', status: 'Active', currentOdometer: 45230 },
        { id: 2, truckId: 'TRK002', licensePlate: 'XYZ789', model: 'Scania R500', year: 2021, type: 'Tanker', status: 'Active', currentOdometer: 78450 },
        { id: 3, truckId: 'TRK003', licensePlate: 'DEF456', model: 'Mercedes Actros', year: 2023, type: 'Refrigerated', status: 'Maintenance', currentOdometer: 12340 },
        { id: 4, truckId: 'TRK004', licensePlate: 'GHI789', model: 'Volvo FM', year: 2020, type: 'Flatbed', status: 'Active', currentOdometer: 124500 },
        { id: 5, truckId: 'TRK005', licensePlate: 'JKL012', model: 'MAN TGX', year: 2019, type: 'Box Truck', status: 'Retired', currentOdometer: 245000 },
      ]
      setVehicles(mockVehicles)
      localStorage.setItem('fleet_vehicles', JSON.stringify(mockVehicles))
    }

    if (savedTrips) {
      setTrips(JSON.parse(savedTrips))
    } else {
      const mockTrips = generateMockTrips()
      setTrips(mockTrips)
      localStorage.setItem('fleet_trips', JSON.stringify(mockTrips))
    }
  }, [])

  const generateMockTrips = () => {
    const drivers = ['John Doe', 'Sarah Chen', 'Mike Ross', 'Jane Smith', 'David Wilson']
    const vehicleIds = [1, 2, 3, 4]
    const cargoTypes = ['Box Truck', 'Refrigerated', 'Flatbed', 'Tanker']
    const purposes = ['Delivery', 'Pickup', 'Return to depot']
    const trips = []

    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 30))
      const distance = Math.floor(Math.random() * 400) + 50
      const fuelLiters = Math.floor(distance / 5) + Math.floor(Math.random() * 20)
      
      trips.push({
        id: i + 1,
        vehicleId: vehicleIds[Math.floor(Math.random() * vehicleIds.length)],
        driverName: drivers[Math.floor(Math.random() * drivers.length)],
        startDateTime: date.toISOString(),
        endDateTime: new Date(date.getTime() + distance * 60000).toISOString(),
        startOdometer: Math.floor(Math.random() * 100000),
        endOdometer: Math.floor(Math.random() * 100000) + distance,
        distance: distance,
        cargoType: cargoTypes[Math.floor(Math.random() * cargoTypes.length)],
        cargoWeight: Math.floor(Math.random() * 20) + 1,
        fuelLiters: fuelLiters,
        fuelCost: fuelLiters * 1.6,
        tripPurpose: purposes[Math.floor(Math.random() * purposes.length)],
        notes: '',
        createdAt: date.toISOString()
      })
    }
    return trips
  }

  const addVehicle = (vehicle) => {
    const newVehicle = { ...vehicle, id: Date.now() }
    const updatedVehicles = [...vehicles, newVehicle]
    setVehicles(updatedVehicles)
    localStorage.setItem('fleet_vehicles', JSON.stringify(updatedVehicles))
  }

  const updateVehicle = (updatedVehicle) => {
    const updatedVehicles = vehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v)
    setVehicles(updatedVehicles)
    localStorage.setItem('fleet_vehicles', JSON.stringify(updatedVehicles))
  }

  const deleteVehicle = (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      const updatedVehicles = vehicles.filter(v => v.id !== id)
      setVehicles(updatedVehicles)
      localStorage.setItem('fleet_vehicles', JSON.stringify(updatedVehicles))
    }
  }

  const addTrip = (trip) => {
    const newTrip = { ...trip, id: Date.now(), createdAt: new Date().toISOString() }
    const updatedTrips = [...trips, newTrip]
    setTrips(updatedTrips)
    localStorage.setItem('fleet_trips', JSON.stringify(updatedTrips))
    
    const vehicle = vehicles.find(v => v.id === trip.vehicleId)
    if (vehicle && trip.endOdometer > vehicle.currentOdometer) {
      const updatedVehicle = { ...vehicle, currentOdometer: trip.endOdometer }
      updateVehicle(updatedVehicle)
    }
  }

  const updateTrip = (updatedTrip) => {
    const updatedTrips = trips.map(t => t.id === updatedTrip.id ? updatedTrip : t)
    setTrips(updatedTrips)
    localStorage.setItem('fleet_trips', JSON.stringify(updatedTrips))
  }

  const deleteTrip = (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      const updatedTrips = trips.filter(t => t.id !== id)
      setTrips(updatedTrips)
      localStorage.setItem('fleet_trips', JSON.stringify(updatedTrips))
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🚛 Fleet Management System</h1>
        <div className="header-info">
          <span>📊 Fleet Manager Dashboard</span>
        </div>
      </header>

      <nav className="nav-tabs">
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
          📊 Fuel Dashboard
        </button>
        <button className={activeTab === 'vehicles' ? 'active' : ''} onClick={() => setActiveTab('vehicles')}>
          🚛 Vehicles
        </button>
        <button className={activeTab === 'tripform' ? 'active' : ''} onClick={() => setActiveTab('tripform')}>
          📝 Log Trip
        </button>
        <button className={activeTab === 'trips' ? 'active' : ''} onClick={() => setActiveTab('trips')}>
          📋 Trip History
        </button>
        <button className={activeTab === 'leaderboard' ? 'active' : ''} onClick={() => setActiveTab('leaderboard')}>
          🏆 Leaderboard
        </button>
        <button className={activeTab === 'maintenance' ? 'active' : ''} onClick={() => setActiveTab('maintenance')}>
          🔧 Maintenance
        </button>
        <button className={activeTab === 'cost' ? 'active' : ''} onClick={() => setActiveTab('cost')}>
          💰 Cost Analysis
        </button>
        <button className={activeTab === 'export' ? 'active' : ''} onClick={() => setActiveTab('export')}>
          📎 Export
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && <FuelDashboard vehicles={vehicles} trips={trips} />}
        {activeTab === 'vehicles' && (
          <VehicleManagement 
            vehicles={vehicles} 
            addVehicle={addVehicle}
            updateVehicle={updateVehicle}
            deleteVehicle={deleteVehicle}
          />
        )}
        {activeTab === 'tripform' && <TripForm vehicles={vehicles} addTrip={addTrip} />}
        {activeTab === 'trips' && (
          <TripHistory 
            trips={trips} 
            vehicles={vehicles}
            updateTrip={updateTrip}
            deleteTrip={deleteTrip}
          />
        )}
        {activeTab === 'leaderboard' && <DriverLeaderboard trips={trips} />}
        {activeTab === 'maintenance' && <MaintenanceAlerts vehicles={vehicles} trips={trips} />}
        {activeTab === 'cost' && <CostAnalysis trips={trips} vehicles={vehicles} />}
        {activeTab === 'export' && <DataExport trips={trips} vehicles={vehicles} />}
      </main>
    </div>
  )
}

export default App