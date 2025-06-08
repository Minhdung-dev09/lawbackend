import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'News',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo index để tối ưu truy vấn
commentSchema.index({ article: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment; 