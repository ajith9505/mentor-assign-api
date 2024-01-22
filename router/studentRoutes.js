const express = require('express');
const router = express.Router();
const studentModel = require('../models/studentModel');

router.post('/add-student', async (req, res) => {
    const Name = req.body.studentName
    const student = await studentModel.findOne({ studentName: Name });
    try {
        // Checking if student already exist in list
        if (student == null) {
            const newStudent = new studentModel({
                studentName: Name
            })
            await newStudent.save();
            res.status(200).send('Student added successfully...');
        }
        else {
            res.status(200).send('Student already exist with same name...')
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
});

//Get students lst
router.get('/', async (req, res) => {
    try {
        const students = await studentModel.find();
        res.status(200).send(students);
    }
    catch (error) {
        res.status(400).send(error);
    }
});

//Change mentor to particular particular student
router.post('/change-mentor/:id', async (req, res) => {
    try {
        const student = await studentModel.findOne({ _id: req.params.id })

        if (student != null) {
            await studentModel.findOneAndUpdate({ _id: req.params.id },
                {
                    $set: {
                        "previousMentorName": student.mentorName,
                        "mentorName": req.body.mentorName
                    }
                })
            res.status(200).json({ message: "Mentor changed successfully..." });
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
})

//Get previous mentor
router.get('/previous-mentor/:id', async (req, res) => {
    const student = await studentModel.findOne({ _id: req.params.id });
    console.log();
    if (student != null && student.previousMentorName != null) {
        res.status(200).json({ "Previous Mentor": student.previousMentorName })
    }
    else {
        res.status(200).json({ "Status": 'Data is not available' })
    }
})

module.exports = router;