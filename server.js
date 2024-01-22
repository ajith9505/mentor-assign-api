//Importing
const express = require('express');
const app = express();
const connectDB = require('./db/db');
const bodyParser = require('body-parser');
const mentorRouter = require('./router/mentorRoutes');
const studentRouter = require('./router/studentRoutes');

const port = 8080;

app.use(bodyParser.json());
connectDB();

app.use('/mentor', mentorRouter);

app.use('/student', studentRouter);

app.listen(port,() => console.log(`Listening on port : ${port}`));

