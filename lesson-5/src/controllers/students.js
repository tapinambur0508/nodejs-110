import { getStudents, getStudent } from '../services/students.js';

export async function getStudentsController(req, res) {
  const students = await getStudents();

  res.json(students);
}

export async function getStudentController(req, res) {
  const { id } = req.params;

  const student = await getStudent(id);

  if (student === null) {
    return res.status(404).send('Student not found');
  }

  res.json(student);
}
