//importing
const express = require('express');
const routes = express.Router();
const mentorModel = require('../models/mentorModel.js');
const studentModel = require('../models/studentModel.js');

//Add mentor
routes.post("/add-mentor", async (req, res) => {
    try {
        const mentor = await mentorModel.findOne({mentorName : req.body.mentorName}) 
        //Checking mentor already exist in list
        if(mentor == null){
            const newMentor = new mentorModel({
                mentorName: req.body.mentorName
            });
            await newMentor.save();
            res.json({'message':'Mentor added successfully...','Data':newMentor});
        }
        else{
            res.send("Mentor already exist in mentor list...");
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
})

//List all mentors
routes.get('/', async (req, res) => {

    try {
        const mentor = await mentorModel.find();
        res.send(mentor)
    }
    catch (error) {
        res.status(400).json({ msg: error });
    }
})

//Assign students to mentor
routes.post('/assign-students/:id', async (req, res) => {

    try {
        //Getting data as parameter
        const mentorId = req.params.id;
        let status1 = [];

        const students = req.body.students;
        console.log(students)

        const mentor = await mentorModel.findOne({ _id: mentorId });
        //Checking mentor exist in the list
        if (mentor != null) {
            students.forEach(async (student) => {

                
                const student2 = await studentModel.findOne({ studentName: student })

                //Checking the student is not assigned to mentor
                if (student2 != null && student2.mentorName == null) {

                    //insert mentor to specified student
                    mentor.students.push(student);

                    await studentModel.findOneAndUpdate({ studentName: student },
                        {
                            $set: {
                                "mentorName": mentor.mentorName
                            }
                        })
                    status1.push(`Mentor ${mentor.mentorName} assinged to ${student}`)
                }
                //If student is not exist in list
                else if (student2 == null) {
                    status1.push(`${student} is not in student list`)
                }
                else {
                    status1.push(`Mentor already assinged to ${student}`);
                }
                if (students[students.length - 1] == student) res.status(200).json({ 'status': status1 });
            });
        }
        //If mentor is not exist in list
        else {
            res.status(200).json({ 'status': `Mentor not exist with id ${mentorId}` })
        }

        mentor.save();

    }
    catch (error) {
        res.status(400).json(error);
    }
});

//Get all sutents of specified mentor
routes.get('/students/:id', async (req, res) => {
    try {
        const mentor = await mentorModel.findOne({ _id: req.params.id })
        if(mentor != null) res.status(200).json({ students: mentor.students });
        else res.status(200).json({ 'Message': 'Mentor is not exist with this ID...' })
    }
    catch (error) {
        res.status(400).json(error);
    }
})


//Remove Students
// routes.put('/remove-students/:id', async (req, res) => {
//     const mentorId = req.params.id;
//     const students1 = req.body.students;
//     const mentor = await Mentor.findOneAndUpdate({ _id: mentorId }, {
//         $pullAll: {
//             students: students1
//         }
//     })
//     res.status(200).send(mentor);
// })

module.exports = routes;