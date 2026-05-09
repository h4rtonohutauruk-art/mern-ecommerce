import express from "express";
import {
  getAllProducts,
  getFeaturedProduct,
  createProduct,
  deleteProduct,
  getRecomendedProducts,
  getProdutcsByCategory,
  toggleFeaturedProduct,
} from "../controllers/product.controllers.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProduct);
router.get("/category/:category", getProdutcsByCategory);
router.get("/recomendations", getRecomendedProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
