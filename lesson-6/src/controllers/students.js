import createHttpError from 'http-errors';

import {
  getStudents,
  getStudent,
  deleteStudent,
  createStudent,
  replaceStudent,
  updateStudent,
} from '../services/students.js';

export async function getStudentsController(req, res) {
  const students = await getStudents();

  res.json(students);
}

export async function getStudentController(req, res) {
  const { id } = req.params;

  const student = await getStudent(id);

  if (student === null) {
    throw new createHttpError.NotFound('Student not found');
  }

  res.json(student);
}

export async function deleteStudentController(req, res) {
  const { id } = req.params;

  const result = await deleteStudent(id);

  if (result === null) {
    throw new createHttpError.NotFound('Student not found');
  }

  res.json({
    status: 200,
    message: 'Student deleted successfully',
    data: result,
  });
}

export async function createStudentController(req, res) {
  const student = req.body;

  const result = await createStudent(student);

  res
    .status(201)
    .json({ status: 201, message: 'User created successfully', data: result });
}

export async function replaceStudentController(req, res) {
  const { id } = req.params;
  const student = req.body;

  const result = await replaceStudent(id, student);

  if (result.updatedExisting === true) {
    return res.json({
      status: 200,
      message: 'Student updated successfully',
      data: result.value,
    });
  }

  res.status(201).json({
    status: 201,
    message: 'Student created successfully',
    data: result.value,
  });
}

export async function updateStudentController(req, res) {
  const { id } = req.params;
  const student = req.body;

  const result = await updateStudent(id, student);

  if (result === null) {
    throw new createHttpError.NotFound('Student not found');
  }

  res.json({
    status: 200,
    message: 'Student updated successfully',
    data: result,
  });
}
