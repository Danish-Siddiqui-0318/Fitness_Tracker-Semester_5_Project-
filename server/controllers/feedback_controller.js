var feedbackModel = require('../models/feedback_model')

async function postFeedback(req, res) {
    try {
        const { user_id, feedback } = req.body;

        if (!user_id || !feedback) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const newfeedback = await feedbackModel.create({
            user_id,
            feedback
        });

        res.status(201).json({
            message: "Your feedback has been sent",
            feedback: newfeedback
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


module.exports = { postFeedback }