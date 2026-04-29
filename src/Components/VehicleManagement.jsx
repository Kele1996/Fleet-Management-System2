import { useState } from 'react'

function VehicleManagement({ vehicles, addVehicle, updateVehicle, deleteVehicle }) {
  const [showModal, setShowModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [formData, setFormData] = useState({
    truckId: '',
    licensePlate: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'Box Truck',
    status: 'Active',
    currentOdometer: 0
  })

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingVehicle) {
      updateVehicle({ ...formData, id: editingVehicle.id })
    } else {
      addVehicle(formData)
    }
    resetForm()
  }

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle)
    setFormData(vehicle)
    setShowModal(true)
  }

  const resetForm = () => {
    setShowModal(false)
    setEditingVehicle(null)
    setFormData({
      truckId: '',
      licensePlate: '',
      model: '',
      year: new Date().getFullYear(),
      type: 'Box Truck',
      status: 'Active',
      currentOdometer: 0
    })
  }

  const getStatusBadge = (status) => {
    const classes = {
      'Active': 'badge-active',
      'Maintenance': 'badge-maintenance',
      'Retired': 'badge-retired'
    }
    return <span className={`badge ${classes[status]}`}>{status}</span>
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>🚛 Vehicle Management</h2>
        <button onClick={() => setShowModal(true)}>+ Add Vehicle</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Truck ID</th>
              <th>License Plate</th>
              <th>Model</th>
              <th>Year</th>
              <th>Type</th>
              <th>Status</th>
              <th>Odometer (km)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(vehicle => (
              <tr key={vehicle.id}>
                <td>{vehicle.truckId}</td>
                <td>{vehicle.licensePlate}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.year}</td>
                <td>{vehicle.type}</td>
                <td>{getStatusBadge(vehicle.status)}</td>
                <td>{vehicle.currentOdometer?.toLocaleString()}</td>
                <td>
                  <button onClick={() => handleEdit(vehicle)} style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Edit</button>
                  <button className="danger" onClick={() => deleteVehicle(vehicle.id)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
              <button className="close-btn" onClick={() => resetForm()}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Truck ID *</label>
                  <input type="text" name="truckId" value={formData.truckId} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>License Plate *</label>
                  <input type="text" name="licensePlate" value={formData.licensePlate} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Model *</label>
                  <input type="text" name="model" value={formData.model} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Year *</label>
                  <input type="number" name="year" value={formData.year} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Type *</label>
                  <select name="type" value={formData.type} onChange={handleInputChange}>
                    <option>Box Truck</option>
                    <option>Refrigerated</option>
                    <option>Flatbed</option>
                    <option>Tanker</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option>Active</option>
                    <option>Maintenance</option>
                    <option>Retired</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Current Odometer (km)</label>
                <input type="number" name="currentOdometer" value={formData.currentOdometer} onChange={handleInputChange} step="0.1" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit">{editingVehicle ? 'Update' : 'Save'}</button>
                <button type="button" className="secondary" onClick={() => resetForm()}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default VehicleManagement