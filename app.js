const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const playStore = require('./playstore.js');

const app = express();

app.use(morgan('common'));
app.use(cors());

app.get('/apps', (req, res) => {
    const { sort, genre = ' '} = req.query;

    if(sort){
        if(!['rating', 'app'].includes(sort)){
            return res
                .status(400)
                .send('Sort must be by rating or app');
        }
    }

    if(genre){
        if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade','Card'].includes(genre)){
            return res
                .status(400)
                .send('Genres must be one of these: Action, Puzzle, Strategy, Casual, Arcade, or Card')
        }
    }

    //filter results
    let results = playStore
            .filter(playApp =>
                playApp
                    .Genres
                    .includes(genre));
    res
        .json(results);

    //sort results
    if(sort){
        results.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });
    }
});

app.listen(8000, () => {
    console.log('Server started on Port 8000');
});