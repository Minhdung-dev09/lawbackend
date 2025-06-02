import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    
    image: {
      type: String,
      required: false,
    },
    
    email: {
      type: String,
      required: true,
      unique: true,
    },
    
    phone: {
      type: String,
      required: false,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
