import Student from '../models/student.js';

export function getStudents() {
  return Student.find();
}

export function getStudent(studentId) {
  return Student.findById(studentId); // findOne({ _id: id })
}

export function deleteStudent(studentId) {
  return Student.findByIdAndDelete(studentId); // findOneAndDelete({ _id: id })
}

export function createStudent(student) {
  return Student.create(student);
}

export async function replaceStudent(studentId, student) {
  const result = await Student.findByIdAndUpdate(studentId, student, {
    new: true,
    upsert: true,
    includeResultMetadata: true,
  });

  return {
    value: result.value,
    updatedExisting: result.lastErrorObject.updatedExisting,
  };
}

export async function updateStudent(studentId, student) {
  return Student.findByIdAndUpdate(studentId, student, { new: true });
}
