const express = require('express');
const router = express.Router();
const studentModel = require('../models/studentModel');
const mentorModel = require('../models/mentorModel');

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

//Get students list
router.get('/', async (req, res) => {

    try {
        const students = await studentModel.find();
        res.status(200).send(students);
    }
    catch (error) {
        res.status(400).send(error);
    }
});

//Get student list without mentor
router.get('/students-without-mentor', async (req, res) => {
    const students = await studentModel.find();

    try {

        let studentsWithoutMentor = students.filter(student => {
            return student.mentorName == null;
        })
        res.status(200).send(studentsWithoutMentor);

    }
    catch (error) {
        res.status(400).send(error);
    }
})

//Change mentor to particular particular student
router.post('/change-mentor/:id', async (req, res) => {
    try {
        const student = await studentModel.findOne({ _id: req.params.id });
        const mentor = await mentorModel.findOne({ mentorName: req.body.mentorName });

        //Checking student and mentor exist in the list
        if (student != null && mentor != null) {

            //Changing mentor in specified student
            const student1 = await studentModel.findOneAndUpdate({ _id: req.params.id },
                {
                    $set: {
                        "previousMentorName": student.mentorName,
                        "mentorName": req.body.mentorName
                    }
                })

            //Removing student from previous mentor
            const mentor1 = await mentorModel.findOneAndUpdate({ mentorName: student.mentorName },
                {
                    $pull: {
                        "students": { $in : student1 }
                    }
                });

            //Adding student to current mentor
            mentor.students.push(student1.studentName)

            mentor.save();
            res.status(200).json({ message: "Mentor changed successfully..." });
        }
        else if (mentor === null) res.status(200).json({ message: "Mentor is not exist in mentor list..." });

        else res.status(200).json({ message: "Student is not exist in specified ID..." });
    }
    catch (error) {
        res.status(400).send(error);
    }
})

//Get previous mentor
router.get('/previous-mentor/:id', async (req, res) => {
    const student = await studentModel.findOne({ _id: req.params.id });

    if (student != null && student.previousMentorName != null) {
        res.status(200).json({ "Previous Mentor": student.previousMentorName })
    }
    else {
        res.status(200).json({ "Status": 'Data is not available' })
    }
})

module.exports = router;