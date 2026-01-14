import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../../../config/env";
import { toast } from "react-toastify";

const AdminActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLogs: 0,
    logsPerPage: 50,
  });
  const [filters, setFilters] = useState({
    action: "",
    startDate: "",
    endDate: "",
  });

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 50,
        ...filters,
      };

      // Remove empty filters
      Object.keys(params).forEach((key) => !params[key] && delete params[key]);

      const { data } = await axios.get(API_ENDPOINTS.ADMIN.ACTIVITY_LOGS, {
        params,
        withCredentials: true,
      });

      setLogs(data.logs || []);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch activity logs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleApplyFilters = () => {
    fetchLogs(1);
  };

  const handleClearFilters = () => {
    setFilters({
      action: "",
      startDate: "",
      endDate: "",
    });
    setTimeout(() => fetchLogs(1), 0);
  };

  const getActionBadgeColor = (action) => {
    const colorMap = {
      CREATE_ADMIN: "bg-green-600",
      UPDATE_USER_ROLE: "bg-blue-600",
      REMOVE_ADMIN: "bg-red-600",
      BAN_USER: "bg-red-700",
      SUSPEND_USER: "bg-yellow-600",
      DELETE_USER: "bg-gray-600",
      RESTORE_USER: "bg-green-500",
      APPROVE_AUCTION: "bg-green-600",
      REJECT_AUCTION: "bg-red-600",
      DELETE_AUCTION: "bg-gray-600",
      CREATE_ROLE: "bg-purple-600",
      DELETE_ROLE: "bg-red-600",
    };
    return colorMap[action] || "bg-gray-500";
  };

  const formatActionName = (action) => {
    return action.replace(/_/g, " ");
  };

  const actionOptions = [
    { value: "", label: "All Actions" },
    { value: "CREATE_ADMIN", label: "Create Admin" },
    { value: "UPDATE_USER_ROLE", label: "Update User Role" },
    { value: "REMOVE_ADMIN", label: "Remove Admin" },
    { value: "BAN_USER", label: "Ban User" },
    { value: "SUSPEND_USER", label: "Suspend User" },
    { value: "DELETE_USER", label: "Delete User" },
    { value: "RESTORE_USER", label: "Restore User" },
    { value: "APPROVE_AUCTION", label: "Approve Auction" },
    { value: "REJECT_AUCTION", label: "Reject Auction" },
    { value: "DELETE_AUCTION", label: "Delete Auction" },
    { value: "CREATE_ROLE", label: "Create Role" },
    { value: "DELETE_ROLE", label: "Delete Role" },
  ];

  return (
    <div className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col gap-10">
      <div className="mb-6">
        <h1 className="text-golden-500 whitestone:text-gray-900 text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl">
          Admin Activity Log
        </h1>
        <p className="text-sm text-gray-400 whitestone:text-gray-600">
          Track all administrative actions performed on the platform (Super
          Admin only)
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/30 backdrop-blur-sm border-2 border-golden-400 whitestone:border-white/30 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 whitestone:text-gray-900">
          Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium whitestone:text-gray-900">
              Action Type
            </label>
            <select
              name="action"
              value={filters.action}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded whitestone:bg-white whitestone:text-gray-900 whitestone:border-gray-400"
            >
              {actionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium whitestone:text-gray-900">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded whitestone:bg-white whitestone:text-gray-900 whitestone:border-gray-400"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium whitestone:text-gray-900">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded whitestone:bg-white whitestone:text-gray-900 whitestone:border-gray-400"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleApplyFilters}
            className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
            style={{ color: "#ffffff" }}
          >
            Apply Filters
          </button>
          <button
            onClick={handleClearFilters}
            className="bg-gray-500 px-4 py-2 rounded-md hover:bg-gray-600 transition-all"
            style={{ color: "#ffffff" }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Activity Logs Table */}
      {loading ? (
        <div className="text-center py-8">Loading activity logs...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/30 backdrop-blur-sm border-2 border-golden-400 whitestone:border-white/30 rounded-lg">
              <thead className="whitestone:bg-gray-200 text-white whitestone:text-black">
                <tr>
                  <th className="py-2 px-4 text-left">Date & Time</th>
                  <th className="py-2 px-4 text-left">Action</th>
                  <th className="py-2 px-4 text-left">Performed By</th>
                  <th className="py-2 px-4 text-left">Target</th>
                  <th className="py-2 px-4 text-left">Details</th>
                </tr>
              </thead>
              <tbody className="text-warm-white whitestone:text-gray-900">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr
                      key={log._id}
                      className="border-t border-golden-400/20 whitestone:border-gray-300"
                    >
                      <td className="py-3 px-4 text-sm">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${getActionBadgeColor(
                            log.action
                          )}`}
                          style={{ color: "#ffffff" }}
                        >
                          {formatActionName(log.action)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-semibold">
                            {log.performedByName}
                          </div>
                          <div className="text-xs text-gray-400 whitestone:text-gray-600">
                            {log.performedByRole}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {log.targetUserName ? (
                          <div>
                            <div>{log.targetUserName}</div>
                            <div className="text-xs text-gray-400 whitestone:text-gray-600">
                              User
                            </div>
                          </div>
                        ) : log.targetResource?.resourceName ? (
                          <div>
                            <div>{log.targetResource.resourceName}</div>
                            <div className="text-xs text-gray-400 whitestone:text-gray-600">
                              {log.targetResource.resourceType}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {log.changes && Object.keys(log.changes).length > 0 ? (
                          <details className="cursor-pointer">
                            <summary className="text-blue-500 hover:text-blue-600">
                              View Changes
                            </summary>
                            <div className="mt-2 p-2 bg-black/20 whitestone:bg-gray-100 rounded text-xs">
                              <pre className="whitespace-pre-wrap">
                                {JSON.stringify(log.changes, null, 2)}
                              </pre>
                            </div>
                          </details>
                        ) : log.reason ? (
                          <div className="text-xs italic">{log.reason}</div>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No activity logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-2">
              <button
                onClick={() => fetchLogs(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: "#ffffff" }}
              >
                Previous
              </button>
              <span className="px-4 py-2 whitestone:text-gray-900">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchLogs(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: "#ffffff" }}
              >
                Next
              </button>
            </div>
          )}

          {/* Total Count */}
          <div className="mt-4 text-center text-sm text-gray-400 whitestone:text-gray-600">
            Showing {logs.length} of {pagination.totalLogs} total logs
          </div>
        </>
      )}
    </div>
  );
};

export default AdminActivityLog;
