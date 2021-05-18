// Dependencies

const express = require('express');
const path = require('path');
const fs = require('fs');
const { response } = require('express');

// Sets up the Express App

const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(path.join(__dirname, '/public/assets') , express.static('/assets'));
app.use(express.static('public'));



// Routes

// Basic route that sends the user first to the AJAX Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.get('/api/notes', (request, response) => {
    // should read the `db.json` file and return all saved notes as JSON.
    fs.readFile(path.join(__dirname, './db/db.json'), (err, data) => {
        response.json(JSON.parse(data));
    });
});

app.post('/api/notes', (request, response) => {
    // should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into `npm` packages that could do this for you).

    // get old data
    data = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json')));
    // splat in the new data
    data = [...data, { "id": Date.now(), ...request.body }]
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(data));
    response.status(200).send('ok');
});



app.delete('/api/notes/:id', (request, response) => {
    // ` should receive a query parameter containing the id of a note to delete. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
    let id = request.params.id;

    data = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json')));
    data = data.filter((element) => {
        return element["id"] != id;
    })
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(data));
    response.status(200).send('ok');

});


//  initialise server
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
