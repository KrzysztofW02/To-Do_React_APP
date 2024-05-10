const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let db;

const connectDB = async () => {
    const client = await mongodb.MongoClient.connect('mongodb://localhost:27017');
    db = client.db('To-Do-DB');
  };
connectDB();

app.get('/tasks', async (req, res) => {
  const tasks = await db.collection('Tasks').find({}).toArray();
  res.send(tasks);
});

app.get('/days', async (req, res) => {
    const days = await db.collection('Days').find({}).toArray();
    res.send(days);
  });

app.post('/days', async (req, res) => {
    const newDay = req.body;
    const result = await db.collection('Days').insertOne(newDay);
    res.send(result);
});

app.delete('/days', async (req, res) => {
    try {
        const result = await db.collection('Days').deleteMany({});
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting all days');
    }
});

app.delete('/days/:day', async (req, res) => {
    const day = req.params.day;
    const result = await db.collection('Days').deleteOne({ day: day });
    if (result.deletedCount === 0) {
        res.status(404).send({ message: 'No day found with that date' });
    } else {
        res.send(result);
    }
});


app.listen(5000, () => console.log('Server is running on port 5000'));