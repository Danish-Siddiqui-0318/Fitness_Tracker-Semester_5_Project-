var express = require('express')
var router = express.Router()
var authController = require('../controllers/auth_controller')
var jwtMiddleWare = require('../middleware/jwt_token_middleware')

router.route("/register").post(authController.registerUser)
router.route("/login").post(authController.loginUser)
router.route("/deleteUser/:id").delete(authController.deleteUser)
router.route("/updateUser/:id").put(authController.UpdateUser)
router.get("/profile", jwtMiddleWare, authController.getUserProfile);


module.exports = router