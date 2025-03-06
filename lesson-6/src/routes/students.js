import express from 'express';

import {
  getStudentsController,
  getStudentController,
  deleteStudentController,
  createStudentController,
  replaceStudentController,
  updateStudentController,
} from '../controllers/students.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getStudentsController));

router.get('/:id', ctrlWrapper(getStudentController));

router.delete('/:id', ctrlWrapper(deleteStudentController));

router.post('/', jsonParser, ctrlWrapper(createStudentController));

router.put('/:id', jsonParser, ctrlWrapper(replaceStudentController));

router.patch('/:id', jsonParser, ctrlWrapper(updateStudentController));

export default router;
