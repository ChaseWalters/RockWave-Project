var express = require('express');
var app = express();
app.use(express.json());
app.use(express.static('public'));
var path = require('path');
var mongoose = require('mongoose');
const { Int32 } = require('mongodb');

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
    artist: String,
    genre: String,
    duration: Number
});

// Playlist Schema
const playlistSchema = new Schema({
    dj: { type: Schema.Types.ObjectId, ref: 'DJ' }, // Reference to DJ Schema
    date: Date,
    availableTime: String, // Array to store available times for the DJ
    songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }] // Reference to Song Schema
});

// Create models from the schemas
const DJ = mongoose.model('DJ', djSchema);
const Song = mongoose.model('Song', songSchema);
const Playlist = mongoose.model('Playlist', playlistSchema);

const models = { DJ, Song, Playlist };

// Function to create a new playlist
function createPlaylist(Playlist, djId, date, availableTimes, songIds) {
    var playlist = new Playlist({ dj: djId, date: date, availableTimes: availableTimes, songs: songIds });
    playlist.save()
        .then(savedPlaylist => {
            console.log("Playlist saved:", savedPlaylist);
        })
        .catch(error => {
            console.error("Error saving playlist:", error);
        });
}

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

function createSong(Song, name, year, artist, genre, duration) {
    var song = new Song({ name: name, year: year, artist: artist, genre: genre, duration: duration });
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
    createDJ(models.DJ, "Alex", ["12:00-13:00", "15:00-16:00"]),
    createDJ(models.DJ, "Bobby", ["12:00-13:00", "15:00-16:00"]),
    createDJ(models.DJ, "Charly", ["12:00-13:00", "15:00-16:00"]),
    createDJ(models.DJ, "Dan", ["12:00-13:00", "15:00-16:00"]),
    createDJ(models.DJ, "Frulm", ["12:00-13:00", "15:00-16:00"]),
    createDJ(models.DJ, "Gorda", ["12:00-13:00", "15:00-16:00"]),
    createDJ(models.DJ, "Hiltay", ["12:00-13:00", "15:00-16:00"]),
    createDJ(models.DJ, "Jasmin", ["12:00-13:00", "15:00-16:00"]),
    createDJ(models.DJ, "Iuhhhh", ["12:00-13:00", "15:00-16:00"]),
    createDJ(models.DJ, "stopped", ["12:00-13:00", "15:00-16:00"]),
    createDJ(models.DJ, "Trying", ["12:00-13:00", "15:00-16:00"]),
    createDJ(models.DJ, "Tooo Uhh", ["12:00-13:00", "15:00-16:00"]),
    createDJ(models.DJ, "Create", ["12:00-13:00", "15:00-16:00"]),
    createDJ(models.DJ, "Moreah", ["12:00-13:00", "15:00-16:00"]),
    createDJ(models.DJ, "MadeUp", ["12:00-13:00", "15:00-16:00"]),
    createDJ(models.DJ, "Namesss", ["12:00-13:00", "15:00-16:00"])
}

function createExampleSongs() {
    createSong(models.Song, "Rocking it", "1994", "TheRocks", "Rock", 180),
    createSong(models.Song, "DAba doo", "2055", "TheStones", "Rock", 210),
    createSong(models.Song, "real songz", "1991", "TheRocks", "Rock", 191),
    createSong(models.Song, "inever jokz", "2300", "TheStones", "Rock", 169),
    createSong(models.Song, "If yor redndis", "1944", "TheRocks", "Rock", 178),
    createSong(models.Song, "ToosLate", "2007", "TheStones", "Rock", 177),
    createSong(models.Song, "WhoopsIMadeASong", "1972", "TheRocks", "Rock", 199),
    createSong(models.Song, "NotAnother Song", "2010", "TheStones", "Rock", 203),
    createSong(models.Song, "SuperNotrock", "1991", "TheRocks", "Jazz", 209),
    createSong(models.Song, "Another Song", "2016", "TheStones", "Rock", 185),
    createSong(models.Song, "Not Rocking it", "1990", "TheRocks", "Classical", 213),
    createSong(models.Song, "Tesda Song", "2052", "TheStones", "HipHop", 158)
}

// Function to create a random playlist
async function createRandomPlaylist() {
    try {
        // Get a random DJ from the database
        const randomDJ = await models.DJ.aggregate([{ $sample: { size: 1 } }]);
        const selectedDJ = randomDJ[0]; // Access the DJ document from the array

        // Get 0-5 random songs from the database
        const randomSongs = await models.Song.aggregate([{ $sample: { size: Math.floor((Math.random() * 6)+1) } }]);

        // Generate a random date and time for the playlist (within the next week for example)
        const currentDate = new Date();
        const randomDate = new Date(currentDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000); // Add random milliseconds within a week
        const randomHour = Math.floor(Math.random() * 24); // Random hour (0-23)
        randomDate.setHours(randomHour); // Set the random hour

        // Select a random available time slot from the DJ's available times
        const randomIndex = Math.floor(Math.random() * selectedDJ.availableTimes.length);
        const selectedTimeSlot = selectedDJ.availableTimes[randomIndex];

        // Create the playlist object
        const playlist = new models.Playlist({
            dj: selectedDJ._id, // Use the ID of the randomly selected DJ
            date: randomDate,
            availableTime: selectedTimeSlot, // Use the selected time slot
            songs: randomSongs.map(song => song._id) // Use the IDs of the randomly selected songs
        });

        // Save the playlist to the database
        const savedPlaylist = await playlist.save();

        // Log the name of the DJ and the names of the songs in the playlist
        console.log("Random playlist saved:");
        console.log("DJ:", selectedDJ.name);
        console.log("Songs:");
        randomSongs.forEach(song => {
            console.log("- ", song.name);
        });
    } catch (error) {
        console.error("Error creating random playlist:", error);
    }
}

//module.exports = models; 

// Usage

// UNCOMMENT EACH TO ADD IF NEEDED

//createExampleDJs(); // EXAMPLE DJS

//createExampleSongs() // EXAMPLES SONGS

//createRandomPlaylist(models.Playlist, models.DJ, models.Song); // ADD A RANDOM PLAYLIST


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

app.get('/api/songs', async (req, res) => {

    //Song.find(function (err, songs) {
    //    res.json(songs);
    //    if (err) return console.error(err);
   // });

    // try {
    //     const songs = await models.Song.find().exec();
    //     res.json(songs);
    // } catch (error) {
    //     console.error("Error fetching songs:", error);
    //     res.status(500).json({ error: 'Internal server error' });
    // }
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

// Route to search for playlists based on DJ name and date/time
app.get('/api/playlists', async (req, res) => {
    const { djName, dateTime, selectedTimeSlot } = req.query;

    try {
        // Log the DJ name and time being searched for
        console.log(`Looking for ${djName} playlist at ${dateTime} with selected time slot ${selectedTimeSlot}`);

        // Find the DJ with the specified name
        const dj = await models.DJ.findOne({ name: djName });

        if (!dj) {
            return res.status(404).json({ message: 'DJ not found' });
        }

        // Extract the start hour from the selectedTimeSlot
        const selectedStartHour = parseInt(selectedTimeSlot.split('-')[0].split(':')[0]);

        // Extract the available start and end hours from the availableTime
        const [availableStartHour, availableEndHour] = selectedTimeSlot.split('-').map(time => parseInt(time.split(':')[0]));

        // Parse the dateTime string into a Date object
        const queryDate = new Date(dateTime);
        const yearMonthDay = new Date(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate());

        console.log('Year-Month-Day:', yearMonthDay);

        // Find playlists associated with the DJ and matching the selected time slot and date
        const playlists = await models.Playlist.find({
            dj: dj._id, // Use the ID of the found DJ
            // Check if the selected start hour falls within any available time slot in the playlist
            $expr: {
                $and: [
                    { $lte: [selectedStartHour, availableEndHour] },
                    { $gte: [selectedStartHour, availableStartHour] }
                ]
            },
            date: {
                $gte: new Date(yearMonthDay.getFullYear(), yearMonthDay.getMonth(), yearMonthDay.getDate()),
                $lt: new Date(yearMonthDay.getFullYear(), yearMonthDay.getMonth(), yearMonthDay.getDate() + 1)
            }
        }).populate('songs') // Populate the songs array in the playlist document
            .exec();

        res.json({ playlists });
    } catch (error) {
        console.error('Error searching for playlists:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Apply Button for the Producer page request
app.post('/api/applyPlaylist', async (req, res) => {
    try {
        const { selectedDJName, currentPlaylistSongs, selectedDate, selectedTimeSlot } = req.body; // Extract data from the request body

        // Find the DJ with the selected name from the database
        const selectedDJ = await models.DJ.findOne({ name: selectedDJName });

        if (!selectedDJ) {
            return res.status(404).json({ message: 'Selected DJ not found' });
        }

        // Extract the start hour from the selected time slot (availableTime)
        const [selectedStartTime, selectedEndTime] = selectedTimeSlot.split('-').map(time => parseInt(time.split(':')[0]));

        // Parse the selected date into year, month, and day components
        const year = new Date(selectedDate).getFullYear();
        const month = new Date(selectedDate).getMonth();
        const day = new Date(selectedDate).getDate();

        // Search for existing playlists that match the criteria
        const existingPlaylist = await models.Playlist.findOne({
            dj: selectedDJ._id, // Use the ID of the found DJ
            date: { $eq: new Date(year, month, day) }, // Match the year, month, and day components of the selected date exactly
            // Check if the selected start hour falls within the available time range
            $expr: {
                $and: [
                    // Check if availableTime is a string before comparing
                    { $eq: [{ $type: "$availableTime" }, "string"] },
                    { $eq: [{ $substrCP: ["$availableTime", 0, 2] }, selectedStartTime.toString()] } // Check if the selected start hour matches the start hour in availableTime
                ]
            }
        }).populate('songs');


        if (existingPlaylist) {
            // Playlist found, update the existing playlist with the new songs

            // Clear existing songs from the playlist
            existingPlaylist.songs = [];

            let totalDurationSeconds = 0;

            // Iterate over each song in currentPlaylistSongs
            for (const song of currentPlaylistSongs) {
                // Find the corresponding song in the database based on name and artist
                const matchingSong = await models.Song.findOne({ name: song.name, artist: song.artist });

                if (matchingSong) {
                    // Add the matching song to the playlist
                    existingPlaylist.songs.push(matchingSong._id);

                    // Increment the total duration of the playlist by the duration of the matching song
                    totalDurationSeconds += matchingSong.duration;
                } else {
                    // Song not found in the database, you may choose to handle this case accordingly
                    console.warn(`Song '${song.name}' by '${song.artist}' not found in the database.`);
                }
            }

            // Convert total duration to minutes and round up
            const totalDurationMinutes = Math.ceil(totalDurationSeconds / 60);

            // Calculate the end time of the playlist
            const endTimeHour = selectedStartTime + Math.floor(totalDurationMinutes / 60);
            const endTimeMinute = selectedStartTime + (totalDurationMinutes % 60);

            // Set the end time format (HH:MM)
            const endTime = `${endTimeHour}:${endTimeMinute < 10 ? '0' : ''}${endTimeMinute}`;

            // Update the availableTime in the existing playlist with the calculated end time
            existingPlaylist.availableTime = `${selectedStartTime}:00-${endTime}`;

            // Save the updated playlist to the database
            await existingPlaylist.save();

            console.log('Updated existing playlist');
            res.status(200).json({ message: 'Playlist updated', playlist: existingPlaylist });
        } else {
            // No matching playlist found, create a new playlist

            // Create a new playlist document
            const newPlaylist = new models.Playlist({
                dj: selectedDJ._id, // Use the ID of the selected DJ
                date: new Date(year, month, day), // Create a Date object for the selected date
                availableTime: selectedTimeSlot, // Use the selected time slot
                songs: [] // Initialize an empty array for songs
            });

            let totalDurationSeconds = 0;

            // Iterate over each song in currentPlaylistSongs
            for (const song of currentPlaylistSongs) {
                // Find the corresponding song in the database based on name and artist
                const matchingSong = await models.Song.findOne({ name: song.name, artist: song.artist });

                if (matchingSong) {
                    // Add the matching song to the playlist
                    newPlaylist.songs.push(matchingSong._id);

                    // Increment the total duration of the playlist by the duration of the matching song
                    totalDurationSeconds += matchingSong.duration;
                } else {
                    // Song not found in the database, you may choose to handle this case accordingly
                    console.warn(`Song '${song.name}' by '${song.artist}' not found in the database.`);
                }
            }

            // Convert total duration to minutes and round up
            const totalDurationMinutes = Math.ceil(totalDurationSeconds / 60);

            // Calculate the end time of the playlist
            const endTimeHour = selectedStartTime + Math.floor(totalDurationMinutes / 60);
            const endTimeMinute = selectedStartTime + (totalDurationMinutes % 60);

            // Set the end time format (HH:MM)
            const endTime = `${endTimeHour}:${endTimeMinute < 10 ? '0' : ''}${endTimeMinute}`;

            // Save the end time to the new playlist
            newPlaylist.availableTime = `${selectedStartTime}:00-${endTime}`;


            // Save the new playlist to the database
            await newPlaylist.save();

            console.log('New playlist created');
            res.status(200).json({ message: 'New playlist created', playlist: newPlaylist });
        }
    } catch (error) {
        console.error('Error applying playlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
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

app.get('/producer/help', function (req, res) {
    res.render('pages/producerHelp');
});

// dj page
app.get('/dj', function (req, res) {
    res.render('pages/dj');
});

app.listen(8080);
console.log('Server is listening on port 8080');


