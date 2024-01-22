const mongoose = require('mongoose');

//Schema for mentor model
const mentorSchema = new mongoose.Schema({
    mentorName: {
        type: String,
        required: true
    },
    students: {
        type: Array,
    }
}
);

//Creating mentor model
const MentorModel = mongoose.model("Mentor", mentorSchema);

module.exports = MentorModel;