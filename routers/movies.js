const express = require("express");
const MovieController = require("../controllers/MovieController");
const adminOnly = require("../middlewares/authorization");
const multer = require("multer");

const movieRouter = express.Router();

//! 1. Set multer
const upload = multer({ storage: multer.memoryStorage() });

movieRouter.get("/", MovieController.getMovies);

//! 2. create /now-showing to get nowShowingMovie
movieRouter.get("/now-showing", MovieController.getNowShowingMovie);
movieRouter.post("/", MovieController.createMovie);
movieRouter.delete("/:id", adminOnly, MovieController.deleteMovieById);
movieRouter.get("/:id", MovieController.getMovieById);
movieRouter.put("/:id", MovieController.updateMovieById);
movieRouter.patch(
  "/:id/show-status",
  MovieController.updateMovieShowStatusById,
);

//! 3. Movies endpoints to update cover url (file upload) /movies/:id/cover-url
movieRouter.patch(
  "/:id/cover-url",
  adminOnly,
  upload.single("coverImg"),
  MovieController.updateMovieCoverUrlById,
);

module.exports = movieRouter;
