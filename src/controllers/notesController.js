import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export async function getAllNotes(req, res) {
  const { page = 1, perPage = 10, search, tag } = req.query;
  // console.log(req.query);
  const notesQuery = Note.find();
  const skip = (page - 1) * perPage;

  if (tag) notesQuery.where('tag').equals(tag);
  if (search) notesQuery.where({ $text: { $search: search } });

  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  // res.status(200).json(notes);
  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
}

export async function getNoteById(req, res, next) {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

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
