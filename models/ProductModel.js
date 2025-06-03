import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Sách', 'Tài liệu', 'Khóa học']
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add text index for search functionality
productSchema.index({ name: 'text', description: 'text' });

// Drop any existing indexes related to slug
productSchema.on('index', function(err) {
  if (err) {
    console.error('Index error:', err);
  }
});

const Product = mongoose.model('Product', productSchema);

// Drop the slug index if it exists
Product.collection.dropIndex('slug_1').catch(err => {
  // Ignore error if index doesn't exist
  if (err.code !== 27) {
    console.error('Error dropping index:', err);
  }
});

export default Product; 