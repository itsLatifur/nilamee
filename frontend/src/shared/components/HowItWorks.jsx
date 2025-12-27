import React from "react";
import {
  FaUser,
  FaGavel,
  FaEnvelope,
  FaDollarSign,
  FaFileInvoice,
  FaRedo,
} from "react-icons/fa";

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaUser />,
      title: "User Registration",
      description:
        "Users must register or log in to perform operations such as posting auctions, bidding on items, accessing the dashboard, and sending payment proof.",
    },
    {
      icon: <FaGavel />,
      title: "Role Selection",
      description:
        'Users can register as either a "Bidder" or "Auctioneer." Bidders can bid on items, while Auctioneers can post items.',
    },
    {
      icon: <FaEnvelope />,
      title: "Winning Bid Notification",
      description:
        "After winning an item, the highest bidder will receive an email with the Auctioneer's payment method information, including bank transfer, Easypaisa, and PayPal.",
    },
    {
      icon: <FaDollarSign />,
      title: "Commission Payment",
      description:
        "If the Bidder pays, the Auctioneer must pay 5% of that payment to the platform. Failure to pay results in being unable to post new items, and a legal notice will be sent.",
    },
    {
      icon: <FaFileInvoice />,
      title: "Proof of Payment",
      description:
        "The platform receives payment proof as a screenshot and the total amount sent. Once approved by the Administrator, the unpaid commission of the Auctioneer will be adjusted accordingly.",
    },
    {
      icon: <FaRedo />,
      title: "Reposting Items",
      description:
        "If the Bidder does not pay, the Auctioneer can republish the item without any additional cost.",
    },
  ];

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-center">
        <h1
          className={`text-golden-500 text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
        >
          Discover How PrimeBid Operates
        </h1>
        <div className="flex flex-col gap-4 my-5">
          {steps.map((element, index) => {
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-burgundy-950/10 to-golden-950/5 dark:from-black/10 dark:to-gray-950/5 backdrop-blur-sm rounded-lg p-4 lg:p-6 flex flex-col gap-3 group hover:bg-burgundy-700 dark:hover:bg-black dark:bg-gray-900 transition-all duration-300 border-2 border-golden-400 hover:border-burgundy-400 dark:hover:border-gray-600 hover:shadow-2xl hover:scale-[1.02] relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-0 h-full bg-gold-gradient transition-all duration-300 group-hover:w-2"></div>
                <div className="bg-burgundy-900 dark:bg-black text-warm-white p-3 text-xl rounded-full w-fit group-hover:bg-gold-gradient transition-all duration-300">
                  {element.icon}
                </div>
                <h3
                  className={`text-golden-500 text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl`}
                >
                  {element.title}
                </h3>
                <p className="text-xl text-golden-200 group-hover:text-warm-white transition-all duration-300">
                  {element.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
