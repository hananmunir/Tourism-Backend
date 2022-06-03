//Required Modules
import mongoose from "mongoose";
import Package from "../Models/package.js";
import fs from "fs";
import util from "util";
import { uploadFile, getFileStream, deleteFile } from "../Services/s3.js";
import { createError } from "../utils/error.js";

const unlinkFile = util.promisify(fs.unlink);

//Uses ID to download images from s3 bucket
export const getImage = async (req, res, next) => {
  const key = req.params.id;

  //if key no provided
  if (key == "undefined") return next(createError(404, "Image not found"));

  //download image and render it
  try {
    const readStream = getFileStream(key);
    readStream
      .on("error", (err) => {
        next(createError(404, "Image not found"));
      })
      .pipe(res);
  } catch (error) {
    next(error);
  }
};

//get a single post
export const getPost = async (req, res, next) => {
  //destructure id from paramaters
  const { id } = req.params;

  try {
    //check if post exists
    if (!mongoose.Types.ObjectId.isValid(id))
      return next(createError(404, "Object not found"));

    //get post using the id
    const post = await Package.findById(id);

    if (!post) return next(createError(404, "Object not found"));

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// get all posts
export const getPosts = async (req, res, next) => {
  const pages = Number(req.query.pages ? req.query.pages : 1);
  const perPage = Number(req.query.perPage ? req.query.perPage : 6);
  const skipRecords = Number((pages - 1) * perPage);

  try {
    const post = await Package.find().skip(skipRecords).limit(perPage);
    const total = await Package.countDocuments();

    res.status(200).json({ packages: post, totalPackages: total });
  } catch (error) {
    next(error);
  }
};

// create a new post
export const createPost = async (req, res, next) => {
  //get required fields from body
  const { title, description, cost, departureDate, duration, destination } =
    req.body;

  try {
    //upload image to s3
    let result = await uploadFile(req.file);

    //deletes the file from local storage
    await unlinkFile(req.file.path);

    //create new post object
    const newPost = new Package({
      title,
      destination,
      cost,
      image: result.Key,
      description,
      departureDate,
      duration,
    });

    //save object in database
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

//update an existing post
export const updatePost = async (req, res, next) => {
  //get id from parametes and post data from body

  const { id } = req.params;
  const post = req.body;
  const file = req.file;
  console.log(post);
  try {
    const olderPost = await Package.findById(id);
    //check if post exist
    if (!mongoose.Types.ObjectId.isValid(id))
      return next(createError(404, "Object not found"));

    //upload file and add attribute if file exists
    file
      ? await uploadFile(file).then((result) => (post.image = result.Key))
      : null;

    //update the post
    const updatedPost = await Package.findByIdAndUpdate(
      id,
      { id, ...post },
      { new: true }
    );

    if (file) {
      //deletes the file from local storage
      await unlinkFile(req.file.path);
      //deletes the file from s3
      deleteFile(olderPost.image);
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

//delete a post using id
export const deletePost = async (req, res, next) => {
  console.log("Deleting");
  const { id } = req.params;
  try {
    //check if post exists
    if (!mongoose.Types.ObjectId.isValid(id))
      return next(createError(404, "Object not found"));

    //to delete image from S3 bucket
    const post = await Package.findById(id);

    deleteFile(post.image);

    //delete post
    await post.remove();

    res.status(200).json(post._id);
  } catch (error) {
    next(error);
  }
};
