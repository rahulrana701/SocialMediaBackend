import mongoose, { Schema, model } from "mongoose";

const UserSchema = new Schema({
  Username: {
    type: String,
    required: true,
    unique: true,
  },

  Email: {
    type: String,
    required: true,
    unique: true,
  },

  Password: {
    type: String,
    required: true,
  },

  Phonenumber: {
    type: Number,
    required: true,
    unique: true,
  },

  Country: {
    type: String,
    required: true,
  },

  ProfilePicture: {
    type: String,
    required: true,
  },

  Followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  Following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  Posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],

  Bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],

  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

const PostSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  Tweet: {
    type: String,
  },

  TweetImage: [
    {
      type: String,
    },
  ],

  Likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  Comments: [
    {
      User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
      },
    },
  ],

  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("UserSocialMediaData", UserSchema);
export const Post = mongoose.model("PostSocialMediaData", PostSchema);
