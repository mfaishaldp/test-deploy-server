const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");

class UserController {
  static async register(req, res, next) {
    try {
      //! 1. destruct email & password dari req.body
      const { email, password } = req.body;

      //! 2. create user (implement hashPassword di hooks beforeCreate user model - dg package "bcryptjs" - letakan pada helpers)
      const data = await User.create({
        email: email,
        password: password,
      });

      //! 3. handle hapus password, sebelum di kirim (.toJSON -> delete result.password)
      const result = data.toJSON();
      delete result.password;

      //! 4. kirim response status n payload
      res.status(201).json(result);
    } catch (error) {
      //! error handler untuk validation dan unique email dari models
      //   if (
      //     error.name === "SequelizeValidationError" ||
      //     error.name === "SequelizeUniqueConstraintError"
      //   ) {
      //     res.status(400).json({ message: error.errors[0].message });
      //   }
      //! error handler untuk Internal Server Error
      //   res.status(500).json({ message: "Internal Server Error" });

      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      //! 1. destruct email & password dari req.body
      const { email, password } = req.body;

      //! 2a. Check apakah ada email
      if (!email) {
        throw { name: "BadRequest", message: "Email is required" };
      }
      //! 2b. Check apakah ada password
      if (!password) {
        throw { name: "BadRequest", message: "Password is required" };
      }

      //! 3a. ambil data dari db by email
      const user = await User.findOne({
        where: {
          email,
        },
      });
      //! 3b. cek apakah user ada di db
      if (!user)
        throw { name: "Unauthorized", message: "Invalid Email/Password" };

      //! 4a. compare password apakah match dengan data dari db (verify by bcryptjs)
      const checkPassword = comparePassword(password, user.password);

      //! 4b. check apakah falsy setelah compare password
      if (!checkPassword)
        throw { name: "Unauthorized", message: "Invalid Email/Password" };

      //! 5. generate token by jsonwebtoken (jwt)
      const access_token = signToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      console.log(access_token);

      //! 6. response access_token
      res.status(200).json({
        access_token: access_token,
      });
    } catch (error) {
      //! error handler untuk Unauthorized
      //   if (error.name === "Unauthorized") {
      //     res.status(401).json({
      //       message: error.message,
      //     });
      //   }

      //! error handler untuk BadRequest
      //   if (error.name === "BadRequest") {
      //     res.status(400).json({ message: error.message });
      //   }

      //! error handler untuk Internal Server Error
      //   res.status(500).json({ message: "Internal Server Error" });

      next(error);
    }
  }
}

module.exports = UserController;
