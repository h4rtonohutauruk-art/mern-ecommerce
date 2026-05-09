import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unathorized - No access token provided" });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      //   const user = await User.findById(decoded.userId).select("password");
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Unathorized - Access token expired" });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in protectRoute middleware :", error.message);
    return res
      .status(500)
      .json({ message: "Unathorized - No access token provided" });
  }
};

export const adminRoute = (req, res, next) => {
  //   console.log("adminroutefunction : ", req.user);
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
};
