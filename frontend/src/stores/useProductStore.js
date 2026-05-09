import axios from "../lib/axios.js";
import toast from "react-hot-toast";
import { create } from "zustand";
export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  setProducts: (products) => set({ products }),
  createProduct: async (productData) => {
    try {
      set({ loading: true });
      const res = await axios.post("/products", productData);
      console.log("ini res nya :", res);
      toast.success("Created New Product");
    } catch (error) {
      toast.error(error?.response?.data?.error);
      console.log("Error in createProduct:", error);
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (productId) => {
    try {
      const res = await axios.delete(`/products/${productId}`);
      set((prevProducts) => ({
        products: prevProducts.products.filter(
          (product) => product._id !== productId,
        ),
        loading: false,
      }));
      console.log("ini res nya :", res);
      toast.success("Product delete successfully!");
    } catch (error) {
      set({ loading: false });
      console.log("error in deleteProduct:", error);
      toast.error(error?.response?.data?.error || "Failed to delete product");
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");
      set({ products: res.data.products, loading: false });
      // console.log("this is product coming from useproductstore:", res);
    } catch (error) {
      set({ error: "failed to fetch products", loading: false });
      console.log("error in showAllProduct:", error);
    }
  },

  fetchProductsByCategory: async (category) => {
    // console.log("ini category", category);
    set({ loading: true });
    try {
      const res = await axios.get(`/products/category/${category}`);
      // console.log("ini category", category);
      // console.log("ini resnya", res);
      set({ products: res.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error?.response?.data?.error || "Failed to fetch products");
    }
  },

  toogleFeatureProduct: async (productId) => {
    set({ loading: true });
    try {
      const res = await axios.patch(`/products/${productId}`);
      // this will update the isFeatured prop of product
      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === productId
            ? {
                ...product,
                isFeatured: res.data.isFeatured,
              }
            : product,
        ),
        loading: false,
      }));
      console.log("ini resnya:", res);
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.error || "Failed to update product");
    }
  },

  fetchFeaturedProducts: async () => {
    set({
      loading: true,
    });
    try {
      console.log("this is fetching Featured Product : ");
      const res = await axios.get("/products/featured");
      console.log("this is fetching Featured Product : ", res.data);
      set({
        products: res.data,
        loading: false,
      });
    } catch (error) {
      set({
        error: "Failed to fetch products",
        loading: false,
      });
      console.log("error fetching featured products", error);
    }
  },
}));
