/* PRODUCER PAGE JS */

class DJ {
    constructor(name, availableTimes) {
        this.name = name;
        this.availableTimes = availableTimes;
    }
}

let availableDJs = [
    new DJ("Alex", ["12:00-14:00", "15:00-17:00"]),
    new DJ("Bobby", ["12:00-14:00", "15:00-17:00"]),
    new DJ("Charly", ["12:00-14:00", "15:00-17:00"]),
    new DJ("Dan", ["12:00-14:00", "15:00-17:00"]),
    new DJ("Frulm", ["12:00-14:00", "15:00-17:00"]),
    new DJ("Gorda", ["12:00-14:00", "15:00-17:00"]),
    new DJ("Hiltay", ["12:00-14:00", "15:00-17:00"]),
    new DJ("Jasmin", ["12:00-14:00", "15:00-17:00"]),
    new DJ("Iuhhhh", ["12:00-14:00", "15:00-17:00"]),
    new DJ("stopped", ["12:00-14:00", "15:00-17:00"]),
    new DJ("Trying", ["12:00-14:00", "15:00-17:00"]),
    new DJ("Tooo Uhh", ["12:00-14:00", "15:00-17:00"]),
    new DJ("Create", ["12:00-14:00", "15:00-17:00"]),
    new DJ("Moreah", ["12:00-14:00", "15:00-17:00"]),
    new DJ("MadeUp", ["12:00-14:00", "15:00-17:00"]),
    new DJ("Namesss", ["12:00-14:00", "15:00-17:00"]),
];

let searchResultSongs = [
    { name: "Rocking it", year: "1994", artist: "TheRocks" },
    { name: "DAba doo", year: "2055", artist: "TheStones" },
    { name: "real songz", year: "1991", artist: "TheRocks" },
    { name: "inever jokz", year: "2300", artist: "TheStones" },
    { name: "If yor redndis", year: "1944", artist: "TheRocks" },
    { name: "ToosLate", year: "2007", artist: "TheStones" },
    { name: "WhoopsIMadeASong", year: "1972", artist: "TheRocks" },
    { name: "NotAnother Song", year: "2010", artist: "TheStones" },
    { name: "SuperNotrock", year: "1991", artist: "TheRocks" },
    { name: "Another Song", year: "2016", artist: "TheStones" },
    { name: "Not Rocking it", year: "1990", artist: "TheRocks" },
    { name: "Tesda Song", year: "2052", artist: "TheStones" },
];

// TEMPORARY SONG LIST FOR DEMOSTRATING THAT MY LIST CREATION WORKS :}
let currentPlaylistSongs = [
    { name: "Rocking it", year: "1994", artist: "TheRocks" },
    { name: "DAba doo", year: "2055", artist: "TheStones" },
    { name: "real songz", year: "1991", artist: "TheRocks" },
    { name: "inever jokz", year: "2300", artist: "TheStones" },
    { name: "If yor redndis", year: "1944", artist: "TheRocks" },
    { name: "ToosLate", year: "2007", artist: "TheStones" },
    { name: "WhoopsIMadeASong", year: "1972", artist: "TheRocks" },
    { name: "NotAnother Song", year: "2010", artist: "TheStones" },
    { name: "SuperNotrock", year: "1991", artist: "TheRocks" },
    { name: "Another Song", year: "2016", artist: "TheStones" },
    { name: "Not Rocking it", year: "1990", artist: "TheRocks" },
    { name: "Tesda Song", year: "2052", artist: "TheStones" },
];

//THE CURRENTLY SELECTED DJ.. the green one
let selectedDJ = null;

function generateDJList(djs) {
    let djList = document.querySelector('.dj-list ul');
    djs.forEach(dj => {
        let djBox = document.createElement('li');
        djBox.className = 'dj-box';
        djBox.textContent = dj.name;
        djBox.addEventListener('click', function () {
            if (selectedDJ) {
                selectedDJ.style.backgroundColor = '';
            }
            this.style.backgroundColor = 'green';
            selectedDJ = this;
        });
        djList.appendChild(djBox);
    });
}

//ADDS ITEMS TO RESULTS LIST BASED ON SEARCH SONGS LIST
function updateResults() {
    let resultsBox = document.querySelector('.results-box');
    resultsBox.innerHTML = '';
    for (let song of searchResultSongs) {
        let resultElement = document.createElement('div');
        resultElement.className = 'result-element';

        let songName = document.createElement('div');
        songName.className = 'song-name';
        songName.textContent = song.name;

        let songArtist = document.createElement('div');
        songArtist.className = 'song-artist';
        songArtist.textContent = song.artist;

        let songYear = document.createElement('div');
        songYear.className = 'song-year';
        songYear.textContent = song.year;

        resultElement.appendChild(songName);
        resultElement.appendChild(songArtist);
        resultElement.appendChild(songYear);

        resultsBox.appendChild(resultElement);
    }
}

//CHANGES YEARS FOR ITEMS IN SEARCH SONGS LIST FOR TESTING / GRADING will likely be removed
function randomizeYears() {
    let minYear = 1950;
    let maxYear = 2024;

    for (let song of searchResultSongs) {
        let randomYear = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
        song.year = randomYear.toString();
    }
}


document.addEventListener("DOMContentLoaded", function () {


    let playlist = document.querySelector(".playlist");

    // ADDS SONGS TO CURRENT PLAYLIST
    currentPlaylistSongs.forEach((song, index) => {
        let listItem = document.createElement("li");
        let songInfo = document.createElement("div");
        songInfo.className = "song-info";

        let songNumber = document.createElement("span");
        songNumber.className = "song-number";
        songNumber.textContent = "#" + (index + 1);

        let songTitle = document.createElement("span");
        songTitle.className = "song-title";
        songTitle.textContent = song.name;

        let removeButton = document.createElement("button");
        removeButton.className = "remove-button";
        removeButton.textContent = "X";
        removeButton.addEventListener("click", function () {
            listItem.remove();
            let songItems = playlist.querySelectorAll(".song-info");
            songItems.forEach((songItem, index) => {
                let songNumber = songItem.querySelector(".song-number");
                songNumber.textContent = "#" + (index + 1);
            });
        });

        songInfo.appendChild(songNumber);
        songInfo.appendChild(songTitle);
        songInfo.appendChild(removeButton);
        listItem.appendChild(songInfo);
        playlist.appendChild(listItem);
    });


    //FOR FUTURE APPLY BUTTON USES NOT IMPLEMENTED ATM
    /*
    const applySelectionButton = document.querySelector(".apply-selection button");
    if (applySelectionButton) {
        applySelectionButton.addEventListener("click", function (event) {
            event.preventDefault();
            alert("Apply Selection button clicked amazing job! This will send currentplaylist and selected dj in future");
        });
    }
    */

    const datePickerForm = document.querySelector(".date-picker form");
    if (datePickerForm) {
        datePickerForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const selectedDateValue = document.querySelector(".date-picker input[type='date']").value;
            const selectedDate = new Date(selectedDateValue);
            const timezoneOffset = selectedDate.getTimezoneOffset();
            selectedDate.setMinutes(selectedDate.getMinutes() + timezoneOffset);
            const currentDate = new Date();

            if (!selectedDateValue) {
                document.querySelector(".error-box h3").textContent = "No Date Selected";
                document.querySelector(".error-box").style.display = "block";
            }
            else if (selectedDate < currentDate) {
                document.querySelector(".error-box h3").textContent = "Date cannot be in the past";
                document.querySelector(".error-box").style.display = "block";
            } else {
                document.querySelector(".error-box").style.display = "none";
                alert("Selected date: " + selectedDate.toLocaleDateString());
            }
        });
    }

    const musicSearchBar = document.querySelector(".music-search-bar");
    if (musicSearchBar) {
        musicSearchBar.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                const searchTerm = event.target.value;
                alert("Search term entered: " + searchTerm + " : NOTE - will add things to list in future when database is made :p");
                // FUTURE SEACHING STUFF GO HERE 
            }
        });
    }


    const removeButtons = document.querySelectorAll(".remove-button");
    removeButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            const songListItem = event.target.closest("li");
            if (songListItem) {
                const songList = songListItem.parentElement;
                const songs = Array.from(songList.querySelectorAll("li"));
                const startIndex = songs.indexOf(songListItem);
                songListItem.remove();
                songs.slice(startIndex + 1).forEach((song, index) => {
                    const songNumberElement = song.querySelector(".song-number");
                    if (songNumberElement) {
                        const songNumber = "#" + (startIndex + index + 1);
                        songNumberElement.textContent = songNumber;
                    }
                });
            }
        });
    });


    randomizeYears();
    updateResults();
    generateDJList(availableDJs);

});