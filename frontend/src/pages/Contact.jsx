import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateTo = useNavigate();
  const handleContactForm = (e) => {
    e.preventDefault();
    setLoading(true);

    const templateParams = {
      name,
      email,
      phone,
      subject,
      message,
    };

    emailjs
      .send(
        "service_v01mtcu",
        "template_3a1r5xp",
        templateParams,
        "YcOimjllS64zn4ghK"
      )
      .then(() => {
        toast.success("Thank You! Your message has been sent successfully.");
        setLoading(false);
        navigateTo("/");
      })
      .catch((err) => {
        toast.error("Failed to send message.");
        setLoading(false);
      });
  };

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-start">
        <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/30 whitestone:backdrop-blur-xl backdrop-blur-sm whitestone:backdrop-blur-xl mx-auto w-full h-auto px-2 flex flex-col gap-4 items-center py-4 justify-center rounded-md border-4 border-golden-400 whitestone:border-white/30 shadow-2xl">
          <div className="bg-luxury-gradient rounded-lg p-4 w-full shadow-lg border-2 border-golden-400 whitestone:border-white/30 dark:border-golden-500 whitestone:border-white/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gold-gradient whitestone:text-white"></div>
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-gradient whitestone:text-white"></div>
            <h3
              className={`text-white whitestone:text-black whitestone:text-white text-xl font-bold mb-1 min-[480px]:text-xl md:text-2xl lg:text-3xl flex items-center gap-2`}
            >
              <span className="text-golden-300 whitestone:text-gray-900">??</span>
              Contact Us
            </h3>
            <p className="text-golden-100 whitestone:text-gray-700 text-sm">
              We'd love to hear from you
            </p>
          </div>
          <form
            className="flex flex-col gap-5 w-full"
            onSubmit={handleContactForm}
          >
            <div className="flex flex-col gap-2">
              <label className="text-[16px] text-golden-300 whitestone:text-gray-900">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 p-2 border-b-2 border-b-golden-400 whitestone:border-b-gray-400 bg-transparent rounded-md focus:outline-none focus:border-b-golden-300 text-warm-white transition-all"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[16px] text-golden-300 whitestone:text-gray-900">Your Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-2 border-b-2 border-b-golden-400 whitestone:border-b-gray-400 bg-transparent rounded-md focus:outline-none focus:border-b-golden-300 text-warm-white transition-all"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[16px] text-golden-300 whitestone:text-gray-900">Your Phone</label>
              <input
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mt-1 p-2 border-b-2 border-b-golden-400 whitestone:border-b-gray-400 bg-transparent rounded-md focus:outline-none focus:border-b-golden-300 text-warm-white transition-all"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[16px] text-golden-300 whitestone:text-gray-900">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full mt-1 p-2 border-b-2 border-b-golden-400 whitestone:border-b-gray-400 bg-transparent rounded-md focus:outline-none focus:border-b-golden-300 text-warm-white transition-all"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[16px] text-golden-300 whitestone:text-gray-900">Message</label>
              <textarea
                rows={7}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full mt-1 p-2 border-2 border-golden-400 whitestone:border-white/30 bg-transparent rounded-md focus:outline-none focus:border-golden-300 text-warm-white transition-all"
                required
              />
            </div>

            <button
              className="bg-burgundy-gradient whitestone:bg-blue-600 mx-auto font-semibold text-xl transition-all duration-300 py-2 px-4 rounded-md text-warm-white whitestone:text-white my-4 border-2 border-golden-400 whitestone:border-blue-500 shadow-lg btn-hover"
              type="submit"
            >
              {loading ? "Sending Message..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Contact;
