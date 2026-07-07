const mongoose = require('mongoose');
const passportLocalMongooseModule = require('passport-local-mongoose');
const passportLocalMongoose = passportLocalMongooseModule.default || passportLocalMongooseModule;

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      maxlength: 200,
    },
    profilePicture: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Add passport-local-mongoose plugin for password hashing + authentication
UserSchema.plugin(passportLocalMongoose, { usernameField: 'username' });

module.exports = mongoose.model('User', UserSchema);
