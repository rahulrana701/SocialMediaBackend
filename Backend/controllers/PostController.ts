import { Post, User } from "../../packages/db/src/models";
import { Request, Response } from "express";

// ---------------------------- CREATE POST -------------------------------------------------

export const createPost = async (req: Request, res: Response) => {
  const UserId = req.headers["UserId"];
  const data = req.body;
  const { Tweet, TweetImage } = data;

  const createdPost = await Post.create({ owner: UserId, Tweet, TweetImage });
  if (!createdPost) {
    res
      .status(403)
      .json({ success: "false", message: "post could not be created" });
    return;
  }
  res.status(200).json({
    success: "true",
    message: "post created successfully ",
    createdPost,
  });
};

// ------------------------ ALL POSTS -------------------------------------------------------

export const getallposts = async (req: Request, res: Response) => {
  const posts = await Post.find();
  if (!posts) {
    res.status(403).json({ success: "false", message: "no posts to be found" });
  }
  res
    .status(200)
    .json({ success: "false", message: "Post Found Successfully", posts });
};

// -------------------- SPECIFIC USER POSTS-------------------------------------------------

export const UserPosts = async (req: Request, res: Response) => {
  const UserId = req.headers["UserId"];
  const Userposts = await Post.find({ owner: UserId });

  if (!Userposts) {
    res.status(403).json({
      success: "false",
      message: " There are no posts associated with the user",
    });
  }

  res
    .status(200)
    .json({ success: "true", message: "Post Found Successfully", Userposts });
};

// ------------------------EDIT POST----------------------------------------------------------

export const editPost = async (req: Request, res: Response) => {
  const UserId = req.headers["UserId"];
  const { PostId } = req.params;
  const data = req.body;
  const { Tweet, TweetImage } = data;

  const EditPost = await Post.findByIdAndUpdate(
    { _id: PostId, owner: UserId },
    { Tweet, TweetImage },
    { new: true }
  );
  if (!EditPost) {
    res.status(403).json({
      success: "false",
      message: "Post Couldn't Be Edited",
    });
  }

  res
    .status(200)
    .json({ success: "true", message: "Post Edited Successfully", EditPost });
};

// -------------------------------------DELETE POST------------------------------------------

export const deletePost = async (req: Request, res: Response) => {
  const UserId = req.headers["UserId"];
  const { PostId } = req.params;

  const DeletedPost = await Post.findByIdAndDelete({
    _id: PostId,
    owner: UserId,
  });

  if (!DeletedPost) {
    res.status(403).json({
      success: "false",
      message: "Post Couldn't be deleted",
    });
  }
  res
    .status(200)
    .json({ success: "true", message: "Post Deleted Successfully" });
};

// --------------------------------- LIKE POST ----------------------------------------------

export const likePost = async (req: Request, res: Response) => {
  const { PostId } = req.params;
  const UserId = req.headers["UserId"];

  const likedpost = await Post.findByIdAndUpdate(
    { _id: PostId },
    { $push: { Likes: UserId } },
    { new: true }
  );

  if (!likedpost) {
    res
      .status(403)
      .json({ success: "false", message: "post could not be found" });
  }

  res
    .status(200)
    .json({ success: "true", message: "Post Like successfully", likedpost });
};

// ---------------------------------- COMMENTS----------------------------------------------

export const commentPost = async (req: Request, res: Response) => {
  const { PostId } = req.params;
  const UserId = req.headers;
  const commentText = req.body;
  const commentonPost = await Post.findByIdAndUpdate(
    { _id: PostId },
    { $push: { Comments: { User: UserId, comment: commentText } } }
  );
  if (!commentonPost) {
    res
      .status(403)
      .json({ success: "false", message: 'Post Couldn"t be found' });
  }
  res.status(200).json({
    success: "true",
    message: "commented successfully",
    commentonPost,
  });
};

// -------------------------------  FOLLOWING POST -----------------------------------------
// SYNTAX TO USE $IN 
// db.collection.find({
//   field: { $in: [value1, value2, ...] }
// })

export const followingPost = async (req: Request, res: Response) => {
  const UserId = req.headers["UserId"];
  const currentuser = await User.findOne({ _id: UserId });
  if (!currentuser) {
    res
      .status(403)
      .json({ success: false, message: "No User Found" });
      return;
  }
  const followingData = currentuser.Following;
  const followingId = followingData.map((user) => user._id);
  const followingPosts = await Post.find({ owner: { $in: followingId } });
  if (!followingPosts) {
    res
      .status(403)
      .json({ success: false, message: "Following have no Posts" });
      return;
  }

  res.status(200).json({success:'true',followingPosts});
};

// ------------------------------ SPECIFIC USER POSTS --------------------------------------

export const specificUserPosts = async (req: Request, res: Response) => {
  const { UserId } = req.params;
  const specificUserPost = await Post.find({ owner: UserId });
  if (!specificUserPost) {
    res.status(403).json({ success: false, message: "No Post To Be Found" });
    return;
  }
  res.status(200).json({ success: true, specificUserPost });
};


//------------------------------ BOOKMARKS --------------------------------------------------

export const bookmarks = async(req:Request,res:Response)=>{
  const {PostId}= req.params;
  const UserId= req.headers['UserId'];

  const PostbyId= await Post.findById({_id:PostId});
  if (!PostbyId) {
    res.status(403).json({ success: false, message: "No Post To Be Found" });
    return;
  }
  const bookmarkedPost= await User.findByIdAndUpdate({_id:UserId},{$push:{Bookmarks:PostId}});
  if (!bookmarkedPost) {
    res.status(403).json({ success: false, message: "Could not bookmark the Post" });
    return;
  }

  res.status(200).json({success:true,message:'Post Bookmarked Successfully'});
}

// -------------------------------------------------------------------------------------------