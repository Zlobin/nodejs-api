const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const countSalt = 10;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, 'can\'t be blank'],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: [true, 'can\'t be blank']
  },
  bio: String,
  articles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }]
}, { timestamps: true });

const hash = password => bcrypt.hash(password, countSalt);

UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new).
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await hash(this.password);
  return next();
});

UserSchema.statics.validatePassword = async function (email, candidatePassword) {
  const modelPassword = await this.findOne({ email }, 'password');
  if (!modelPassword) {
    return false;
  }
  const match = await bcrypt.compare(candidatePassword, modelPassword.password);

  return match;
};

mongoose.model('User', UserSchema);
