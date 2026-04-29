import { useState } from 'react'

function TripForm({ vehicles, addTrip }) {
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverName: '',
    startDateTime: '',
    endDateTime: '',
    startOdometer: '',
    endOdometer: '',
    cargoType: 'Box Truck',
    cargoWeight: '',
    fuelLiters: '',
    fuelCost: '',
    tripPurpose: 'Delivery',
    notes: ''
  })

  const [distance, setDistance] = useState(null)
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    if (name === 'startOdometer' || name === 'endOdometer') {
      const start = name === 'startOdometer' ? parseFloat(value) : parseFloat(formData.startOdometer)
      const end = name === 'endOdometer' ? parseFloat(value) : parseFloat(formData.endOdometer)
      if (start && end && end > start) {
        setDistance(end - start)
      } else {
        setDistance(null)
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.vehicleId) newErrors.vehicleId = 'Vehicle is required'
    if (!formData.driverName) newErrors.driverName = 'Driver name is required'
    if (!formData.startDateTime) newErrors.startDateTime = 'Start date/time is required'
    if (!formData.endDateTime) newErrors.endDateTime = 'End date/time is required'
    if (!formData.startOdometer) newErrors.startOdometer = 'Start odometer is required'
    if (!formData.endOdometer) newErrors.endOdometer = 'End odometer is required'
    if (formData.endOdometer <= formData.startOdometer) {
      newErrors.endOdometer = 'End odometer must be greater than start odometer'
    }
    if (!formData.fuelLiters) newErrors.fuelLiters = 'Fuel liters is required'
    if (!formData.fuelCost) newErrors.fuelCost = 'Fuel cost is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const tripData = {
      ...formData,
      vehicleId: parseInt(formData.vehicleId),
      startOdometer: parseFloat(formData.startOdometer),
      endOdometer: parseFloat(formData.endOdometer),
      distance: distance,
      cargoWeight: parseFloat(formData.cargoWeight) || 0,
      fuelLiters: parseFloat(formData.fuelLiters),
      fuelCost: parseFloat(formData.fuelCost)
    }

    addTrip(tripData)
    
    setFormData({
      vehicleId: '',
      driverName: '',
      startDateTime: '',
      endDateTime: '',
      startOdometer: '',
      endOdometer: '',
      cargoType: 'Box Truck',
      cargoWeight: '',
      fuelLiters: '',
      fuelCost: '',
      tripPurpose: 'Delivery',
      notes: ''
    })
    setDistance(null)
    alert('Trip logged successfully!')
  }

  return (
    <div className="card">
      <h2>📝 Log New Trip</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Vehicle *</label>
            <select name="vehicleId" value={formData.vehicleId} onChange={handleInputChange}>
              <option value="">Select Vehicle</option>
              {vehicles.filter(v => v.status === 'Active').map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.truckId} - {vehicle.model} ({vehicle.licensePlate})
                </option>
              ))}
            </select>
            {errors.vehicleId && <small style={{ color: 'red' }}>{errors.vehicleId}</small>}
          </div>

          <div className="form-group">
            <label>Driver Name *</label>
            <input type="text" name="driverName" value={formData.driverName} onChange={handleInputChange} />
            {errors.driverName && <small style={{ color: 'red' }}>{errors.driverName}</small>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date & Time *</label>
            <input type="datetime-local" name="startDateTime" value={formData.startDateTime} onChange={handleInputChange} />
            {errors.startDateTime && <small style={{ color: 'red' }}>{errors.startDateTime}</small>}
          </div>

          <div className="form-group">
            <label>End Date & Time *</label>
            <input type="datetime-local" name="endDateTime" value={formData.endDateTime} onChange={handleInputChange} />
            {errors.endDateTime && <small style={{ color: 'red' }}>{errors.endDateTime}</small>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Odometer (km) *</label>
            <input type="number" name="startOdometer" value={formData.startOdometer} onChange={handleInputChange} step="0.1" />
          </div>

          <div className="form-group">
            <label>End Odometer (km) *</label>
            <input type="number" name="endOdometer" value={formData.endOdometer} onChange={handleInputChange} step="0.1" />
            {errors.endOdometer && <small style={{ color: 'red' }}>{errors.endOdometer}</small>}
          </div>

          <div className="form-group">
            <label>Distance (km)</label>
            <input type="text" value={distance ? distance.toFixed(1) + ' km' : 'Auto-calculated'} disabled style={{ background: '#f5f5f5' }} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Cargo Type</label>
            <select name="cargoType" value={formData.cargoType} onChange={handleInputChange}>
              <option>Box Truck</option>
              <option>Refrigerated</option>
              <option>Flatbed</option>
              <option>Tanker</option>
            </select>
          </div>

          <div className="form-group">
            <label>Cargo Weight (tons)</label>
            <input type="number" name="cargoWeight" value={formData.cargoWeight} onChange={handleInputChange} step="0.1" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Fuel Purchased (liters) *</label>
            <input type="number" name="fuelLiters" value={formData.fuelLiters} onChange={handleInputChange} step="0.1" />
            {errors.fuelLiters && <small style={{ color: 'red' }}>{errors.fuelLiters}</small>}
          </div>

          <div className="form-group">
            <label>Fuel Cost ($) *</label>
            <input type="number" name="fuelCost" value={formData.fuelCost} onChange={handleInputChange} step="0.01" />
            {errors.fuelCost && <small style={{ color: 'red' }}>{errors.fuelCost}</small>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Trip Purpose</label>
            <select name="tripPurpose" value={formData.tripPurpose} onChange={handleInputChange}>
              <option>Delivery</option>
              <option>Pickup</option>
              <option>Return to depot</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Notes / Special Instructions</label>
          <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="3"></textarea>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button type="submit">Save Trip</button>
          <button type="button" className="secondary" onClick={() => {
            setFormData({
              vehicleId: '',
              driverName: '',
              startDateTime: '',
              endDateTime: '',
              startOdometer: '',
              endOdometer: '',
              cargoType: 'Box Truck',
              cargoWeight: '',
              fuelLiters: '',
              fuelCost: '',
              tripPurpose: 'Delivery',
              notes: ''
            })
            setDistance(null)
          }}>Clear Form</button>
        </div>
      </form>
    </div>
  )
}

export default TripForm