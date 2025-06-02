import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
      enum: ["hinh-su", "dan-su", "hon-nhan-gia-dinh", "doanh-nghiep", "lao-dong", "dat-dai"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [{
      type: String
    }],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Create indexes for better search performance
newsSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

// Add a method to increment view count
newsSchema.methods.incrementViewCount = async function() {
  this.views += 1;
  return this.save();
};

const News = mongoose.model('News', newsSchema);

export default News; 