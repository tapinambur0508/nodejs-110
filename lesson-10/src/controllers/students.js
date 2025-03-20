import createHttpError from 'http-errors';

import {
  getStudents,
  getStudent,
  deleteStudent,
  createStudent,
  replaceStudent,
  updateStudent,
} from '../services/students.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export async function getStudentsController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const response = await getStudents({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user.id,
  });

  res.json({
    status: 200,
    message: 'Students fetched successfully',
    data: response,
  });
}

export async function getStudentController(req, res) {
  const { id } = req.params;

  const student = await getStudent(id);

  if (student === null) {
    throw new createHttpError.NotFound('Student not found');
  }

  if (student.userId.toString() !== req.user.id.toString()) {
    // throw new createHttpError.Forbidden("Student is not allowed");
    throw new createHttpError.NotFound('Student not found');
  }

  res.json({
    status: 200,
    message: 'Student fetched successfully',
    data: student,
  });
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
  const student = {
    ...req.body,
    userId: req.user.id,
  };

  const result = await createStudent(student);

  res.status(201).json({
    status: 201,
    message: 'Student created successfully',
    data: result,
  });
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
