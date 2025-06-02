import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  console.log('Auth Headers:', req.headers.authorization); // Debug log

  // Check for token in Authorization header
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token found:', token); // Debug log

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); // Debug log

      // Get user from token - check both id and userId
      const userId = decoded.userId || decoded.id;
      console.log('Using userId:', userId); // Debug log

      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        console.log('User not found for id:', userId);
        res.status(401);
        throw new Error('User not found');
      }

      console.log('User found:', user.email, 'isAdmin:', user.isAdmin); // Debug log
      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    // Check for token in cookies as fallback
    token = req.cookies?.jwt;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId || decoded.id;
        req.user = await User.findById(userId).select('-password');
        next();
      } catch (error) {
        console.error('Cookie token verification error:', error);
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    } else {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  }
});

//  check if user is admin

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    console.log('Admin access granted for:', req.user.email); // Debug log
    next();
  } else {
    console.log('Admin access denied for user:', req.user?.email); // Debug log
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };
