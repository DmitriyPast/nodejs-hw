import { model, Schema } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const noteSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, trim: true, default: '' },
    tag: {
      type: String,
      enum: TAGS,
      default: 'Todo',
    },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true, versionKey: false },
);

// Додаємо текстовий індекс: кажемо MongoDB, що по полю name можна робити $text
noteSchema.index({ title: 'text', content: 'text' });
// noteSchema.index({});

export const Note = model('Note', noteSchema);
