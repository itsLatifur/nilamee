import { postCommissionProof } from "@/store/slices/commissionSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const SubmitCommission = () => {
  const [proof, setProof] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");

  const proofHandler = (e) => {
    const file = e.target.files[0];
    setProof(file);
  };

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.commission);
  const handlePaymentProof = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("proof", proof);
    formData.append("amount", amount);
    formData.append("comment", comment);
    dispatch(postCommissionProof(formData));
  };

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-start">
        <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 backdrop-blur-sm mx-auto w-full h-auto px-2 flex flex-col gap-4 items-center py-4 justify-center rounded-md border-2 border-golden-400 shadow-2xl">
          <form
            className="flex flex-col gap-5 w-full"
            onSubmit={handlePaymentProof}
          >
            <h3
              className={`text-golden-300 text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl`}
            >
              Upload Payment Proof
            </h3>
            <div className="flex flex-col gap-2">
              <label className="text-[16px] text-golden-300">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 focus:outline-none text-warm-white focus:border-b-golden-300 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[16px] text-golden-300">
                Payment Proof (ScreenShot)
              </label>
              <input
                type="file"
                onChange={proofHandler}
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 focus:outline-none text-warm-white focus:border-b-golden-300 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[16px] text-golden-300">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={7}
                className="text-[16px] py-2 bg-transparent border-[1px] rounded-md px-1 border-golden-400 focus:outline-none text-warm-white focus:border-golden-300 transition-all"
              />
            </div>
            <button
              className="bg-gold-gradient mx-auto font-semibold text-xl transition-all duration-300 py-2 px-4 rounded-md my-4 border-2 border-golden-400 shadow-lg text-warm-white btn-hover"
              type="submit"
            >
              {loading ? "Uploading..." : "Upload Payment Proof"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default SubmitCommission;
