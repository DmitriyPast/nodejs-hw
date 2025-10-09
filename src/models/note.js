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

// Додаємо текстовий індекс: кажемо MongoDB, що по полю name можна робити $text
noteSchema.index({ title: 'text', content: 'text' });
// noteSchema.index({});

export const Note = model('Note', noteSchema);
