var express = require('express')
var router = express.Router()
var authController = require('../controllers/auth_controller')

router.route("/register").post(authController.registerUser)
router.route("/login").post(authController.loginUser)
router.route("/deleteUser/:id").delete(authController.deleteUser)
router.route("/updateUser/:id").put(authController.UpdateUser)

module.exports = router