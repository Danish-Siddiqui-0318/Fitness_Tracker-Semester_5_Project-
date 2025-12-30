const mongoose = require('mongoose')
async function connectDB() {
    try {
        var conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Connected to : ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
    }
}