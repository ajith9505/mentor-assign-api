const mongoose = require('mongoose');

//Schema for student model
const studentSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },
    mentorName: {
        type: String
    },
    previousMentorName: {
        type: String
    }
})

//Creating and exporting student model
module.exports = mongoose.model('Student', studentSchema);