require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
//app.use(cors());
app.use(express.static('public'));

// MongoDB bağlantısı
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB Atlas', err));

// Veritabanı modeli
const ScheduleSchema = new mongoose.Schema({
    time: String,
    day: String,
    name: String
});

const Schedule = mongoose.model('Schedule', ScheduleSchema);

// Rotalar
app.post('/save', async (req, res) => {
    try {
        await Schedule.deleteMany({});
        const schedule = req.body.map(entry => new Schedule(entry));
        await Schedule.insertMany(schedule);
        res.status(200).send('Schedule saved!');
    } catch (error) {
        res.status(500).send('Error saving schedule');
    }
});

app.post('/clear', async (req, res) => {
    try {
        await Schedule.deleteMany({});
        res.status(200).send('Schedule cleared!');
    } catch (error) {
        res.status(500).send('Error clearing schedule');
    }
});

app.get('/load', async (req, res) => {
    try {
        const schedule = await Schedule.find({});
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).send('Error loading schedule');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
