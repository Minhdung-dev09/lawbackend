import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true 
    },
    phone: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "cancelled"],
      default: "pending",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
const Consultation = mongoose.model('Consultation', consultationSchema);

export default Consultation;
