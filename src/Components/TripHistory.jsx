import { useState } from 'react'

function TripHistory({ trips, vehicles, updateTrip, deleteTrip }) {
  const [sortField, setSortField] = useState('startDateTime')
  const [sortDirection, setSortDirection] = useState('desc')
  const [filterVehicle, setFilterVehicle] = useState('')
  const [filterDriver, setFilterDriver] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [editingTrip, setEditingTrip] = useState(null)

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getVehicleName = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId)
    return vehicle ? `${vehicle.truckId} - ${vehicle.model}` : 'Unknown'
  }

  const calculateEfficiency = (distance, fuelLiters) => {
    if (fuelLiters === 0) return 0
    return (distance / fuelLiters).toFixed(1)
  }

  // Filter trips
  let filteredTrips = trips.filter(trip => {
    if (filterVehicle && trip.vehicleId !== parseInt(filterVehicle)) return false
    if (filterDriver && !trip.driverName.toLowerCase().includes(filterDriver.toLowerCase())) return false
    
    if (startDate) {
      const tripDate = new Date(trip.startDateTime)
      const filterStartDate = new Date(startDate)
      if (tripDate < filterStartDate) return false
    }
    
    if (endDate) {
      const tripDate = new Date(trip.startDateTime)
      const filterEndDate = new Date(endDate)
      filterEndDate.setHours(23, 59, 59)
      if (tripDate > filterEndDate) return false
    }
    
    return true
  })

  // Sort trips
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    let aVal = a[sortField]
    let bVal = b[sortField]
    
    if (sortField === 'startDateTime') {
      aVal = new Date(aVal)
      bVal = new Date(bVal)
    }
    
    if (sortField === 'efficiency') {
      aVal = calculateEfficiency(a.distance, a.fuelLiters)
      bVal = calculateEfficiency(b.distance, b.fuelLiters)
    }
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedTrips.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedTrips = sortedTrips.slice(startIndex, startIndex + rowsPerPage)

  const handleEdit = (trip) => {
    setEditingTrip({ ...trip })
  }

  const handleUpdate = () => {
    updateTrip(editingTrip)
    setEditingTrip(null)
    alert('Trip updated successfully!')
  }

  return (
    <div className="card">
      <h2>📋 Trip History</h2>
      
      <div className="filter-bar">
        <select value={filterVehicle} onChange={(e) => setFilterVehicle(e.target.value)}>
          <option value="">All Vehicles</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>{v.truckId}</option>
          ))}
        </select>
        
        <input 
          type="text" 
          placeholder="Filter by driver..." 
          value={filterDriver}
          onChange={(e) => setFilterDriver(e.target.value)}
        />
        
        <input 
          type="date" 
          placeholder="Start date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        
        <input 
          type="date" 
          placeholder="End date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        
        <select value={rowsPerPage} onChange={(e) => setRowsPerPage(parseInt(e.target.value))}>
          <option value={10}>10 rows</option>
          <option value={25}>25 rows</option>
          <option value={50}>50 rows</option>
        </select>
        
        <button className="secondary" onClick={() => {
          setFilterVehicle('')
          setFilterDriver('')
          setStartDate('')
          setEndDate('')
        }}>Clear Filters</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('startDateTime')}>Date {sortField === 'startDateTime' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('vehicleId')}>Vehicle {sortField === 'vehicleId' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('driverName')}>Driver {sortField === 'driverName' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('distance')}>Distance (km) {sortField === 'distance' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('fuelLiters')}>Fuel (L) {sortField === 'fuelLiters' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('efficiency')}>Efficiency (km/L) {sortField === 'efficiency' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
              <th>Cargo</th>
              <th>Cost ($)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTrips.map(trip => (
              <tr key={trip.id}>
                <td>{new Date(trip.startDateTime).toLocaleDateString()}</td>
                <td>{getVehicleName(trip.vehicleId)}</td>
                <td>{trip.driverName}</td>
                <td>{trip.distance}</td>
                <td>{trip.fuelLiters}</td>
                <td>{calculateEfficiency(trip.distance, trip.fuelLiters)}</td>
                <td>{trip.cargoType} ({trip.cargoWeight}t)</td>
                <td>${trip.fuelCost?.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleEdit(trip)} style={{ marginRight: '0.5rem', padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}>Edit</button>
                  <button className="danger" onClick={() => deleteTrip(trip.id)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>‹</button>
        <span style={{ padding: '0.5rem 1rem' }}>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>›</button>
        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</button>
      </div>

      {/* Edit Modal */}
      {editingTrip && (
        <div className="modal-overlay" onClick={() => setEditingTrip(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Trip</h3>
              <button className="close-btn" onClick={() => setEditingTrip(null)}>×</button>
            </div>
            <div className="form-group">
              <label>Driver Name</label>
              <input type="text" value={editingTrip.driverName} onChange={(e) => setEditingTrip({...editingTrip, driverName: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Distance (km)</label>
              <input type="number" value={editingTrip.distance} onChange={(e) => setEditingTrip({...editingTrip, distance: parseFloat(e.target.value)})} />
            </div>
            <div className="form-group">
              <label>Fuel Liters</label>
              <input type="number" value={editingTrip.fuelLiters} onChange={(e) => setEditingTrip({...editingTrip, fuelLiters: parseFloat(e.target.value)})} />
            </div>
            <div className="form-group">
              <label>Fuel Cost ($)</label>
              <input type="number" value={editingTrip.fuelCost} onChange={(e) => setEditingTrip({...editingTrip, fuelCost: parseFloat(e.target.value)})} />
            </div>
            <button onClick={handleUpdate}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TripHistory