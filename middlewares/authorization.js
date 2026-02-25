const { User } = require("../models");

const adminOnly = async (req, res, next) => {
  try {
    //! apabila req.user.role === "Admin" maka next() else throw "Forbidden"
    if (req.user.role === "Admin") {
      next();
    } else {
      throw { name: "Forbidden", message: `You're not authorized` };
    }
  } catch (error) {
    //! 1. cek error "Forbidden"
    // if (error.name === "Forbidden") {
    //     res.status(403).json({
    //         message : error.message
    //     })
    // }
    //! 2. cek error ISE
    // res.status(500).json({message : 'Internal Server Error'})
    //! 3. move to error handler
    next(error);
  }
};

module.exports = adminOnly;
