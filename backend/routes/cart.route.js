import express, { Router } from "express";
import {
  addToCart,
  removeAllFromCart,
  getCartProduct,
  updateQuantity,
} from "../controllers/cart.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const route = express.Router();

route.get("/", protectRoute, getCartProduct);
route.post("/", protectRoute, addToCart);
route.delete("/", protectRoute, removeAllFromCart);
route.put("/:id", protectRoute, updateQuantity);

export default route;
