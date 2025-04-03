import express from 'express';

import {
  getStudentsController,
  getStudentController,
  deleteStudentController,
  createStudentController,
  replaceStudentController,
  updateStudentController,
} from '../controllers/students.js';

import { upload } from '../middlewares/upload.js';
import { isValidID } from '../middlewares/isValidID.js';
import { validateBody } from '../middlewares/validateBody.js';

import { studentSchema, updateStudentSchema } from '../validation/student.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getStudentsController));

router.get('/:id', isValidID, ctrlWrapper(getStudentController));

router.delete('/:id', isValidID, ctrlWrapper(deleteStudentController));

router.post(
  '/',
  upload.single('avatar'),
  jsonParser,
  validateBody(studentSchema),
  ctrlWrapper(createStudentController),
);

router.put(
  '/:id',
  isValidID,
  jsonParser,
  validateBody(studentSchema),
  ctrlWrapper(replaceStudentController),
);

router.patch(
  '/:id',
  isValidID,
  jsonParser,
  validateBody(updateStudentSchema),
  ctrlWrapper(updateStudentController),
);

export default router;
