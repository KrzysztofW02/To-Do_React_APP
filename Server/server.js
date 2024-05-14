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

app.get('/days', async (req, res) => {
    const days = await db.collection('Days').find({}).toArray();
    res.send(days);
});

app.get('/days/:day', async (req, res) => {
    const day = req.params.day;
    console.log(day)
    const dayData = await db.collection('Days').findOne({ day: day });
    if (dayData) {
      res.send(dayData);
    } else {
      res.status(404).send({ message: 'Day not found' });
    }
});

app.post('/days', async (req, res) => {
    const day = req.body.day;
  
    const existingDay = await db.collection('Days').findOne({ day: day });
  
    if (!existingDay) {
      const result = await db.collection('Days').insertOne({ day: day, tasks: [] });
      res.send(result);
    } else {
      
      res.status(400).send({ error: 'Day already exists' });
    }
  });
  
  app.post('/days/:day/tasks', async (req, res) => {
    const day = req.params.day;
    const newTask = req.body.task;
  
    const existingDay = await db.collection('Days').findOne({ day: day });
  
    if (existingDay) {
      const existingTasks = Array.isArray(existingDay.tasks) ? existingDay.tasks : [];
      const updatedTasks = [...existingTasks, newTask];
      const result = await db.collection('Days').updateOne(
        { day: day },
        { $set: { tasks: updatedTasks } }
      );
      res.send(result);
    } else {
      res.status(400).send({ error: 'Day does not exist' });
    }
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

app.put('/days/:day/tasks/:task', async (req, res) => {
  const day = req.params.day;
  const taskName = req.params.task;
  const { isDaily } = req.body;

  const existingDay = await db.collection('Days').findOne({ day: day });

  if (existingDay) {
    const existingTasks = Array.isArray(existingDay.tasks) ? existingDay.tasks : [];
    const updatedTasks = existingTasks.map(task => {
      if (task.name === taskName) {
        return { ...task, isDaily: isDaily };
      }
      return task;
    });
    const result = await db.collection('Days').updateOne(
      { day: day },
      { $set: { tasks: updatedTasks } }
    );
    res.send(result);
  } else {
    res.status(400).send({ error: 'Day does not exist' });
  }
});



app.listen(5000, () => console.log('Server is running on port 5000'));