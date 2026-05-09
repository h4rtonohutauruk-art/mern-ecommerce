import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subTotal: 0,
  isCouponApplied: false,

  clearCart: async () => {
    set({
      cart: [],
      coupon: null,
      total: 0,
      subTotal: 0,
    });
  },

  getMyCoupon: async () => {
    try {
      const res = await axios.get("/coupons");
      set({
        coupon: res.data,
      });
    } catch (error) {
      console.log("Error fetching coupon", error);
    }
  },

  applyCoupon: async (code) => {
    console.log("this code coupon :", code);
    try {
      const response = await axios.post(`/coupons/validate/${code}`);
      console.log("Applied Coupon: ", response.data);
      set({ isCouponApplied: true, coupon: response.data });
      get().calculateTotals();
      console.log();
      toast.success("Coupon applied successfully!");
      console.log("get value state :", get().isCouponApplied);
      console.log("get value state :", get().coupon);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  },

  removeCoupon: () => {
    // console.log("this is removeCoupon :");
    set({
      coupon: null,
      isCouponApplied: false,
    });
    get().calculateTotals();
    toast.success("Coupon removed");
  },

  addToCart: async (product) => {
    try {
      const res = await axios.post("/cart", { productId: product._id });
      console.log("this is res from backend:", res.data);
      toast.success("Product added to cart");
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id,
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        console.log("prevSate: ", prevState);
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      toast.error(error?.ressponse?.data.message || "An error occured");
    }
  },
  getCartProduct: async () => {
    try {
      const res = await axios.get("/cart");
      console.log("this is res :", res);
      set({ cart: res.data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error?.ressponse?.data.message || "An error occured");
    }
  },
  calculateTotals: () => {
    const { cart, coupon } = get();
    const subTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    let total = subTotal;
    if (coupon) {
      const discount = subTotal * (coupon.discountPercentage / 100);
      total = subTotal - discount;
    }
    set({ subTotal, total });
    console.log(`this is total: ${total} && subTotal:${subTotal}`);
  },
  removeAllFromCart: async (product) => {
    const productId = product._id;
    console.log("remove all From Cart with productID :", product._id);
    try {
      const res = await axios.delete("/cart", {
        data: { productId },
      });
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
      console.log("ini adalah res : ", res);
    } catch (error) {
      toast.error(error?.ressponse?.data.message || "An error occured");
    }
  },
  updateQuantity: async (productID, quantity) => {
    // if (quantity === 0) {
    //   get().removeAllFromCart(productID);
    //   return;
    // }
    if (quantity === 0) {
      const product = get().cart.find((item) => item._id === productID);
      if (product) get().removeAllFromCart(product);
      return;
    }
    await axios.put(`/cart/${productID}`, { quantity });
    set((prevState) => ({
      cart: prevState.cart.map((item) =>
        item._id == productID ? { ...item, quantity } : item,
      ),
    }));
    console.log("updatequanatity");
    get().calculateTotals();
  },
}));
