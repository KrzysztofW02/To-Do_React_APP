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

app.get('/days', async (req, res) => { //Wyswietlanie dni
    const days = await db.collection('Days').find({}).toArray();
    res.send(days);
});

app.get('/days/:day', async (req, res) => { //Wyswietlanie taskow w konkretnym dniu
    const day = req.params.day;
    console.log(day)
    const dayData = await db.collection('Days').findOne({ day: day });
    if (dayData) {
      res.send(dayData);
    } else {
      res.status(404).send({ message: 'Day not found' });
    }
});

app.post('/days', async (req, res) => { //Dodawanie dni
    const day = req.body.day;
  
    const existingDay = await db.collection('Days').findOne({ day: day });
  
    if (!existingDay) {
      const result = await db.collection('Days').insertOne({ day: day, tasks: [] });
      res.send(result);
    } else {
      
      res.status(400).send({ error: 'Day already exists' });
    }
  });
  
  app.post('/days/:day/tasks', async (req, res) => { //Dodawanie taskow do poszczegolnych dni
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

app.delete('/days', async (req, res) => { //Usuwanie wszystkich dni
    try {
        const result = await db.collection('Days').deleteMany({});
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting all days');
    }
});

app.delete('/days/:day', async (req, res) => { //Usuwanie konkretnego dnia
    const day = req.params.day;
    const result = await db.collection('Days').deleteOne({ day: day });
    if (result.deletedCount === 0) {
        res.status(404).send({ message: 'No day found with that date' });
    } else {
        res.send(result);
    }
});

app.put('/days/:day/tasks/:task', async (req, res) => { //Edycja taskow
  const day = req.params.day;
  const taskName = req.params.task;
  const { isDaily, isSelected } = req.body;

  const existingDay = await db.collection('Days').findOne({ day: day });

  if (existingDay) {
    const existingTasks = Array.isArray(existingDay.tasks) ? existingDay.tasks : [];
    const updatedTasks = existingTasks.map(task => {
      if (task.name === taskName) {
        return { ...task, isDaily: isDaily, isSelected: isSelected };
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

app.delete('/days/:day/tasks/:task', async (req, res) => { //Usuwanie konkretnego taska
  const day = req.params.day;
  const taskName = req.params.task;
  console.log('day:', day);
  console.log('taskName:', taskName);

  const existingDay = await db.collection('Days').findOne({ day: day });
  console.log('existingDay:', existingDay);

  if (existingDay) {
    const existingTasks = Array.isArray(existingDay.tasks) ? existingDay.tasks : [];
    const updatedTasks = existingTasks.filter(task => task.name !== taskName);
    console.log('updatedTasks:', updatedTasks);

    const result = await db.collection('Days').updateOne(
      { day: day },
      { $set: { tasks: updatedTasks } }
    );
    res.send(result);
  } else {
    res.status(400).send({ error: 'Day does not exist' });
  }
});

app.get('/days/:day/tasks', async (req, res) => { //Wuswietlanie taskow w konkretnym dniu
  const day = req.params.day;
  const existingDay = await db.collection('Days').findOne({ day: day });

  if (existingDay) {
    res.send(existingDay.tasks);
  } else {
    res.status(404).send({ error: 'Day not found' });
  }
});

app.get('/days/:day/tasks/:task', async (req, res) => { //Wyswietlanie konkretnego taska
  const day = req.params.day;
  const taskName = req.params.task;
  const existingDay = await db.collection('Days').findOne({ day: day });

  if (existingDay) {
    const task = existingDay.tasks.find(task => task.name === taskName);
    if (task) {
      res.send(task);
    } else {
      res.status(404).send({ error: 'Task not found' });
    }
  } else {
    res.status(404).send({ error: 'Day not found' });
  }
});

app.post('/dailytasks', async (req, res) => { //Dodawanie daily taskow
  const newTaskName = req.body.name;

  if (!newTaskName) {
    return res.status(400).send({ error: 'Task name is missing' });
  }

  const existingTask = await db.collection('DailyTasks').findOne({ name: newTaskName });

  if (existingTask) {
    return res.status(400).send({ error: 'Task already exists in daily tasks' });
  }

  const result = await db.collection('DailyTasks').insertOne({ name: newTaskName });
  res.send(result);
});

app.get('/dailytasks', async (req, res) => {
  const dailyTasks = await db.collection('DailyTasks').find({}).toArray();
  res.send(dailyTasks);
});

app.listen(5000, () => console.log('Server is running on port 5000'));

app.delete('/dailytasks/:task', async (req, res) => { //Usuwanie daily taskow
  const taskName = req.params.task;

  const existingTask = await db.collection('DailyTasks').findOne({ name: taskName });

  if (existingTask) {
    const result = await db.collection('DailyTasks').deleteOne({ name: taskName });
    res.send(result);
  } else {
    res.status(400).send({ error: 'Task does not exist in daily tasks' });
  }
});

app.get('/dailytasks/:task', async (req, res) => { //Wyswietlanie konkretnego daily taska
  const taskName = req.params.task;
  const existingTask = await db.collection('DailyTasks').findOne({ name: taskName });

  if (existingTask) {
    res.send(existingTask);
  } else {
    res.status(404).send({ error: 'Task not found in daily tasks' });
  }
});

