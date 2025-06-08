import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import { sendOrderConfirmationEmail } from "../utils/emailService.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { customerInfo, paymentMethod } = req.body;
    const userId = req.user._id;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Create order items from cart items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      image: item.product.image
    }));

    // Calculate total amount
    const totalAmount = cart.items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );

    // Create new order
    const order = new Order({
      user: userId,
      items: orderItems,
      customerInfo,
      totalAmount,
      paymentMethod
    });

    await order.save();

    // Clear the cart after order is created
    await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [], totalAmount: 0 } }
    );

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(customerInfo.email, {
        orderNumber: order._id,
        customerName: customerInfo.fullName,
        items: orderItems,
        totalAmount,
        shippingAddress: `${customerInfo.address}, ${customerInfo.city}`
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      message: "Order created successfully",
      order: {
        id: order._id,
        items: order.items,
        totalAmount: order.totalAmount,
        customerInfo: order.customerInfo,
        status: order.status,
        date: order.createdAt
      }
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product");

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get single order
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
}; 