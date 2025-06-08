import asyncHandler from 'express-async-handler';
import Comment from '../models/commentModel.js';

// @desc    Get comments for an article
// @route   GET /api/comments/:articleId
// @access  Public
export const getComments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const comments = await Comment.find({ article: req.params.articleId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name avatar');

  const total = await Comment.countDocuments({ article: req.params.articleId });

  res.json({
    comments,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Create a comment
// @route   POST /api/comments/:articleId
// @access  Private
export const createComment = asyncHandler(async (req, res) => {
  const { content, rating } = req.body;

  if (!content || !rating) {
    res.status(400);
    throw new Error('Vui lòng nhập nội dung và đánh giá');
  }

  const comment = new Comment({
    user: req.user._id,
    article: req.params.articleId,
    content,
    rating,
  });

  const savedComment = await comment.save();
  const populatedComment = await Comment.findById(savedComment._id).populate('user', 'name avatar');

  res.status(201).json(populatedComment);
});

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Không tìm thấy bình luận');
  }

  // Kiểm tra xem người dùng có phải là người tạo bình luận
  if (comment.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Không có quyền chỉnh sửa bình luận này');
  }

  comment.content = req.body.content || comment.content;
  comment.rating = req.body.rating || comment.rating;

  const updatedComment = await comment.save();
  const populatedComment = await Comment.findById(updatedComment._id).populate('user', 'name avatar');

  res.json(populatedComment);
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Không tìm thấy bình luận');
  }

  // Kiểm tra xem người dùng có phải là người tạo bình luận
  if (comment.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Không có quyền xóa bình luận này');
  }

  await comment.deleteOne();
  res.json({ message: 'Đã xóa bình luận' });
}); 