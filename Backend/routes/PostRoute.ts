import express from "express";
const router = express.Router();
import {
  createPost,
  getallposts,
  UserPosts,
  editPost,
  deletePost,
  likePost,
  commentPost,
  specificUserPosts,
  followingPost,
  bookmarks
} from "../controllers/PostController";

router.route("/createPost").post(createPost);
router.route("/getallposts").get(getallposts);
router.route("/UserPosts").get(UserPosts);
router.route("/Edit/:PostId").patch(editPost);
router.route("/Delete/:PostId").delete(deletePost);
router.route("/Like/:PostId").patch(likePost);
router.route("/comment/:PostId").patch(commentPost);
router.route("/followingPost").get(followingPost);
router.route('specificPost').get(specificUserPosts);
router.route('/bookmarkPost/:PostId').post(bookmarks);
export default router;
