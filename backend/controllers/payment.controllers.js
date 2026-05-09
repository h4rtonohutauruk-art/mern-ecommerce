import Coupon from "../models/coupon.model.js";
import { stripe } from "../lib/stripe.js";
import Order from "../models/order.model.js";
import dotenv from "dotenv";

dotenv.config();

// export const createCheoutSession = async (req, res) => {
//   try {
//     const { products, couponCode } = req.body;
//     const user = req.user;
//     console.log("this is user from backend: ", user);

//     console.log("this is req from backend : ", req.body);
//     if (!Array.isArray(products) || products.length === 0) {
//       return res.status(400).json({
//         error: "Invalid or empty products array",
//       });
//     }

//     let totalAmount = 0;

//     const lineItems = products.map((product) => {
//       const amount = Math.round(product.price * 100); //stripe wants u send in the format of cents  => 10$ * 100 = 1000$
//       totalAmount += amount * product.quantity;

//       return {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: product.name,
//             images: product.image ? [product.image] : [],
//           },
//           unit_amount: amount,
//         },
//         quantity: product.quantity || 1,
//       };
//     });

//     let coupon = null;
//     if (couponCode) {
//       coupon = await Coupon.findOne({
//         coupon: couponCode,
//         userId: user._id,
//         isActivate: true,
//       });
//       if (coupon) {
//         totalAmount -= Math.round(
//           (totalAmount * coupon.discountPercentage) / 100,
//         );
//       }
//     }
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: lineItems,
//       mode: "payment",
//       success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
//       discounts: coupon
//         ? [
//             {
//               coupon: await createStripeCoupon(coupon.discountPercentage),
//             },
//           ]
//         : [],
//       metadata: {
//         userId: user._id.toString(),
//         couponCode: couponCode || "",
//         products: JSON.stringify(
//           products.map((p) => ({
//             id: p._id,
//             quantity: p.quantity,
//             price: p.price,
//           })),
//         ),
//       },
//     });
//     //   only user get while spending 20$  = cent converter 20* 1000
//     if (totalAmount >= 20000) {
//       await createNewCoupon(req.user._id);
//     }
//     res.status(200).json({
//       id: session.id,
//       totalAmount: totalAmount / 100,
//     });
//   } catch (error) {
//     console.error(
//       "Error in createCheckoutSession controller : ",
//       error.message,
//     );
//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// export const createCheoutSession = async (req, res) => {
//   try {
//     const { products, couponCode } = req.body;
//     const user = req.user;
//     console.log("this is user from backend", user);

//     if (!Array.isArray(products) || products.length === 0) {
//       return res.status(400).json({
//         error: "Invalid or empty products array",
//       });
//     }

//     let totalAmount = 0;
//     const lineItems = products.map((product) => {
//       const amount = Math.round(product.price * 100); // stripe want u send in the format od cents => 10$ * 100 = 1000$
//       totalAmount += amount * product.quantity;

//       return {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: product.name,
//             images: product.image ? [product.image] : [],
//           },
//           unit_amount: amount,
//         },
//         quantity: product.quantity || 1,
//       };
//     });

//     let coupon = null;
//     if (couponCode) {
//       coupon = await Coupon.findOne({
//         coupon: couponCode,
//         userId: user._id,
//         isActivate: true,
//       });
//       if (coupon) {
//         totalAmount -=
//           Math.round(totalAmount * coupon.discountPercentage) / 100;
//       }
//     }

//     // create Session
//     console.log("create session");
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: lineItems,
//       mode: "payment",
//       success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
//       // success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
//       // cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
//       discounts: coupon
//         ? [
//             {
//               coupon: await createStripeCoupon(coupon.discountPercentage),
//             },
//           ]
//         : [],
//       metadata: {
//         userId: user._id.toString(),
//         couponCode: couponCode || "",
//         products: JSON.stringify(
//           products.map((p) => ({
//             id: p._id,
//             quantity: p.quantity,
//             price: p.price,
//           })),
//         ),
//       },
//     });
//     if (totalAmount >= 20000) {
//       await createNewCoupon(req.user._id);
//     }
//     res.status(200).json({
//       id: session.id,
//       totalAmount: totalAmount / 100,
//     });
//   } catch (error) {
//     console.error(
//       "Error in createCheckoutSession controller : ",
//       error.message,
//     );
//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };
export const createCheoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;
    console.log("dapat couponCode dari construct object", couponCode);
    const user = req.user;
    console.log("dapat couponCode dari construct object", user._id.toString());
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "Invalid or empty products array",
      });
    }

    let totalAmount = 0;

    const lineItems = products.map((product) => {
      if (!product.price || !product.quantity) {
        throw new Error("Invalid product data");
      }

      const amount = Math.round(product.price * 100);
      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : [],
          },
          unit_amount: amount,
        },
        quantity: product.quantity,
      };
    });

    // 🎟️ HANDLE COUPON
    let coupon = null;

    // if (couponCode) {
    //   const coupon = await Coupon.findOne({
    //     coupon: couponCode,
    //     userId: user._id,
    //     isActivate: true,
    //   });

    //   if (coupon) {
    //     stripeCoupon = await createStripeCoupon(coupon.discountPercentage);
    //     console.log("This is stripecoupon:", stripeCoupon);
    //   }
    // }

    if (couponCode) {
      let id_user = user._id.toString();
      coupon = await Coupon.findOne({
        code: couponCode,
        isActive: true,
        userId: id_user,
      });

      if (coupon) {
        totalAmount -=
          Math.round(totalAmount * coupon.discountPercentage) / 100;
      }

      console.log(`ini couponnya ${coupon}`);
      console.log(`ini totalAmount ${totalAmount}`);
    }

    // 💳 CREATE SESSION (UPDATED FLOW)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,

      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,

      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],

      metadata: {
        userId: user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          })),
        ),
      },
    });

    console.log("check session checkout : ", session);

    // console.log("ini metadata dari checkout-payment: ", session.metadata);

    // 🎁 BONUS COUPON
    if (totalAmount >= 20000) {
      await createNewCoupon(user._id);
    }

    // ✅ IMPORTANT: RETURN URL (NOT ID)
    res.status(200).json({
      url: session.url,
      id: session.id,
      totalAmount: totalAmount / 100,
    });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    console.log("ini dari checkout-success controller:", req.body);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const existingOrder = await Order.findOne({
      stripeSessionId: sessionId,
    });

    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Order already processed",
        orderId: existingOrder._id,
      });
    }
    console.log("SESSION METADATA:", session.metadata);
    if (session.payment_status === "paid") {
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            coupon: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          {
            isActivate: false,
          },
        );
      }
      //   create a new order
      const products = JSON.parse(session.metadata.products || []);
      if (!products.length)
        throw new Error("Products metadata is empty or invalid");

      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100, //convert cent to dollar
        stripeSessionId: sessionId,
      });
      await newOrder.save();
      res.status(200).json({
        success: true,
        message:
          "Payment successful, order created, and coupon deactivated if used.",
        orderId: newOrder.id,
      });
    }
  } catch (error) {
    console.error("Error processing successful checkout: ", error.message);
    res.status(500).json({
      message: "Error processing successful checkout",
      error: error.message,
    });
  }
};
async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  console.log("createStripeCoupon : ", coupon.id);
  return coupon.id;
}

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId: userId });
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30 days from now
    userId: userId,
  });
  await newCoupon.save();
  //

  return newCoupon;
}
