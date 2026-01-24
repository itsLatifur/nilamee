import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_ENDPOINTS } from "../../../../../config/env";
import { toast } from "react-toastify";

const RoleManagement = () => {
  const { user } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: {
      canManageAuctions: false,
      canManageUsers: false,
      canManagePayments: false,
      canViewReports: false,
      canManageRoles: false,
      canApproveSuspensions: false,
      canDeleteContent: false,
    },
  });
  const [newUser, setNewUser] = useState({
    userName: "",
    email: "",
    password: "",
    role: "Admin",
    phone: "",
    address: "",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_ENDPOINTS.ADMIN.USERS, {
        params: { role: "admin-only" },
        withCredentials: true,
      });
      setUsers(data.users || []);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data } = await axios.get(API_ENDPOINTS.ADMIN.ROLES, {
        withCredentials: true,
      });
      setRoles(data.roles || []);
    } catch (error) {
      // If endpoint doesn't exist yet, use default roles
      setRoles([
        { name: "Super Admin", isSystem: true },
        { name: "Admin", isSystem: true },
      ]);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRole.name.trim()) {
      toast.error("Role name is required");
      return;
    }

    setLoading(true);
    try {
      await axios.post(API_ENDPOINTS.ADMIN.CREATE_ROLE, newRole, {
        withCredentials: true,
      });
      toast.success("Role created successfully");
      setShowCreateRoleModal(false);
      setNewRole({
        name: "",
        description: "",
        permissions: {
          canManageAuctions: false,
          canManageUsers: false,
          canManagePayments: false,
          canViewReports: false,
          canManageRoles: false,
          canApproveSuspensions: false,
          canDeleteContent: false,
        },
      });
      fetchRoles();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.userName || !newUser.email || !newUser.password) {
      toast.error("Username, email, and password are required");
      return;
    }

    if (newUser.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await axios.post(API_ENDPOINTS.ADMIN.CREATE_ADMIN, newUser, {
        withCredentials: true,
      });
      toast.success("User created successfully");
      setShowAddUserModal(false);
      setNewUser({
        userName: "",
        email: "",
        password: "",
        role: "Admin",
        phone: "",
        address: "",
      });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!window.confirm("Are you sure you want to delete this role?")) {
      return;
    }

    try {
      await axios.delete(API_ENDPOINTS.ADMIN.DELETE_ROLE(roleId), {
        withCredentials: true,
      });
      toast.success("Role deleted successfully");
      fetchRoles();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete role");
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setLoading(true);
    try {
      await axios.put(
        API_ENDPOINTS.ADMIN.UPDATE_USER_ROLE(selectedUser._id),
        { role: selectedUser.role },
        { withCredentials: true },
      );
      toast.success("User role updated successfully");
      setShowEditUserModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update user role",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (adminUser) => {
    if (
      !window.confirm(
        `Are you sure you want to remove ${adminUser.userName}'s admin role? This will soft-delete their account.`,
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(API_ENDPOINTS.ADMIN.REMOVE_ADMIN(adminUser._id), {
        withCredentials: true,
      });
      toast.success("Admin removed successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove admin");
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreAdmin = async (adminUser) => {
    if (
      !window.confirm(
        `Are you sure you want to restore ${adminUser.userName}'s account?`,
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await axios.put(API_ENDPOINTS.ADMIN.RESTORE_USER(adminUser._id), null, {
        withCredentials: true,
      });
      toast.success("User restored successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to restore user");
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permission) => {
    setNewRole({
      ...newRole,
      permissions: {
        ...newRole.permissions,
        [permission]: !newRole.permissions[permission],
      },
    });
  };

  const permissionLabels = {
    canManageAuctions: "Manage Auctions (approve, delete)",
    canManageUsers: "Manage Users (ban, suspend)",
    canManagePayments: "Manage Payments & Commissions",
    canViewReports: "View Analytics & Reports",
    canManageRoles: "Manage Roles & Permissions",
    canApproveSuspensions: "Approve/Reject Suspensions",
    canDeleteContent: "Permanently Delete Content",
  };

  // Get admin roles only (exclude Bidder and Auctioneer)
  // Filter roles based on current user's role
  let adminRoles = roles.filter(
    (role) => !["Bidder", "Auctioneer"].includes(role.name),
  );

  // If user is Admin (not Super Admin), exclude Super Admin from available roles
  if (user && user.role === "Admin") {
    adminRoles = adminRoles.filter((role) => role.name !== "Super Admin");
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between items-center gap-4">
        <h2 className="text-2xl font-bold whitestone:text-gray-900">
          Role Management - Admin Users
        </h2>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setShowAddUserModal(true)}
            className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-700 transition-all whitespace-nowrap"
            style={{ color: "#ffffff" }}
          >
            + Add User
          </button>
          {user && user.role === "Super Admin" && (
            <button
              onClick={() => setShowCreateRoleModal(true)}
              className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition-all whitespace-nowrap"
              style={{ color: "#ffffff" }}
            >
              + Create New Role
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      {loading &&
      !showCreateRoleModal &&
      !showAddUserModal &&
      !showEditUserModal ? (
        <div className="text-center py-8">Loading users...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/30 backdrop-blur-sm border-2 border-golden-400 whitestone:border-white/30 rounded-lg">
            <thead className="whitestone:bg-gray-200 text-white whitestone:text-black">
              <tr>
                <th className="py-2 px-4 text-left">Username</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Role</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Created</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-warm-white whitestone:text-gray-900">
              {users.length > 0 ? (
                users.map((currentUser) => (
                  <tr
                    key={currentUser._id}
                    className="border-t border-golden-400/20 whitestone:border-gray-300"
                  >
                    <td className="py-3 px-4 font-semibold">
                      {currentUser.userName}
                    </td>
                    <td className="py-3 px-4">{currentUser.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs text-white ${
                          currentUser.role === "Super Admin"
                            ? "bg-purple-600"
                            : currentUser.role === "Admin"
                              ? "bg-blue-600"
                              : "bg-indigo-600"
                        }`}
                        style={{ color: "#ffffff" }}
                      >
                        {currentUser.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs text-white ${
                          currentUser.status === "active"
                            ? "bg-green-500"
                            : currentUser.status === "banned"
                              ? "bg-red-500"
                              : currentUser.status === "suspended"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                        }`}
                        style={{ color: "#ffffff" }}
                      >
                        {currentUser.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(currentUser.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(currentUser);
                            setShowEditUserModal(true);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-xs transition-all"
                          style={{ color: "#ffffff" }}
                        >
                          Edit Role
                        </button>
                        {user &&
                          user.role === "Super Admin" &&
                          (currentUser.status === "deleted" ? (
                            <button
                              onClick={() => handleRestoreAdmin(currentUser)}
                              className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-xs transition-all"
                              style={{ color: "#ffffff" }}
                              disabled={loading}
                            >
                              Restore
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRemoveAdmin(currentUser)}
                              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs transition-all"
                              style={{ color: "#ffffff" }}
                              disabled={loading}
                            >
                              Remove
                            </button>
                          ))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No admin users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white whitestone:bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4 whitestone:text-gray-900">
              Add New User
            </h3>
            <form onSubmit={handleAddUser}>
              <div className="mb-4">
                <label className="block mb-2 font-medium whitestone:text-gray-900">
                  Username *
                </label>
                <input
                  type="text"
                  value={newUser.userName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, userName: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded whitestone:bg-white whitestone:text-gray-900 whitestone:border-gray-400"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium whitestone:text-gray-900">
                  Email *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded whitestone:bg-white whitestone:text-gray-900 whitestone:border-gray-400"
                  placeholder="Enter email"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium whitestone:text-gray-900">
                  Password *
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded whitestone:bg-white whitestone:text-gray-900 whitestone:border-gray-400"
                  placeholder="Enter password (min 8 characters)"
                  minLength="8"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium whitestone:text-gray-900">
                  Role *
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded whitestone:bg-white whitestone:text-gray-900 whitestone:border-gray-400"
                  required
                >
                  {adminRoles.map((role) => (
                    <option key={role.name} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium whitestone:text-gray-900">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) =>
                    setNewUser({ ...newUser, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded whitestone:bg-white whitestone:text-gray-900 whitestone:border-gray-400"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium whitestone:text-gray-900">
                  Address
                </label>
                <textarea
                  value={newUser.address}
                  onChange={(e) =>
                    setNewUser({ ...newUser, address: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded whitestone:bg-white whitestone:text-gray-900 whitestone:border-gray-400"
                  rows="2"
                  placeholder="Enter address"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 whitestone:text-white"
                  style={{ color: "#ffffff" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 whitestone:text-white"
                  style={{ color: "#ffffff" }}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {showCreateRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white whitestone:bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4 whitestone:text-gray-900">
              Create New Role
            </h3>
            <form onSubmit={handleCreateRole}>
              <div className="mb-4">
                <label className="block mb-2 font-medium whitestone:text-gray-900">
                  Role Name *
                </label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded whitestone:bg-white whitestone:text-gray-900 whitestone:border-gray-400"
                  placeholder="e.g., Content Moderator"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium whitestone:text-gray-900">
                  Description
                </label>
                <textarea
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded whitestone:bg-white whitestone:text-gray-900 whitestone:border-gray-400"
                  rows="2"
                  placeholder="Brief description of this role"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium whitestone:text-gray-900">
                  Permissions
                </label>
                <div className="space-y-2 bg-gray-50 whitestone:bg-gray-100 p-4 rounded">
                  {Object.keys(newRole.permissions).map((permission) => (
                    <label
                      key={permission}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={newRole.permissions[permission]}
                        onChange={() => handlePermissionChange(permission)}
                        className="w-4 h-4"
                      />
                      <span className="whitestone:text-gray-900">
                        {permissionLabels[permission]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateRoleModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 whitestone:text-white"
                  style={{ color: "#ffffff" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 whitestone:text-white"
                  style={{ color: "#ffffff" }}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Role Modal */}
      {showEditUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white whitestone:bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 whitestone:text-gray-900">
              Edit User Role
            </h3>
            <form onSubmit={handleEditUser}>
              <div className="mb-4">
                <label className="block mb-2 font-medium whitestone:text-gray-900">
                  User
                </label>
                <input
                  type="text"
                  value={`${selectedUser.userName} (${selectedUser.email})`}
                  className="w-full px-4 py-2 border rounded bg-gray-100 whitestone:bg-gray-200 whitestone:text-gray-900 whitestone:border-gray-400"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium whitestone:text-gray-900">
                  Current Role
                </label>
                <input
                  type="text"
                  value={selectedUser.role}
                  className="w-full px-4 py-2 border rounded bg-gray-100 whitestone:bg-gray-200 whitestone:text-gray-900 whitestone:border-gray-400"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium whitestone:text-gray-900">
                  New Role *
                </label>
                <select
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded whitestone:bg-white whitestone:text-gray-900 whitestone:border-gray-400"
                  required
                >
                  {adminRoles.map((role) => (
                    <option key={role.name} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
                {user && user.role === "Admin" && (
                  <p className="text-xs text-gray-500 mt-1 whitestone:text-gray-600">
                    Note: As an Admin, you cannot assign the Super Admin role.
                  </p>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditUserModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 whitestone:text-white"
                  style={{ color: "#ffffff" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 whitestone:text-white"
                  style={{ color: "#ffffff" }}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
