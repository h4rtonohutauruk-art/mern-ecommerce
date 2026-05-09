import React from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";

const stripePromise = loadStripe(
  "pk_test_51T9JIyKxHLaWA5dM8kxLbZ09fNMApINcbVEKV1bFj6kSdQQGFntWd0ud0xcvPkcAnumhPd5x0Rn92NH6Qzpvlrnk00L2CSqyoe",
);
const OrderSummary = () => {
  const { total, subTotal, coupon, isCouponApplied, cart } = useCartStore();

  const savings = subTotal - total;
  const formatedSubtotal = subTotal.toFixed(2);
  const formatedTotal = total.toFixed(2);
  const formatedSavings = savings.toFixed(2);

  // const handlePayment = async () => {
  //   const stripe = await stripePromise;
  //   const res = await axios.post("/payments/create-checkout-session", {
  //     products: cart,
  //     coupon: coupon ? coupon.code : null,
  //   });
  //   const session = res.data;
  //   console.log("session is here", session);
  //   const result = await stripe.redirectToCheckout({
  //     sessionId: session.id,
  //   });
  //   if (result.error) {
  //     console.error("Error: ", result.error);
  //   }
  // };

  const handlePayment = async () => {
    try {
      const res = await axios.post("/payments/create-checkout-session", {
        products: cart,
        couponCode: coupon ? coupon.code : null,
      });
      console.log("session", res.data);
      window.location.href = res.data.url;
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <motion.div
      className=" space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className=" text-xl font-semibold text-emerald-400">Order Summary</p>
      <div className=" space-y-4">
        <div className=" space-y-2">
          <dl className=" flex items-center  justify-between gap-4">
            <dt className=" text-base font-normal text-gray-300">
              Original Price
            </dt>
            <dt className=" text-base font-medium text-white">
              ${formatedSubtotal}
            </dt>
          </dl>
          {savings === 0 && (
            <dl className=" flex items-center  justify-between gap-4">
              <dt className=" text-base font-normal text-gray-300">Savings</dt>
              <dt className=" text-base font-medium text-white">
                -${formatedSavings}
              </dt>
            </dl>
          )}
          {coupon && isCouponApplied && (
            <dl className=" flex items-center  justify-between gap-4">
              <dt className=" text-base font-normal text-gray-300">
                Coupon ({coupon.code})
              </dt>
              <dt className=" text-base font-medium text-white">
                -{coupon.discountPercentage}%
              </dt>
            </dl>
          )}
          <dl className=" flex items-center  justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className=" text-base font-normal text-gray-300">Total</dt>
            <dt className=" text-base font-medium text-white">
              ${formatedTotal}
              {/* formatedTotal */}
            </dt>
          </dl>
        </div>
        <motion.button
          className=" flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
        >
          Proceed to Checkout
        </motion.button>
        <div className=" flex items-center justify-center gap-2">
          <span className=" text-sm font-normal text-gray-400">or</span>
          <Link
            to={"/"}
            className=" inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
