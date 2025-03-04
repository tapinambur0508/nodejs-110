import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female'],
  },
  onDuty: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
