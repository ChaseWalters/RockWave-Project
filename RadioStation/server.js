var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://chasewalters1apps:sSbNDeCTATogclDe@rockwave.0kgbh0t.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to the database');
});

// SCHEMAS

// Function to create schemas and models
const Schema = mongoose.Schema;

// DJ Schema
const djSchema = new Schema({
    name: String,
    availableTimes: [String] // You can store time slots as strings
});

// Song Schema
const songSchema = new Schema({
    name: String,
    year: String,
    artist: String
});

// Playlist Schema
const playlistSchema = new Schema({
    dj: { type: Schema.Types.ObjectId, ref: 'DJ' }, // Reference to DJ Schema
    date: Date,
    songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }] // Reference to Song Schema
});

// Create models from the schemas
const DJ = mongoose.model('DJ', djSchema);
const Song = mongoose.model('Song', songSchema);
const Playlist = mongoose.model('Playlist', playlistSchema);

const models = { DJ, Song, Playlist };

// Function to create a new DJ
function createDJ(DJ, name, availableTimes) {
    var dj = new DJ({ name: name, availableTimes: availableTimes });
    dj.save()
        .then(savedDJ => {
            console.log(savedDJ.name + " saved to DJ collection.");
        })
        .catch(error => {
            console.error(error);
        });
}

function createSong(Song, name, year, artist) {
    var song = new Song({ name: name, year: year, artist: artist });
    song.save()
        .then(savedSong => {
            console.log(savedSong.name + " saved to Song collection.");
        })
        .catch(error => {
            console.error(error);
        });
}

function updateSongName(Song, songId, newName) {
    Song.updateOne({ _id: songId }, { name: newName }, function (err, res) {
        if (err) return console.error(err);
        console.log("Updated song name.");
    });
}

function getAllSongs(Song) {
    Song.find(function (err, songs) {
        if (err) return console.error(err);
        console.log(songs);
    });
}


// Creating default data for DB AND TESTING

function createExampleDJs() {
    createDJ(models.DJ, "Alex", ["12:00-14:00", "15:00-17:00"]),
    createDJ(models.DJ, "Bobby", ["12:00-14:00", "15:00-17:00"]),
    createDJ(models.DJ, "Charly", ["12:00-14:00", "15:00-17:00"]),
    createDJ(models.DJ, "Dan", ["12:00-14:00", "15:00-17:00"]),
    createDJ(models.DJ, "Frulm", ["12:00-14:00", "15:00-17:00"]),
    createDJ(models.DJ, "Gorda", ["12:00-14:00", "15:00-17:00"]),
    createDJ(models.DJ, "Hiltay", ["12:00-14:00", "15:00-17:00"]),
    createDJ(models.DJ, "Jasmin", ["12:00-14:00", "15:00-17:00"]),
    createDJ(models.DJ, "Iuhhhh", ["12:00-14:00", "15:00-17:00"]),
    createDJ(models.DJ, "stopped", ["12:00-14:00", "15:00-17:00"]),
    createDJ(models.DJ, "Trying", ["12:00-14:00", "15:00-17:00"]),
    createDJ(models.DJ, "Tooo Uhh", ["12:00-14:00", "15:00-17:00"]),
    createDJ(models.DJ, "Create", ["12:00-14:00", "15:00-17:00"]),
    createDJ(models.DJ, "Moreah", ["12:00-14:00", "15:00-17:00"]),
    createDJ(models.DJ, "MadeUp", ["12:00-14:00", "15:00-17:00"]),
    createDJ(models.DJ, "Namesss", ["12:00-14:00", "15:00-17:00"])
}

function createExampleSongs() {
    createSong(models.Song, "Rocking it", "1994", "TheRocks"),
    createSong(models.Song, "DAba doo", "2055", "TheStones"),
    createSong(models.Song, "real songz", "1991", "TheRocks"),
    createSong(models.Song, "inever jokz", "2300", "TheStones"),
    createSong(models.Song, "If yor redndis", "1944", "TheRocks"),
    createSong(models.Song, "ToosLate", "2007", "TheStones"),
    createSong(models.Song, "WhoopsIMadeASong", "1972", "TheRocks"),
    createSong(models.Song, "NotAnother Song", "2010", "TheStones"),
    createSong(models.Song, "SuperNotrock", "1991", "TheRocks"),
    createSong(models.Song, "Another Song", "2016", "TheStones"),
    createSong(models.Song, "Not Rocking it", "1990", "TheRocks"),
    createSong(models.Song, "Tesda Song", "2052", "TheStones")
}

// Usage

// UNCOMMENT EACH TO ADD IF NEEDED

//createExampleDJs(); // EXAMPLE DJS

//createExampleSongs() // EXAMPLES SONGS

//module.exports = createModels();

//allowing the producer.js to get the dj list.

app.get('/api/djs', async (req, res) => {
    try {
        const djs = await models.DJ.find().exec();
        res.json(djs);
    } catch (error) {
        console.error("Error fetching DJs:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//allowing producer.js to search for songs in DB
app.get('/api/search', (req, res) => {
    const searchTerm = req.query.term; // Get the search term from the query parameters

    // Query your database for songs matching the search term
    // This is a simplified example assuming you have a Song model
    Song.find({ $or: [{ name: { $regex: searchTerm, $options: 'i' } }, { artist: { $regex: searchTerm, $options: 'i' } }] })
        .then(songs => {
            // Send the matching songs as JSON response
            res.json(songs);
        })
        .catch(error => {
            console.error("Error searching for songs:", error);
            res.status(500).json({ error: "Internal server error" });
        });
});

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

//Local Variables to use
app.locals.siteName = "RWRP" // rock wave radio project

// Set up css files
app.use(express.static(path.join(__dirname, 'public')));

// index page
app.get('/', function(req, res) {
  res.render('pages/index', {
  });
});

// manager page
app.get('/manager', function (req, res) {
    res.render('pages/manager');
});

// producer page
app.get('/producer', function(req, res) {
  res.render('pages/producer');
});

// dj page
app.get('/dj', function (req, res) {
    res.render('pages/dj');
});

app.listen(8080);
console.log('Server is listening on port 8080');