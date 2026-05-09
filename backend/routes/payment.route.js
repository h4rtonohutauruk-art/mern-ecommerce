import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createCheoutSession,
  checkoutSuccess,
} from "../controllers/payment.controllers.js";

const route = express.Router();

route.post("/create-checkout-session", protectRoute, createCheoutSession);
route.post("/checkout-success", protectRoute, checkoutSuccess);

export default route;
