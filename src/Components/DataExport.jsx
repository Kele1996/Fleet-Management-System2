function DataExport({ trips, vehicles }) {
  const exportToCSV = (data, filename) => {
    if (data.length === 0) {
      alert('No data to export')
      return
    }
    
    const headers = Object.keys(data[0])
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header]
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(','))
    ]
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportTrips = () => {
    const exportData = trips.map(trip => ({
      'Date': new Date(trip.startDateTime).toLocaleDateString(),
      'Driver': trip.driverName,
      'Vehicle ID': trip.vehicleId,
      'Distance (km)': trip.distance,
      'Fuel (L)': trip.fuelLiters,
      'Efficiency (km/L)': (trip.distance / trip.fuelLiters).toFixed(2),
      'Cost ($)': trip.fuelCost,
      'Cargo Type': trip.cargoType,
      'Cargo Weight (tons)': trip.cargoWeight,
      'Purpose': trip.tripPurpose
    }))
    exportToCSV(exportData, 'fleet_trips_export')
  }

  const exportVehicles = () => {
    const exportData = vehicles.map(vehicle => ({
      'Truck ID': vehicle.truckId,
      'License Plate': vehicle.licensePlate,
      'Model': vehicle.model,
      'Year': vehicle.year,
      'Type': vehicle.type,
      'Status': vehicle.status,
      'Current Odometer (km)': vehicle.currentOdometer
    }))
    exportToCSV(exportData, 'fleet_vehicles_export')
  }

  const printDashboard = () => {
    window.print()
  }

  return (
    <div>
      <div className="metrics-grid">
        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={exportTrips}>
          <h3>📄 Export Trips</h3>
          <div className="metric-value">CSV File</div>
          <div>Download all trip data</div>
        </div>
        
        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={exportVehicles}>
          <h3>🚛 Export Vehicles</h3>
          <div className="metric-value">CSV File</div>
          <div>Download vehicle registry</div>
        </div>
        
        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={printDashboard}>
          <h3>🖨️ Print Report</h3>
          <div className="metric-value">Print</div>
          <div>Print current dashboard</div>
        </div>
      </div>

      <div className="card">
        <h2>📊 Data Summary</h2>
        <div className="metrics-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 0 }}>
          <div className="metric-card" style={{ background: '#28a745' }}>
            <h3>Total Trips</h3>
            <div className="metric-value">{trips.length}</div>
          </div>
          <div className="metric-card" style={{ background: '#17a2b8' }}>
            <h3>Active Vehicles</h3>
            <div className="metric-value">{vehicles.filter(v => v.status === 'Active').length}</div>
          </div>
          <div className="metric-card" style={{ background: '#ffc107', color: '#333' }}>
            <h3>Total Distance</h3>
            <div className="metric-value">{trips.reduce((sum, t) => sum + t.distance, 0).toLocaleString()} km</div>
          </div>
          <div className="metric-card" style={{ background: '#dc3545' }}>
            <h3>Total Fuel Cost</h3>
            <div className="metric-value">${trips.reduce((sum, t) => sum + t.fuelCost, 0).toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataExport
        