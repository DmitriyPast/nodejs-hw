import { Router } from 'express';
// import { Note } from './models/note';
// import { getNoteById, getNotes } from '../controllers/notesController';
// import { Note } from '../models/note.js';
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from '../controllers/notesController.js';

const router = Router();

router.get('/notes', getAllNotes);
router.get('/notes/:noteId', getNoteById);
router.post('/notes', createNote);
router.delete('/notes/:noteId', deleteNote);
router.patch('/notes/:noteId', updateNote);

// router.get('/test-error', () => {
//   throw new Error('Simulated server error');
// });
export default router;
