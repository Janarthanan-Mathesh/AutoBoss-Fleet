import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Autos = () => {
  const [autos, setAutos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAuto, setEditingAuto] = useState(null);
  const [formData, setFormData] = useState({
    auto_id: '',
    model: '',
    number: '',
    type: 'EV',
    purchase_date: '',
    status: 'active',
    image: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAutos();
  }, []);

  const fetchAutos = async () => {
    try {
      const response = await axios.get('/api/autos');
      setAutos(response.data);
    } catch (error) {
      toast.error('Failed to fetch autos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      if (editingAuto) {
        await axios.put(`/api/autos/${editingAuto._id}`, data);
        toast.success('Auto updated successfully');
      } else {
        await axios.post('/api/autos', data);
        toast.success('Auto added successfully');
      }
      fetchAutos();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save auto');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this auto?')) {
      try {
        await axios.delete(`/api/autos/${id}`);
        toast.success('Auto deleted successfully');
        fetchAutos();
      } catch (error) {
        toast.error('Failed to delete auto');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      auto_id: '',
      model: '',
      number: '',
      type: 'EV',
      purchase_date: '',
      status: 'active',
      image: null
    });
    setEditingAuto(null);
  };

  const openEditModal = (auto) => {
    setEditingAuto(auto);
    setFormData({
      auto_id: auto.auto_id,
      model: auto.model,
      number: auto.number,
      type: auto.type,
      purchase_date: auto.purchase_date.split('T')[0],
      status: auto.status,
      image: null
    });
    setShowModal(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Autos Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Auto
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {autos.map((auto) => (
              <tr key={auto._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{auto.auto_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{auto.model}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{auto.number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{auto.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{auto.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openEditModal(auto)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(auto._id)}
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
                {editingAuto ? 'Edit Auto' : 'Add Auto'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Auto ID</label>
                  <input
                    type="text"
                    value={formData.auto_id}
                    onChange={(e) => setFormData({...formData, auto_id: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Model</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Number</label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) => setFormData({...formData, number: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="EV">EV</option>
                    <option value="CNG">CNG</option>
                    <option value="Fuel">Fuel</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Purchase Date</label>
                  <input
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => setFormData({...formData, purchase_date: e.target.value})}
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
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Image</label>
                  <input
                    type="file"
                    onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    accept="image/*"
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
                    {editingAuto ? 'Update' : 'Add'}
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

export default Autos;
