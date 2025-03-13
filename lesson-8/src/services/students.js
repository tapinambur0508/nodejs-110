import Student from '../models/student.js';

export async function getStudents({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
}) {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const studentQuery = Student.find();

  if (typeof filter.minYear !== 'undefined') {
    studentQuery.where('year').gte(filter.minYear);
  }

  if (typeof filter.maxYear !== 'undefined') {
    studentQuery.where('year').lte(filter.maxYear);
  }

  const [total, students] = await Promise.all([
    Student.countDocuments(studentQuery),
    studentQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return {
    students,
    total,
    page,
    perPage,
    totalPages,
    hasNextPage: totalPages > page,
    hasPreviousPage: page > 1,
  };
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
