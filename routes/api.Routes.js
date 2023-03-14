const express = require('express');
const fs = require('fs');

const router = express.Router();
const notesFilePath = './db/db.json';

// Get all notes [ If parsing the data fails, an error message is returned ]
router.get('/notes', (req, res) => {
    fs.readFile(notesFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error reading notes file');
        return;
      }
  
      let notesData;
  
      try {
        notesData = JSON.parse(data);
      } catch (err) {
        console.error(err);
        res.status(500).send('Error parsing notes data');
        return;
      }
  
      res.json(notesData);
    });
  });  

// Add a new note
router.post('/notes', (req, res) => {
  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading notes file');
      return;
    }

    const notesData = JSON.parse(data);
    const newNote = req.body;
    const newId = notesData.length.toString();
    newNote.id = newId;
    notesData.push(newNote);

    fs.writeFile(notesFilePath, JSON.stringify(notesData), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error writing notes file');
        return;
      }

      res.json(notesData);
    });
  });
});

// Delete a note
router.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading notes file');
      return;
    }

    const notesData = JSON.parse(data);
    const filteredNotes = notesData.filter((notesData) => notesData.id !== noteId);

    fs.writeFile(notesFilePath, JSON.stringify(filteredNotes), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error writing notes file');
        return;
      }

      res.json(filteredNotes);
    });
  });
});

module.exports = router;
