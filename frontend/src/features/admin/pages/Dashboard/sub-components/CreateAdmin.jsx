import React, { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../../../config/env";
import { toast } from "react-toastify";

const CreateAdmin = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.userName || !formData.email || !formData.password) {
      toast.error("Username, email, and password are required");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        API_ENDPOINTS.ADMIN.CREATE_ADMIN,
        formData,
        { withCredentials: true }
      );

      toast.success(data.message);
      setFormData({
        userName: "",
        email: "",
        password: "",
        phone: "",
        address: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Create New Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Username *</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password (min 8 characters)"
            minLength="8"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter phone number"
            maxLength="11"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter address"
            rows="3"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {loading ? "Creating Admin..." : "Create Admin"}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Note:</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>Both Super Admin and Admin can create new admin accounts</li>
          <li>Admins have full access to the admin panel</li>
          <li>Admins cannot remove or ban other admins or Super Admin</li>
          <li>Only Super Admin can remove admin accounts</li>
          <li>Only Super Admin can permanently delete data from database</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateAdmin;
