const mongoose = require('mongoose');
const slug = require('slug');

const Schema = mongoose.Schema;
const ArticleSchema = new Schema({
  slug: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  body: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

ArticleSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.addSlug();
  }
  next();
});

ArticleSchema.methods.addSlug = function () {
  this.slug = slug(this.title) + Math.random().toString(36).substring(7);
};

mongoose.model('Article', ArticleSchema);
