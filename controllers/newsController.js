import News from "../models/newsModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Get all news
const getAllNews = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const query = {};

  if (category && category !== "all") {
    query.category = category;
  }

  if (search) {
    query.$text = { $search: search };
  }

  const news = await News.find(query)
    .populate("author", "username")
    .sort({ createdAt: -1 });

  res.json(news);
});

// Get single news by ID
const getNewsById = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id).populate("author", "username");
  
  if (news) {
    await news.incrementViewCount();
    res.json(news);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy tin tức");
  }
});

// Create new news (Admin only)
const createNews = asyncHandler(async (req, res) => {
  const { title, excerpt, content, image, category, tags } = req.body;

  if (!title || !content || !excerpt || !category) {
    res.status(400);
    throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
  }

  const news = new News({
    title,
    excerpt,
    content,
    image: image || "",
    category,
    tags: tags || [],
    author: req.user._id,
  });

  const createdNews = await news.save();
  res.status(201).json(createdNews);
});

// Update news (Admin only)
const updateNews = asyncHandler(async (req, res) => {
  const { title, excerpt, content, image, category, tags, isPublished } = req.body;

  const news = await News.findById(req.params.id);

  if (news) {
    news.title = title || news.title;
    news.excerpt = excerpt || news.excerpt;
    news.content = content || news.content;
    news.image = image || news.image;
    news.category = category || news.category;
    news.tags = tags || news.tags;
    news.isPublished = isPublished !== undefined ? isPublished : news.isPublished;

    const updatedNews = await news.save();
    res.json(updatedNews);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy tin tức");
  }
});

// Delete news (Admin only)
const deleteNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);

  if (news) {
    await News.deleteOne({ _id: news._id });
    res.json({ message: "Xóa tin tức thành công" });
  } else {
    res.status(404);
    throw new Error("Không tìm thấy tin tức");
  }
});

// Get top 5 most viewed news
const getTopViewedNews = asyncHandler(async (req, res) => {
  const news = await News.find({ isPublished: true })
    .populate("author", "username")
    .sort({ viewCount: -1 })
    .limit(5);

  res.json(news);
});

// Get latest news
const getLatestNews = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  
  const news = await News.find({ isPublished: true })
    .populate("author", "username")
    .sort({ createdAt: -1 })
    .limit(limit);

  res.json(news);
});

export {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getTopViewedNews,
  getLatestNews,
}; 