import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export async function getAllNotes(req, res) {
  const notes = await Note.find();
  res.status(200).json(notes);
}

export async function getNoteById(req, res, next) {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);
  // Код що був до цього
  // if (!note) return res.status(404).json({ message: 'Note not found' });
  // Додаємо базову обробку помилки замість res.status(404)
  if (!note) return next(createHttpError(404, 'Note not found'));
  res.status(200).json(note);
}

export async function createNote(req, res) {
  const note = await Note.create(req.body);
  res.status(201).json(note);
}

export async function deleteNote(req, res, next) {
  const note = await Note.findOneAndDelete({ _id: req.params.noteId });
  if (!note) return next(createHttpError(404, 'Note not found'));
  res.status(200).send(note);
}

export async function updateNote(req, res, next) {
  const note = await Note.findByIdAndUpdate(req.params.noteId, req.body, {
    new: true,
  });
  if (!note) return next(createHttpError(404, 'Note not found'));
  res.status(200).json(note);
}

// router.get('/test-error', () => {
//   throw new Error('Simulated server error');
// });
