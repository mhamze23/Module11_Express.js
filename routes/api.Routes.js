// Import necessary dependencies
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const { v4: uuid } = require('uuid');

// Load initial notes from db.json file
let notes = require('../db/db.json');

// Define an async function to read the db.json file
const readFileAsync = async () => {
    const data = await fs.readFile('./db/db.json', 'utf8');
    return JSON.parse(data);
}

// Define an async function to write to the db.json file
const writeFileAsync = async (notes) => {
    await fs.writeFile('./db/db.json', JSON.stringify(notes));
}

// Handle GET requests to /api/notes, returning all current notes
router.get('/notes', (req, res) =>{
    res.json(notes);
});

// Handle POST requests to /api/notes, adding a new note
router.post('/notes', async (req, res) => {
    // Create new note with unique ID and text and title from request body
    const newNote = {
        id: uuid(),
        title: req.body.title,
        text: req.body.text,
    };

    // Add the new note to the notes array
    notes.push(newNote);

    // Write the updated notes array back to the db.json file
    await writeFileAsync(notes);

    // Re-read file to keep the 'notes' variable up-to-date
    notes = await readFileAsync();

    // Return the new note
    res.json(newNote);
});

// Handle DELETE requests to /api/notes/:id, deleting the note with the specified ID
router.delete('/notes/:id', async (req, res) => {
    const id = req.params.id;

    // Find the index of the note with the specified ID
    const noteIndex = notes.findIndex(note => note.id === id);
    if(noteIndex > -1) {
        // If found, remove the note from the array
        notes.splice(noteIndex, 1);
    }

    // Write the updated notes array back to the db.json file
    await writeFileAsync(notes);

    // Re-read file to keep the 'notes' variable up-to-date
    notes = await readFileAsync();

    // Return the updated notes
    res.json(notes);
});

// Export the router to be used by the main application
module.exports = router;
