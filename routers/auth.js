const express = require('express')
const UserController = require("../controllers/UserController")

const authRouter = express.Router()

authRouter.post('/register', UserController.register)
authRouter.post('/login', UserController.login)

module.exports = authRouter