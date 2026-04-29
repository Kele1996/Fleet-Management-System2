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

function CostAnalysis({ trips, vehicles }) {
  const calculateTotalFuelCostMTD = () => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    return trips.reduce((sum, trip) => {
      const tripDate = new Date(trip.startDateTime)
      if (tripDate.getMonth() === currentMonth && tripDate.getFullYear() === currentYear) {
        return sum + trip.fuelCost
      }
      return sum
    }, 0).toFixed(2)
  }

  const calculateAvgCostPerKm = () => {
    if (trips.length === 0) return 0
    const totalCost = trips.reduce((sum, trip) => sum + trip.fuelCost, 0)
    const totalDist = trips.reduce((sum, trip) => sum + trip.distance, 0)
    return (totalCost / totalDist).toFixed(2)
  }

  const getCostByVehicle = () => {
    const vehicleCosts = {}
    trips.forEach(trip => {
      if (!vehicleCosts[trip.vehicleId]) {
        vehicleCosts[trip.vehicleId] = { totalCost: 0, totalDist: 0 }
      }
      vehicleCosts[trip.vehicleId].totalCost += trip.fuelCost
      vehicleCosts[trip.vehicleId].totalDist += trip.distance
    })
    
    return Object.entries(vehicleCosts).map(([vehicleId, data]) => {
      const vehicle = vehicles.find(v => v.id === parseInt(vehicleId))
      return {
        name: vehicle ? vehicle.truckId : `Vehicle ${vehicleId}`,
        cost: parseFloat(data.totalCost.toFixed(2)),
        costPerKm: parseFloat((data.totalCost / data.totalDist).toFixed(2))
      }
    })
  }

  const getMonthlyCostTrend = () => {
    const last6Months = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      last6Months.push({
        month: date.toLocaleString('default', { month: 'short' }),
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
        yearNum: date.getFullYear()
      })
    }
    
    const monthlyData = {}
    trips.forEach(trip => {
      const tripDate = new Date(trip.startDateTime)
      const monthKey = `${tripDate.getMonth()}-${tripDate.getFullYear()}`
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0
      }
      monthlyData[monthKey] += trip.fuelCost
    })
    
    return last6Months.map(({ month, year, monthIndex, yearNum }) => ({
      month: `${month} ${year}`,
      cost: monthlyData[`${monthIndex}-${yearNum}`] || 0
    }))
  }

  const costByVehicle = getCostByVehicle()
  const monthlyTrend = getMonthlyCostTrend()

  return (
    <div>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>💰 Total Fuel Cost (MTD)</h3>
          <div className="metric-value">${calculateTotalFuelCostMTD()}</div>
        </div>
        <div className="metric-card">
          <h3>📊 Average Cost per Kilometer</h3>
          <div className="metric-value">${calculateAvgCostPerKm()}/km</div>
        </div>
      </div>

      <div className="card">
        <h2>💰 Cost Comparison by Vehicle</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={costByVehicle}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="cost" fill="#667eea" name="Total Fuel Cost ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2>📈 Monthly Fuel Cost Trend</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cost" stroke="#764ba2" name="Fuel Cost ($)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default CostAnalysis