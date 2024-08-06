import { Post, User } from "../../packages/db/src/models";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import mongoose from "mongoose";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const jwtsecret = process.env.DB_JWTSECRET || "default_secret";

// -----------------------------SIGN UP ------------------------------------------------------
export const SignupLogic = async (req: Request, res: Response) => {
  const data = req.body;
  const { Username, Email, Password, Phonenumber, Country, ProfilePicture } =
    data;

  if (!Username || !Email || !Password || !Phonenumber || !Country) {
    res
      .status(403)
      .json({ success: "false", message: "Please Enter all the fields" });
    return;
  }

  const ExistingUser = await User.findOne({ Username, Email });
  if (ExistingUser) {
    res.status(403).json({ success: "false", message: "User already Exisits" });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const newpassword = await bcrypt.hash(Password, salt);

  const tempUser = {
    Username,
    Email,
    newpassword,
    Phonenumber,
    Country,
    ProfilePicture,
  };
  const UserCreated = await User.create({ ...tempUser });
  if (!UserCreated) {
    res.status(403).json({ success: "false", message: "some error occured" });
    return;
  }
  const token = Jwt.sign(
    { UserId: UserCreated._id, name: UserCreated.Username },
    jwtsecret,
    { expiresIn: "2hr" }
  );
  res
    .status(200)
    .json({ success: "true", message: "Signed Up Successfully", token });
};

// -----------------------LOGIN-----------------------------------------------------------------

export const LoginLogic = async (req: Request, res: Response) => {
  const data = req.body;
  const { Username, Email, Password } = data;
  if (!Username || !Email || !Password) {
    res
      .status(403)
      .json({ success: "false", message: "Please enter all the fields" });
    return;
  }
  const CheckUser = await User.findOne({ Username, Email });

  if (!CheckUser) {
    res.status(403).json({ success: "false", message: "User Does not Exist" });
    return;
  }

  const pass = await bcrypt.compare(Password, CheckUser.Password);
  if (!pass) {
    res
      .status(200)
      .json({ success: "false", message: "please enter the correct password" });
    return;
  }

  const token = Jwt.sign({ UserId: CheckUser._id }, jwtsecret, {
    expiresIn: "2hr",
  });
  res
    .status(200)
    .json({ success: "true", message: "Logged In Successfully", token });
};

//---------------------------------- GET ALL USERS -----------------------------------------

export const allUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  if (!users) {
    res.status(403).json({ success: "false", message: "no users existed" });
    return;
  }
  res
    .status(200)
    .json({ success: "false", message: "Users Found Successfully", users });
};

// ------------------------------ FOLLOWING ----------------------------------------------

export const follow = async (req: Request, res: Response) => {
  const { FollowingUserId } = req.params;
  const UserId = req.headers["UserId"];

  // DON'T FOLLOW YOURSELF
  const otherUser = await User.findById({ _id: FollowingUserId });
  const currentUser = await User.findById({ _id: UserId });
  if (otherUser?._id.toString() == currentUser?._id.toString()) {
    res
      .status(403)
      .json({ success: "false", message: "you cannot follow yourself" });
    return;
  }

  // Convert string to ObjectId
  const followingUserIdObj = new mongoose.Types.ObjectId(FollowingUserId);

  // CHECK IF YOU ALREADY FOLLOWED THE USER
  if (currentUser?.Following.includes(followingUserIdObj)) {
    res
      .status(403)
      .json({ success: "false", message: "User already followed" });
    return;
  }

  const FollowingList = await User.findByIdAndUpdate(
    { _id: UserId },
    { $push: { Following: FollowingUserId } },
    { new: true }
  );

  const FollowerList = await User.findByIdAndUpdate(
    { _id: FollowingUserId },
    { $push: { Followers: UserId } },
    { new: true }
  );

  if (!FollowerList) {
    res
      .status(403)
      .json({ success: "false", message: 'Task couldn"t be completed' });
    return;
  }

  if (!FollowingList) {
    res
      .status(403)
      .json({ success: "false", message: 'Task couldn"t be completed' });
    return;
  }

  res.json({
    success: "true",
    message: "followed successfully",
    FollowingList,
  });
};

// -------------------------------- UNFOLLOW -----------------------------------------------

export const Unfollow = async (req: Request, res: Response) => {
  const { unfollowUserId } = req.params;
  const UserId = req.headers["UserId"];

  const dataAfterUnfollowing = await User.findByIdAndUpdate(
    { _id: UserId },
    { $pull: { Following: unfollowUserId } },
    { new: true }
  );

  const dataAfterUnfollowing2 = await User.findByIdAndUpdate(
    { _id: unfollowUserId },
    { $pull: { Followers: UserId } },
    { new: true }
  );

  if (!dataAfterUnfollowing) {
    res
      .status(403)
      .json({ success: "false", message: "task could not be completed" });
    return;
  }

  if (!dataAfterUnfollowing2) {
    res
      .status(403)
      .json({ success: "false", message: "task could not be completed" });
    return;
  }
  res.status(200).json({
    success: "true",
    message: "user unfollowed successfully",
    dataAfterUnfollowing,
    dataAfterUnfollowing2,
  });
};

// --------------------------------- GET OTHER USERS DATA ---------------------------------

export const getspecificUserdata = async (req: Request, res: Response) => {
  const otherUserId = req.params;
  const otheruserdata = await User.findById({ _id: otherUserId });
  if (!otheruserdata) {
    res.status(403).json({ success: "false", message: "could not found user" });
    return;
  }
  res
    .status(200)
    .json({ success: "true", message: "user found", otheruserdata });
};

// ------------------------------------ DELETE USER ------------------------------------------

export const deleteUser = async (req: Request, res: Response) => {
  const UserId = req.headers["UserId"];
  const deleteUser = await User.findByIdAndDelete({ _id: UserId });
  if (deleteUser) {
    res.status(403).json({ success: "false", message: "User not found" });
    return;
  }
  res.status(200).json({success:'true',message:'User deleted Successfully'});
};

// -------------------------------- BOOKMARKED POSTS -----------------------------------------

export const bookmarkedPosts= async(req:Request,res:Response)=>{
  const UserId = req.headers['UserId'];
  const user = await User.findOne({_id:UserId});
  if (!user) {
    res.status(403).json({ success: "false", message: "User not found" });
    return;
  }
  const posts = user.Bookmarks;
  const bookmarkedPosts = posts.map((p)=>p._id);
  const allposts = await Post.find({_id:{$in:bookmarkedPosts}});
  if (!allposts) {
    res.status(403).json({ success: "false", message: "No Bookmarks To Be Found" });
    return;
  }
  res.status(200).json({success:true,allposts});
}

// --------------------------------------------------------------------------------------
