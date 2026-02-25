const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

const authentication = async (req, res, next) => {
  try {
    //! 1. destruct authorization dari req.headers
    const { authorization } = req.headers;

    //! 1a. cek apakah authorization-nya ada - Unauthorized
    if (!authorization) {
      throw { name: "Unauthorized", message: "Invalid Token" };
    }

    //! 3. split token by " " untuk mendapatkan token type dan token value
    const rawToken = authorization.split(" ");
    const tokenType = rawToken[0];
    const tokenValue = rawToken[1];

    //! 3a. cek token type sesuai dan tokenvalue ada isinya - Unauthorized
    if (tokenType !== "Bearer" || !tokenValue) {
      throw { name: "Unauthorized", message: "Invalid Token" };
    }

    //! 4. verify token dari helper verify jwt untuk mendapatkan payload
    const payload = verifyToken(tokenValue);
    // console.log(payload);

    //! 5. double check user ada di database kita
    const user = await User.findOne({
      where: {
        id: payload.id,
      },
    });

    //! 5a. cek apakah usernya ada - Unauthorized
    if (!user) {
      throw { name: "Unauthorized", message: "Invalid Token" };
    }

    //! 6. inject user object id & role yg login ke variable request (req.user)
    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch (error) {
    //! 1. cek error "JsonWebTokenError"
    // if (error.name === 'JsonWebTokenError'){
    //     throw res.status(401).json({message : 'Invalid Token'})
    // }
    //! 2. cek error "Unauthorized"
    // if (error.name === 'Unauthorized') {
    //     res.status(401).json({message : error.message})
    // }
    //! 3. cek error ISE
    // res.status(500).json({message : 'Internal Server Error'})

    //! move to errorHandler
    next(error);
  }
};

module.exports = authentication;
