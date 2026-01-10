var express = require('express')
var router = express.Router()
var weightController = require('../controllers/weight_controller')

router.route("/").post(weightController.PostWeight)
router.route("/:id").get(weightController.getUserWeight)
module.exports = router