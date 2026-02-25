const { Movie } = require("../models");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");

// init cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class MovieController {
  static async getMovies(req, res, next) {
    try {
      const movies = await Movie.findAll();
      res.json(movies);
    } catch (err) {
      // res.status(500).json({ message: "Internal Server Error" });
      next(err);
    }
  }

  static async getMovieById(req, res, next) {
    try {
      const { id } = req.params;
      const movie = await Movie.findByPk(id);

      if (!movie) throw { name: "NotFound", message: "Movie Not Found" };

      res.status(200).json(movie);
    } catch (error) {
      // if (error.name === 'NotFound') {
      //     res.status(404).json({message : error.message})
      // }
      // if (error.name === 'SequelizeValidationError') {
      //     res.status(400).json({message : error.errors[0].message})
      // }
      // res.status(500).json({message : 'Internal Server Error'})
      next(error);
    }
  }

  //! Add new controller for getNowShowingMovie
  static async getNowShowingMovie(req, res, next) {
    try {
      //! 1. fetch get https://api.themoviedb.org/3/movie/now_playing using authorization 'Bearer'
      const response = await axios({
        method: "get",
        url: "https://api.themoviedb.org/3/movie/now_playing",
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      });

      //! 2. looping to get specific object tmdbId, title, synopsis, releaseDate, coverUrl(https://image.tmdb.org/t/p/w500 + poster_path), rating
      const nowShowing = response.data.results.map((m) => {
        return {
          tmdbId: m.id,
          title: m.title,
          synopsis: m.overview,
          releaseDate: m.release_date,
          coverUrl: "https://image.tmdb.org/t/p/w500" + m.poster_path,
          rating: m.vote_average,
        };
      });

      //! 3. response 200 json nowShowing
      res.status(200).json(nowShowing);
    } catch (error) {
      next(error);
    }
  }

  static async createMovie(req, res, next) {
    try {
      //! 1. copy ...req.body ke newBody
      const newBody = { ...req.body };

      //! 2. didapatkan dari user yg lg login
      //! bisa cek middleware authentication
      newBody.authorId = req.user.id;

      //! 3. create dengan newBody
      const movie = await Movie.create(newBody);
      res.status(201).json(movie);
    } catch (err) {
      // if (err.name === 'SequelizeValidationError') {
      //   res.status(400).json({ message: err.errors[0].message });
      // } else {
      //   res.status(500).json({ message: "Internal Server Error" });
      // }
      next(err);
    }
  }

  static async deleteMovieById(req, res, next) {
    try {
      const movieId = +req.params.id;
      const movie = await Movie.findByPk(movieId);
      if (!movie) {
        res.status(404).json({ message: `Movie id ${movieId} not found` });
        return;
      }

      await movie.destroy();
      res.json({ message: `Movie id ${movieId} has been deleted` });
    } catch (err) {
      // res.status(500).json({ message: "Internal Server Error" });
      next(err);
    }
  }

  static async updateMovieById(req, res, next) {
    try {
      const movieId = +req.params.id;
      const movie = await Movie.findByPk(movieId);
      if (!movie) {
        res.status(404).json({ message: `Movie id ${movieId} not found` });
        return;
      }

      await movie.update(req.body);
      res.json(movie);
    } catch (err) {
      // if (err.name === 'SequelizeValidationError') {
      //   res.status(400).json({ message: err.errors[0].message });
      // } else {
      //   res.status(500).json({ message: "Internal Server Error" });
      // }
      next(err);
    }
  }

  static async updateMovieShowStatusById(req, res, next) {
    try {
      const movieId = +req.params.id;
      const movie = await Movie.findByPk(movieId);
      if (!movie) {
        res.status(404).json({ message: `Movie id ${movieId} not found` });
        return;
      }

      await movie.update({ isShowing: !movie.isShowing });
      res.json(movie);
    } catch (err) {
      // if (err.name === 'SequelizeValidationError') {
      //   res.status(400).json({ message: err.errors[0].message });
      // } else {
      //   res.status(500).json({ message: "Internal Server Error" });
      // }
      next(err);
    }
  }

  //! Add new controller for updateMovieCoverUrlById
  static async updateMovieCoverUrlById(req, res, next) {
    try {
      //! 1. get id from req.params
      const movieId = +req.params.id;

      //! 2. get movie using findByPk by req.params.id
      const movie = await Movie.findByPk(movieId);

      //! 2a. cek apabila movie tidak ditemukan (NotFound)
      if (!movie) {
        throw { name: "NotFound", message: `Movie id ${movieId} not found` };
      }

      //! 3. cek apabila req.file tidak ditemukan (BadRequest)
      if (!req.file) {
        throw { name: "BadRequest", message: "Cover Image is required" };
      }

      //! 4. konversi gambar ke text base64 (req.file.buffer.toString("base64"))
      const base64Img = req.file.buffer.toString("base64");

      //! 5. bikin data url yg benar -> data:[<media-type>][;base64],<data>
      const base64DataUri = `data:${req.file.mimetype};base64,${base64Img}`;

      //! 6. upload ke cloudinary
      const result = await cloudinary.uploader.upload(base64DataUri);

      //! 7. update coverUrl ke db
      await movie.update({ coverUrl: result.secure_url });

      //! 8. res status with message : `Movie ${movie.title} cover url has been updated`
      res.status(200).json({
        message: `Movie ${movie.title} cover url has been updated`,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MovieController;
