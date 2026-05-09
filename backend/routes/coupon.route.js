import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getCoupon,
  validateCoupon,
} from "../controllers/coupon.controllers.js";

const route = express.Router();

route.get("/", protectRoute, getCoupon);
route.post("/validate/:code", protectRoute, validateCoupon);

export default route;
