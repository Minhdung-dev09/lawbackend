import asyncHandler from "../middlewares/asyncHandler.js";
import Cart from "../models/cartModel.js";
import Product from "../models/ProductModel.js";

// Get user's cart
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: "items.product",
    select: "name image price",
  });

  if (!cart) {
    // If cart doesn't exist, create a new empty cart
    const newCart = await Cart.create({
      user: req.user._id,
      items: [],
      totalAmount: 0,
    });
    return res.json(newCart);
  }

  res.json(cart);
});

// Add item to cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Sản phẩm không tồn tại");
  }

  // Find user's cart or create new one
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
      totalAmount: 0,
    });
  }

  // Check if product already in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Update quantity if product exists
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item if product doesn't exist in cart
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }

  // Calculate new total
  cart.calculateTotalAmount();
  await cart.save();

  // Return populated cart
  const updatedCart = await Cart.findById(cart._id).populate({
    path: "items.product",
    select: "name image price",
  });

  res.json(updatedCart);
});

// Update cart item quantity
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (quantity < 1) {
    res.status(400);
    throw new Error("Số lượng phải lớn hơn 0");
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Không tìm thấy giỏ hàng");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    res.status(404);
    throw new Error("Sản phẩm không có trong giỏ hàng");
  }

  cart.items[itemIndex].quantity = quantity;
  cart.calculateTotalAmount();
  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate({
    path: "items.product",
    select: "name image price",
  });

  res.json(updatedCart);
});

// Remove item from cart
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Không tìm thấy giỏ hàng");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  cart.calculateTotalAmount();
  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate({
    path: "items.product",
    select: "name image price",
  });

  res.json(updatedCart);
});

// Clear cart
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Không tìm thấy giỏ hàng");
  }

  cart.items = [];
  cart.totalAmount = 0;
  await cart.save();

  res.json(cart);
});

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
