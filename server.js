const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const path = require('path');
const { readFromFile, readAndAppend, deleteFromFile } = require('./helpers/fsUtils');
const uuid = require('./helpers/uuid');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        readAndAppend(newNote, './db/db.json');
        res.json('Note added');
    } else {
        res.error('Error in adding note');
      }
});

app.delete('/api/notes/:id', (req, res) => {
    deleteFromFile('./db/db.json', req.params.id);
    res.json('Note deleted');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
  });