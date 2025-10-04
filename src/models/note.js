import { model, Schema } from 'mongoose';

const noteSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, trim: true, default: '' },
    tag: {
      type: String,
      enum: [
        'Work',
        'Personal',
        'Meeting',
        'Shopping',
        'Ideas',
        'Travel',
        'Finance',
        'Health',
        'Important',
        'Todo',
      ],
      default: 'Todo',
    },
  },
  { timestamps: true, versionKey: false },
);

export const Note = model('Note', noteSchema);

// \\ src\models\student.js
// import { Schema } from 'mongoose';
// const studentSchema = new Schema(
//   {
//     name: { type: String, required: true },
//     age: { type: Number, required: true },
//     gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
//     avgMark: { type: Number, required: true },
//     onDuty: { type: Boolean, required: true, default: false },
//   },
//   { timestamps: true, versionKey: false },
// );

// type — тип даних (String, Number, Boolean).
// required — обов’язкове поле.
// enum — перелік допустимих значень (наприклад, для gender).
// default — значення за замовчуванням, якщо поле не передано.
// timestamps — автоматично додає createdAt і updatedAt.
// versionKey: false — вимикає службове поле __v.
