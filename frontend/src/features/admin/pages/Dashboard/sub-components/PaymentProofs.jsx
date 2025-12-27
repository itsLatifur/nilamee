import {
  deletePaymentProof,
  getSinglePaymentProofDetail,
  updatePaymentProof,
} from "../../../store/superAdminSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const PaymentProofs = () => {
  const { paymentProofs, singlePaymentProof } = useSelector(
    (state) => state.superAdmin
  );
  const [openDrawer, setOpenDrawer] = useState(false);
  const dispatch = useDispatch();

  const handlePaymentProofDelete = (id) => {
    dispatch(deletePaymentProof(id));
  };

  const handleFetchPaymentDetail = (id) => {
    dispatch(getSinglePaymentProofDetail(id));
  };

  useEffect(() => {
    if (singlePaymentProof && Object.keys(singlePaymentProof).length > 0) {
      setOpenDrawer(true);
    }
  }, [singlePaymentProof]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 backdrop-blur-sm mt-5 border-2 border-golden-400 rounded-lg">
          <thead className="bg-burgundy-700 dark:bg-gray-900 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gold-gradient"></div>
            <tr>
              <th className="w-1/3 py-2">User ID</th>
              <th className="w-1/3 py-2">Status</th>
              <th className="w-1/3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-golden-200">
            {paymentProofs.length > 0 ? (
              paymentProofs.map((element, index) => {
                return (
                  <tr key={index}>
                    <td className="py-2 px-4 text-center">{element.userId}</td>
                    <td className="py-2 px-4 text-center">{element.status}</td>
                    <td className="flex items-center py-4 justify-center gap-3">
                      <button
                        className="bg-gold-gradient text-warm-white py-1 px-3 rounded border-2 border-golden-400 shadow-lg transition-all duration-300 btn-hover"
                        onClick={() => openUpdateModal(element._id)}
                      >
                        Update
                      </button>
                      <button
                        className="bg-burgundy-gradient shadow-lg border-2 border-golden-400 text-warm-white py-1 px-3 rounded transition-all duration-300 btn-hover"
                        onClick={() => handlePaymentProofDelete(element._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="text-center text-xl text-sky-600 py-3">
                <td>No payment proofs are found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Drawer setOpenDrawer={setOpenDrawer} openDrawer={openDrawer} />
    </>
  );
};

export default PaymentProofs;

export const Drawer = ({ setOpenDrawer, openDrawer }) => {
  const { singlePaymentProof, loading } = useSelector(
    (state) => state.superAdmin
  );
  const [amount, setAmount] = useState(singlePaymentProof.amount || "");
  const [status, setStatus] = useState(singlePaymentProof.status || "");

  const dispatch = useDispatch();
  const handlePaymentProofUpdate = () => {
    dispatch(updatePaymentProof(singlePaymentProof._id, status, amount));
  };

  return (
    <>
      <section
        className={`fixed ${
          openDrawer && singlePaymentProof.userId ? "bottom-0" : "-bottom-full"
        }  left-0 w-full transition-all duration-300 h-full bg-[#00000087] flex items-end`}
      >
        <div className="bg-gradient-to-br from-burgundy-950/95 to-golden-950/90 dark:from-black/95 dark:to-gray-950/90 backdrop-blur-sm h-fit transition-all duration-300 w-full border-t-4 border-golden-400">
          <div className="w-full px-5 py-8 sm:max-w-[640px] sm:m-auto">
            <h3 className="text-golden-300  text-3xl font-semibold text-center mb-1">
              Update Payment Proof
            </h3>
            <p className="text-golden-300">
              You can update payment status and amount.
            </p>
            <form className="flex flex-col gap-5 my-5">
              <div className="flex flex-col gap-3">
                <label className="text-[16px] text-golden-300 ">User ID</label>
                <input
                  type="text"
                  value={singlePaymentProof.userId || ""}
                  disabled
                  onChange={(e) => e.target.value}
                  className="text-xl px-1 py-2 bg-transparent border-[1px] border-golden-400  rounded-md focus:outline-none text-warm-white focus:border-golden-300 transition-all"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[16px] text-golden-300">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-xl px-1 py-2 bg-transparent border-[1px] border-golden-400  rounded-md focus:outline-none text-warm-white focus:border-golden-300 transition-all"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[16px] text-golden-300">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="text-xl px-1 py-2 bg-transparent border-[1px] border-golden-400  rounded-md focus:outline-none text-warm-white focus:border-golden-300 transition-all"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Settled">Settled</option>
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[16px] text-golden-300">Comment</label>
                <textarea
                  rows={5}
                  value={singlePaymentProof.comment || ""}
                  onChange={(e) => e.target.value}
                  disabled
                  className="text-xl px-1 py-2 bg-transparent border-[1px] border-golden-400  rounded-md focus:outline-none text-golden-300"
                />
              </div>
              <div>
                <Link
                  to={singlePaymentProof.proof?.url || ""}
                  className="bg-gold-gradient shadow-lg border-2 border-golden-400 flex justify-center w-full py-2 rounded-md text-warm-white font-semibold text-xl transition-all duration-300 btn-hover"
                  target="_blank"
                >
                  Payment Proof (SS)
                </Link>
              </div>
              <div>
                <button
                  type="button"
                  className="bg-gold-gradient flex justify-center w-full py-2 rounded-md text-warm-white font-semibold text-xl transition-all duration-300 shadow-lg border-2 border-golden-400 btn-hover"
                  onClick={handlePaymentProofUpdate}
                >
                  {loading ? "Updating Payment Proof" : "Update Payment Proof"}
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="bg-burgundy-gradient flex justify-center w-full py-2 rounded-md text-warm-white font-semibold text-xl transition-all duration-300 shadow-lg border-2 border-golden-400 btn-hover"
                  onClick={() => setOpenDrawer(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
