var express = require('express')
var router = express.Router()
var feedbackController = require("../controllers/feedback_controller")

router.route("/").post(feedbackController.postFeedback)

module.exports = router