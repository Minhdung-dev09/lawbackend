import Consultation from "../models/consultationModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
// User gửi yêu cầu
const createConsultation = asyncHandler(async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    if (!fullName || !email || !phone || !subject || !message) {
      return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin." });
    }

    const consultation = new Consultation({
      user: req.user._id,
      fullName,
      email,
      phone,
      subject,
      message,
    });

    await consultation.save();
    res.status(201).json({ message: "Gửi yêu cầu tư vấn thành công.", consultation });
  } catch (err) {
    console.error("LỖI:", err); // ✅ Thêm dòng này
    res.status(500).json({ error: "Gửi yêu cầu tư vấn thất bại." });
    console.log("User gửi yêu cầu tư vấn:", req.user);
  }
});

// Admin xem tất cả yêu cầu
const getAllConsultations = asyncHandler(async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};

    if (email) {
      const user = await User.findOne({ email });
      if (user) {
        query.user = user._id;
      } else {
        return res.json([]); // Không tìm thấy user theo email
      }
    }

    const consultations = await Consultation.find(query).populate("user", "email fullName");
    res.json(consultations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Không lấy được danh sách yêu cầu tư vấn." });
  }
});

// Admin cập nhật trạng thái
const updateStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const updated = await Consultation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Không thể cập nhật trạng thái." });
  }
});

// Người dùng xem lịch sử tư vấn của mình
const getMyConsultations = asyncHandler(async (req, res) => {
  try {
    const myConsultations = await Consultation.find({ user: req.user._id });
    res.json(myConsultations);
  } catch (err) {
    res.status(500).json({ error: "Không thể lấy lịch sử tư vấn." });
  }
});

export {
  createConsultation,
  getAllConsultations,
  updateStatus,
  getMyConsultations,
};