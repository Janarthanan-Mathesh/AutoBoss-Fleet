import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Rentals = () => {
  const [rentals, setRentals] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [autos, setAutos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRental, setEditingRental] = useState(null);
  const [formData, setFormData] = useState({
    rental_id: '',
    driver_id: '',
    auto_id: '',
    rent_type: 'daily',
    rent_amount: '',
    start_date: '',
    end_date: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRentals();
    fetchDrivers();
    fetchAutos();
  }, []);

  const fetchRentals = async () => {
    try {
      const response = await axios.get('/api/rentals');
      setRentals(response.data);
    } catch (error) {
      toast.error('Failed to fetch rentals');
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('/api/drivers');
      setDrivers(response.data);
    } catch (error) {
      console.error('Failed to fetch drivers');
    }
  };

  const fetchAutos = async () => {
    try {
      const response = await axios.get('/api/autos');
      setAutos(response.data);
    } catch (error) {
      console.error('Failed to fetch autos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRental) {
        await axios.put(`/api/rentals/${editingRental._id}`, formData);
        toast.success('Rental updated successfully');
      } else {
        await axios.post('/api/rentals', formData);
        toast.success('Rental added successfully');
      }
      fetchRentals();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save rental');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this rental?')) {
      try {
        await axios.delete(`/api/rentals/${id}`);
        toast.success('Rental deleted successfully');
        fetchRentals();
      } catch (error) {
        toast.error('Failed to delete rental');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      rental_id: '',
      driver_id: '',
      auto_id: '',
      rent_type: 'daily',
      rent_amount: '',
      start_date: '',
      end_date: '',
      status: 'active'
    });
    setEditingRental(null);
  };

  const openEditModal = (rental) => {
    setEditingRental(rental);
    setFormData({
      rental_id: rental.rental_id,
      driver_id: rental.driver_id,
      auto_id: rental.auto_id,
      rent_type: rental.rent_type,
      rent_amount: rental.rent_amount,
      start_date: rental.start_date.split('T')[0],
      end_date: rental.end_date.split('T')[0],
      status: rental.status
    });
    setShowModal(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rentals Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Rental
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rentals.map((rental) => (
              <tr key={rental._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rental.rental_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {drivers.find(d => d._id === rental.driver_id)?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {autos.find(a => a._id === rental.auto_id)?.number || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rental.rent_type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{rental.rent_amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rental.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openEditModal(rental)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(rental._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingRental ? 'Edit Rental' : 'Add Rental'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Rental ID</label>
                  <input
                    type="text"
                    value={formData.rental_id}
                    onChange={(e) => setFormData({...formData, rental_id: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Driver</label>
                  <select
                    value={formData.driver_id}
                    onChange={(e) => setFormData({...formData, driver_id: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Select Driver</option>
                    {drivers.map((driver) => (
                      <option key={driver._id} value={driver._id}>
                        {driver.name} - {driver.driver_id}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Auto</label>
                  <select
                    value={formData.auto_id}
                    onChange={(e) => setFormData({...formData, auto_id: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Select Auto</option>
                    {autos.map((auto) => (
                      <option key={auto._id} value={auto._id}>
                        {auto.number} - {auto.model}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Rent Type</label>
                  <select
                    value={formData.rent_type}
                    onChange={(e) => setFormData({...formData, rent_type: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Rent Amount</label>
                  <input
                    type="number"
                    value={formData.rent_amount}
                    onChange={(e) => setFormData({...formData, rent_amount: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {editingRental ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rentals;
