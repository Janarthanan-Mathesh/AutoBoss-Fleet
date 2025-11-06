import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Maintenance = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [autos, setAutos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [formData, setFormData] = useState({
    auto_id: '',
    date: '',
    description: '',
    cost: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenance();
    fetchAutos();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const response = await axios.get('/api/maintenance');
      setMaintenance(response.data);
    } catch (error) {
      toast.error('Failed to fetch maintenance records');
    } finally {
      setLoading(false);
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
      if (editingMaintenance) {
        await axios.put(`/api/maintenance/${editingMaintenance._id}`, formData);
        toast.success('Maintenance record updated successfully');
      } else {
        await axios.post('/api/maintenance', formData);
        toast.success('Maintenance record added successfully');
      }
      fetchMaintenance();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save maintenance record');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await axios.delete(`/api/maintenance/${id}`);
        toast.success('Maintenance record deleted successfully');
        fetchMaintenance();
      } catch (error) {
        toast.error('Failed to delete maintenance record');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      auto_id: '',
      date: '',
      description: '',
      cost: ''
    });
    setEditingMaintenance(null);
  };

  const openEditModal = (record) => {
    setEditingMaintenance(record);
    setFormData({
      auto_id: record.auto_id,
      date: record.date.split('T')[0],
      description: record.description,
      cost: record.cost
    });
    setShowModal(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Maintenance Tracking</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Maintenance Record
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {maintenance.map((record) => (
              <tr key={record._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {autos.find(a => a._id === record.auto_id)?.number || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{record.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{record.cost}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openEditModal(record)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(record._id)}
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
                {editingMaintenance ? 'Edit Maintenance Record' : 'Add Maintenance Record'}
              </h3>
              <form onSubmit={handleSubmit}>
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
                  <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="3"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Cost</label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
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
                    {editingMaintenance ? 'Update' : 'Add'}
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

export default Maintenance;
