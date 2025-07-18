import * as fs from 'fs/promises';
import * as path from 'path';

interface Note {
  id: string;
  content: string;
}

const DATA_FILE = path.join(__dirname, 'notes.json');

async function loadNotes(): Promise<Note[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveNotes(notes: Note[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(notes, null, 2), 'utf-8');
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

async function addNote(content: string): Promise<void> {
  const notes = await loadNotes();
  notes.push({ id: generateId(), content });
  await saveNotes(notes);
  console.log('Note added!');
}

async function listNotes(): Promise<void> {
  const notes = await loadNotes();
  if (notes.length === 0) {
    console.log('No notes found.');
    return;
  }
  notes.forEach(note => {
    console.log(`- [${note.id}]: ${note.content}`);
  });
}

async function deleteNote(id: string): Promise<void> {
  let notes = await loadNotes();
  const beforeCount = notes.length;
  notes = notes.filter(note => note.id !== id);
  if (notes.length === beforeCount) {
    console.log('Note ID not found.');
    return;
  }
  await saveNotes(notes);
  console.log('Note deleted!');
}

async function main() {
  const [,, command, ...args] = process.argv;

  switch (command) {
    case 'add':
      if (!args.length) {
        console.log('Please provide note content to add.');
        return;
      }
      await addNote(args.join(' '));
      break;
    case 'list':
      await listNotes();
      break;
    case 'delete':
      if (!args.length) {
        console.log('Please provide note ID to delete.');
        return;
      }
      await deleteNote(args[0]);
      break;
    default:
      console.log('Usage:');
      console.log('  add <note-content>    Add a new note');
      console.log('  list                  List all notes');
      console.log('  delete <note-id>      Delete note by ID');
  }
}

main();
