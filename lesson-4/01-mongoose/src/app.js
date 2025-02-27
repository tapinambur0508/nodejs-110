import express from 'express';

import Student from './models/student.js';

const app = express();

app.get('/students', async (req, res) => {
  const students = await Student.find();

  res.json(students);
});

app.get('/students/:id', async (req, res) => {
  const { id } = req.params;

  const student = await Student.findById(id);

  if (student === null) {
    return res.status(404).send('Student not found');
  }

  res.json(student);
});

export default app;
