import Product from "../models/product.model.js";

export const getCartProduct = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id,
      );
      return {
        ...product.toJSON(),
        quantity: item.quantity,
      };
    });

    res.json(cartItems);
  } catch (error) {
    console.error("Error in getCartProduct controller:", error.message);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    console.log("this id sending to backend : ", req);
    const { productId } = req.body;
    const user = req.user;

    const exisitingItem = user.cartItems.find((item) => item.id === productId);
    if (exisitingItem) {
      exisitingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.error("Error in addToCart controller:", error.message);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
export const removeAllFromCart = async (req, res) => {
  try {
    console.log("this id sending to backend : ", req);
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.error("Error in removeAllFromCart controller:", error.message);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const exisitingItem = user.cartItems.find((item) => item.id === productId);

    if (exisitingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save;
        res.json(user.cartItems);
      }

      exisitingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(400).json({
        message: "Product not found",
      });
    }
  } catch (error) {
    console.error("Error in updateQuantity controller:", error.message);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
