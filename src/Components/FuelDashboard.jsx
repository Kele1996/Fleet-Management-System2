import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

function FuelDashboard({ vehicles, trips }) {
  const calculateAvgFuelConsumption = () => {
    if (trips.length === 0) return 0
    const totalEfficiency = trips.reduce((sum, trip) => {
      const efficiency = trip.distance / trip.fuelLiters
      return sum + (isNaN(efficiency) ? 0 : efficiency)
    }, 0)
    return (totalEfficiency / trips.length).toFixed(1)
  }

  const findMostEfficientVehicle = () => {
    const vehicleEfficiency = {}
    trips.forEach(trip => {
      if (!vehicleEfficiency[trip.vehicleId]) {
        vehicleEfficiency[trip.vehicleId] = { totalDist: 0, totalFuel: 0 }
      }
      vehicleEfficiency[trip.vehicleId].totalDist += trip.distance
      vehicleEfficiency[trip.vehicleId].totalFuel += trip.fuelLiters
    })
    
    let bestEfficiency = 0
    let bestVehicle = null
    for (const [vehicleId, data] of Object.entries(vehicleEfficiency)) {
      const efficiency = data.totalDist / data.totalFuel
      if (efficiency > bestEfficiency) {
        bestEfficiency = efficiency
        bestVehicle = vehicles.find(v => v.id === parseInt(vehicleId))
      }
    }
    return bestVehicle ? `${bestVehicle.truckId} (${bestEfficiency.toFixed(1)} km/L)` : 'N/A'
  }

  const calculateAvgCostPerKm = () => {
    if (trips.length === 0) return 0
    const totalCost = trips.reduce((sum, trip) => sum + trip.fuelCost, 0)
    const totalDist = trips.reduce((sum, trip) => sum + trip.distance, 0)
    return (totalCost / totalDist).toFixed(2)
  }

  const calculateMonthlyFuelCost = () => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    const monthlyCost = trips.reduce((sum, trip) => {
      const tripDate = new Date(trip.startDateTime)
      if (tripDate.getMonth() === currentMonth && tripDate.getFullYear() === currentYear) {
        return sum + trip.fuelCost
      }
      return sum
    }, 0)
    return monthlyCost.toFixed(2)
  }

  const getFuelEfficiencyByVehicle = () => {
    const vehicleData = {}
    trips.forEach(trip => {
      if (!vehicleData[trip.vehicleId]) {
        vehicleData[trip.vehicleId] = { totalDist: 0, totalFuel: 0 }
      }
      vehicleData[trip.vehicleId].totalDist += trip.distance
      vehicleData[trip.vehicleId].totalFuel += trip.fuelLiters
    })
    
    return Object.entries(vehicleData).map(([vehicleId, data]) => {
      const vehicle = vehicles.find(v => v.id === parseInt(vehicleId))
      const efficiency = data.totalDist / data.totalFuel
      return {
        name: vehicle ? vehicle.truckId : `Vehicle ${vehicleId}`,
        efficiency: isNaN(efficiency) ? 0 : parseFloat(efficiency.toFixed(1))
      }
    })
  }

  const getDailyFuelTrend = () => {
    const last14Days = []
    for (let i = 13; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      last14Days.push(date.toISOString().split('T')[0])
    }
    
    const dailyData = {}
    trips.forEach(trip => {
      const tripDate = new Date(trip.startDateTime).toISOString().split('T')[0]
      if (last14Days.includes(tripDate)) {
        if (!dailyData[tripDate]) {
          dailyData[tripDate] = 0
        }
        dailyData[tripDate] += trip.fuelLiters
      }
    })
    
    return last14Days.map(date => ({
      date: date.slice(5),
      fuel: dailyData[date] || 0
    }))
  }

  const efficiencyData = getFuelEfficiencyByVehicle()
  const trendData = getDailyFuelTrend()

  return (
    <div>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Average Fuel Consumption</h3>
          <div className="metric-value">{calculateAvgFuelConsumption()} km/L</div>
        </div>
        <div className="metric-card">
          <h3>Most Fuel-Efficient Vehicle</h3>
          <div className="metric-value">{findMostEfficientVehicle()}</div>
        </div>
        <div className="metric-card">
          <h3>Fuel Cost per Kilometer</h3>
          <div className="metric-value">${calculateAvgCostPerKm()}/km</div>
        </div>
        <div className="metric-card">
          <h3>Total Fuel Cost (This Month)</h3>
          <div className="metric-value">${calculateMonthlyFuelCost()}</div>
        </div>
      </div>

      <div className="card">
        <h2>📊 Fuel Efficiency by Vehicle</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={efficiencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'km/L', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="efficiency" fill="#667eea" name="Fuel Efficiency (km/L)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2>📈 Daily Fuel Usage Trend (Last 14 Days)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'Liters', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="fuel" stroke="#764ba2" name="Fuel Used (L)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default FuelDashboard