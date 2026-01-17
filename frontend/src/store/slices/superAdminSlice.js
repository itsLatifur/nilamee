import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getAllAuctionItems } from "./auctionSlice";

const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState: {
    loading: false,
    monthlyRevenue: [],
    totalAuctioneers: [],
    totalBidders: [],
    pendingPayments: [],
    paymentProofs: [],
    singlePaymentProof: {},
  },
  reducers: {
    requestForMonthlyRevenue(state, action) {
      state.loading = true;
      state.monthlyRevenue = [];
    },
    successForMonthlyRevenue(state, action) {
      state.loading = false;
      state.monthlyRevenue = action.payload;
    },
    failedForMonthlyRevenue(state, action) {
      state.loading = false;
      state.monthlyRevenue = [];
    },
    requestForAllUsers(state, action) {
      state.loading = true;
      state.totalAuctioneers = [];
      state.totalBidders = [];
    },
    successForAllUsers(state, action) {
      state.loading = false;
      state.totalAuctioneers = action.payload.auctioneersArray;
      state.totalBidders = action.payload.biddersArray;
    },
    failureForAllUsers(state, action) {
      state.loading = false;
      state.totalAuctioneers = [];
      state.totalBidders = [];
    },
    requestForPaymentProofs(state, action) {
      state.loading = true;
      state.paymentProofs = [];
    },
    successForPaymentProofs(state, action) {
      state.loading = false;
      state.paymentProofs = action.payload;
    },
    failureForPaymentProofs(state, action) {
      state.loading = false;
      state.paymentProofs = [];
    },
    requestForPendingPayments(state, action) {
      state.loading = true;
      state.pendingPayments = [];
    },
    successForPendingPayments(state, action) {
      state.loading = false;
      // payload includes pending array and pagination metadata
      state.pendingPayments = action.payload.pending || [];
      state.pendingTotal = action.payload.total || 0;
      state.pendingPage = action.payload.page || 1;
      state.pendingPages = action.payload.pages || 1;
    },
    failureForPendingPayments(state, action) {
      state.loading = false;
      state.pendingPayments = [];
    },
    requestForDeletePaymentProof(state, action) {
      state.loading = true;
    },
    successForDeletePaymentProof(state, action) {
      state.loading = false;
    },
    failureForDeletePaymentProof(state, action) {
      state.loading = false;
    },
    requestForSinglePaymentProofDetail(state, action) {
      state.loading = true;
      state.singlePaymentProof = {};
    },
    successForSinglePaymentProofDetail(state, action) {
      state.loading = false;
      state.singlePaymentProof = action.payload;
    },
    failureForSinglePaymentProofDetail(state, action) {
      state.loading = false;
      state.singlePaymentProof = {};
    },
    requestForUpdatePaymentProof(state, action) {
      state.loading = true;
    },
    successForUpdatePaymentProof(state, action) {
      state.loading = false;
    },
    failureForUpdatePaymentProof(state, action) {
      state.loading = false;
    },
    requestForAuctionItemDelete(state, action) {
      state.loading = true;
    },
    successForAuctionItemDelete(state, action) {
      state.loading = false;
    },
    failureForAuctionItemDelete(state, action) {
      state.loading = false;
    },
    clearAllErrors(state, action) {
      state.loading = false;
      state.monthlyRevenue = state.monthlyRevenue;
      state.paymentProofs = state.paymentProofs;
      state.totalAuctioneers = state.totalAuctioneers;
      state.totalBidders = state.totalBidders;
      state.singlePaymentProof = {};
    },
  },
});

export const getMonthlyRevenue = () => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForMonthlyRevenue());
  try {
    const response = await axios.get(
      "http://localhost:5000/api/v1/superadmin/monthlyincome",
      { withCredentials: true },
    );
    dispatch(
      superAdminSlice.actions.successForMonthlyRevenue(
        response.data.totalMonthlyRevenue,
      ),
    );
  } catch (error) {
    dispatch(superAdminSlice.actions.failedForMonthlyRevenue());
    console.error(error.response.data.message);
  }
};

export const getPendingPayments = () => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForPendingPayments());
  try {
    // default pagination and filters
    const response = await axios.get(
      `http://localhost:5000/api/v1/superadmin/payments/pending?page=1&limit=20`,
      { withCredentials: true },
    );
    dispatch(
      superAdminSlice.actions.successForPendingPayments({
        pending: response.data.pending,
        total: response.data.total,
        page: response.data.page,
        pages: response.data.pages,
      }),
    );
  } catch (error) {
    dispatch(superAdminSlice.actions.failureForPendingPayments());
    console.error(error.response?.data?.message || error.message);
  }
};

export const getPendingPaymentsPage =
  ({
    page = 1,
    limit = 20,
    status = "All",
    processed = "All",
    hold = "All",
  } = {}) =>
  async (dispatch) => {
    dispatch(superAdminSlice.actions.requestForPendingPayments());
    try {
      const qs = `?page=${page}&limit=${limit}&status=${encodeURIComponent(status)}&processed=${encodeURIComponent(processed)}&hold=${encodeURIComponent(hold)}`;
      const response = await axios.get(
        `http://localhost:5000/api/v1/superadmin/payments/pending${qs}`,
        { withCredentials: true },
      );
      dispatch(
        superAdminSlice.actions.successForPendingPayments({
          pending: response.data.pending,
          total: response.data.total,
          page: response.data.page,
          pages: response.data.pages,
        }),
      );
    } catch (error) {
      dispatch(superAdminSlice.actions.failureForPendingPayments());
      console.error(error.response?.data?.message || error.message);
    }
  };

export const approvePendingPayment = (id) => async (dispatch) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/v1/superadmin/payments/approve/${id}`,
      {},
      { withCredentials: true },
    );
    toast.success(response.data.message);
    return response;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    toast.error(error.response?.data?.message || "Failed to approve payout");
  }
};

export const holdPendingPayment =
  (id, note = "") =>
  async (dispatch) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/superadmin/payments/hold/${id}`,
        { note },
        { withCredentials: true },
      );
      toast.info(response.data.message || "Escrow placed on hold");
      return response;
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to place hold");
    }
  };

export const unholdPendingPayment =
  (id, note = "") =>
  async (dispatch) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/superadmin/payments/unhold/${id}`,
        { note },
        { withCredentials: true },
      );
      toast.success(response.data.message || "Escrow hold removed");
      return response;
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to remove hold");
    }
  };

export const addEscrowNote = (id, note) => async (dispatch) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/v1/superadmin/escrow/note/${id}`,
      { note },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      },
    );
    toast.success(response.data.message || "Note added");
    return response;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    toast.error(error.response?.data?.message || "Failed to add note");
  }
};

export const getAllUsers = () => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForAllUsers());
  try {
    const response = await axios.get(
      "http://localhost:5000/api/v1/superadmin/users/getall",
      { withCredentials: true },
    );
    dispatch(superAdminSlice.actions.successForAllUsers(response.data));
  } catch (error) {
    dispatch(superAdminSlice.actions.failureForAllUsers());
    console.error(error.response.data.message);
  }
};

export const getAllPaymentProofs = () => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForPaymentProofs());
  try {
    const response = await axios.get(
      "http://localhost:5000/api/v1/superadmin/paymentproofs/getall",
      { withCredentials: true },
    );
    dispatch(
      superAdminSlice.actions.successForPaymentProofs(
        response.data.paymentProofs,
      ),
    );
  } catch (error) {
    dispatch(superAdminSlice.actions.failureForPaymentProofs());
    console.error(error.response.data.message);
  }
};

export const deletePaymentProof = (id) => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForDeletePaymentProof());
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/v1/superadmin/paymentproof/delete/${id}`,
      { withCredentials: true },
    );
    dispatch(superAdminSlice.actions.successForDeletePaymentProof());
    dispatch(getAllPaymentProofs());
    toast.success(response.data.message);
  } catch (error) {
    dispatch(superAdminSlice.actions.failureForDeletePaymentProof());
    console.error(error.response.data.message);
    toast.error(error.response.data.message);
  }
};

export const getSinglePaymentProofDetail = (id) => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForSinglePaymentProofDetail());
  try {
    const response = await axios.get(
      `http://localhost:5000/api/v1/superadmin/paymentproof/${id}`,
      { withCredentials: true },
    );
    dispatch(
      superAdminSlice.actions.successForSinglePaymentProofDetail(
        response.data.paymentProofDetail,
      ),
    );
  } catch (error) {
    dispatch(superAdminSlice.actions.failureForSinglePaymentProofDetail());
    console.error(error.response.data.message);
  }
};

export const updatePaymentProof = (id, status, amount) => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForUpdatePaymentProof());
  try {
    const response = await axios.put(
      `http://localhost:5000/api/v1/superadmin/paymentproof/status/update/${id}`,
      { status, amount },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      },
    );
    dispatch(superAdminSlice.actions.successForUpdatePaymentProof());
    toast.success(response.data.message);
    dispatch(getAllPaymentProofs());
    dispatch(superAdminSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(superAdminSlice.actions.failureForUpdatePaymentProof());
    console.error(error.response.data.message);
    toast.error(error.response.data.message);
  }
};

export const deleteAuctionItem = (id) => async (dispatch) => {
  dispatch(superAdminSlice.actions.requestForAuctionItemDelete());
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/v1/superadmin/auctionitem/delete/${id}`,
      { withCredentials: true },
    );
    dispatch(superAdminSlice.actions.successForAuctionItemDelete());
    toast.success(response.data.message);
    dispatch(getAllAuctionItems());
  } catch (error) {
    dispatch(superAdminSlice.actions.failureForAuctionItemDelete());
    console.error(error.response.data.message);
    toast.error(error.response.data.message);
  }
};

export const clearAllSuperAdminSliceErrors = () => (dispatch) => {
  dispatch(superAdminSlice.actions.clearAllErrors());
};

export default superAdminSlice.reducer;
