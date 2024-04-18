/* PRODUCER PAGE JS */

class DJ {
    constructor(name, availableTimes) {
        this.name = name;
        this.availableTimes = availableTimes;
    }
}

let selectedTimeSlot = "";

let selectedDateValue;

let availableDJs = [
];

let searchResultSongs = [
];

// TEMPORARY SONG LIST FOR DEMOSTRATING THAT MY LIST CREATION WORKS :}
let currentPlaylistSongs = [
];
/*
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
]*/
//THE CURRENTLY SELECTED DJ.. the green one
let selectedDJ = null;

// Fetch DJs from the database


document.addEventListener("DOMContentLoaded", async function () {

    const currentPlaylist = document.querySelector(".playlist");
    const playlist = document.querySelector(".playlist");

    // Search bar functionality
    const musicSearchBar = document.querySelector(".music-search-bar");
    if (musicSearchBar) {
        musicSearchBar.addEventListener("keydown", async function (event) {
            if (event.key === "Enter") {
                const searchTerm = event.target.value.toLowerCase(); // Convert to lowercase for case-insensitive search

                try {
                    // Send a request to your server to search for songs matching the searchTerm
                    const response = await fetch(`/api/search?term=${encodeURIComponent(searchTerm)}`);
                    const matchingSongs = await response.json();

                    // Update the search result songs with the matching songs returned from the server
                    searchResultSongs = matchingSongs;

                    // Update the UI with the matching songs
                    updateResults();
                } catch (error) {
                    console.error("Error searching for songs:", error);
                }
            }
        });
    }


    function handleDragStart(event) {
        event.dataTransfer.setData("text/plain", event.target.dataset.index);
        console.log("Start Drag index:", event.target.dataset.index);
    }

    // Function to handle drag over event
    function handleDragOver(event) {
        event.preventDefault();
    }

    // Function to handle drop event
    function handleDrop(event) {
        event.preventDefault();
        const fromIndex = parseInt(event.dataTransfer.getData("text/plain"));
        const toIndex = parseInt(event.target.dataset.index);
        const items = playlist.querySelectorAll(".song-info");

        console.log("From index:", fromIndex);
        console.log("To index:", toIndex);

        // Check if fromIndex is a valid number and itemToMove is a valid node
        if (!isNaN(fromIndex) && fromIndex >= 0 && fromIndex < items.length) {
            const itemToMove = items[fromIndex];
            let referenceItem;

            // If dragging to the last position, set referenceItem to null
            if (toIndex === items.length - 1) {
                referenceItem = null;
            } else {
                referenceItem = items[toIndex < fromIndex ? toIndex : toIndex + 1];
            }

            console.log("Item to move:", itemToMove);

            if (itemToMove) {
                const listItem = itemToMove.parentElement; // Get the parent li element
                if (listItem && listItem.parentNode === playlist) {
                    playlist.removeChild(listItem); // Remove the li element
                    if (referenceItem && referenceItem.parentElement) {
                        playlist.insertBefore(listItem, referenceItem.parentElement); // Insert the li element
                    } else {
                        playlist.appendChild(listItem); // Append to the end if referenceItem's parent is undefined
                    }
                } else {
                    console.error("Item to move is not valid or not a child of playlist:", itemToMove);
                }

                // Update the song numbers
                const songNumbers = playlist.querySelectorAll(".song-number");
                songNumbers.forEach((number, index) => {
                    number.textContent = "#" + (index + 1);
                });

                // Update playlist indices
                updatePlaylistIndices();
            } else {
                console.error("Item to move is not valid:", itemToMove);
            }
        } else {
            console.error("Invalid from index:", fromIndex);
        }
    }

    // Add dragover and drop event listeners to the playlist
    //playlist.addEventListener("dragover", handleDragOver);
    //playlist.addEventListener("drop", handleDrop);

    // Function to remove a song from the playlist and update the playlistCounter
    function removeSongAndUpdateCounter(songListItem) {
        songListItem.remove();
        playlistCounter--; // Decrement the counter
        updatePlaylistIndices(); // Update the song numbers
    }
    

    let playlistCounter = 0; // Counter to keep track of the order of songs in the playlist

    // Function to add a song to the current playlist
    function addSongToPlaylist(song) {
        const listItem = document.createElement("li");
        const songInfo = document.createElement("div");
        songInfo.className = "song-info";

        const songNumber = document.createElement("span");
        songNumber.className = "song-number";
        songNumber.textContent = "#" + (playlistCounter + 1); // Use playlistIndexCounter as the song number

        const songTitle = document.createElement("span");
        songTitle.className = "song-title";
        songTitle.textContent = song.name;

        const removeButton = document.createElement("button");
        removeButton.className = "remove-button";
        removeButton.textContent = "X";
        removeButton.addEventListener("click", function () {
            removeSongAndUpdateCounter(listItem); // Remove the song and update the counter
        });

        songInfo.appendChild(songNumber);
        songInfo.appendChild(songTitle);
        songInfo.appendChild(removeButton);
        listItem.appendChild(songInfo);

        // Set data-index attribute to keep track of the index
        songInfo.dataset.index = playlistCounter;
        console.log("Added Song to index:", songInfo.dataset.index);

        // Attach dragstart event listener to the new song item
        songInfo.setAttribute("draggable", "true");
        console.log("Song info", songInfo);
        songInfo.addEventListener("dragstart", handleDragStart);
        // Attach dragover event listener
        songInfo.addEventListener("dragover", handleDragOver);

        // Attach drop event listener
        songInfo.addEventListener("drop", handleDrop);

        currentPlaylist.appendChild(listItem);

        // Increment the playlist index counter for the next song
        playlistCounter++;
    }

    // Function to update song indices in the playlist
    function updatePlaylistIndices() {
        const songItems = currentPlaylist.querySelectorAll(".song-info");
        songItems.forEach((songItem, index) => {
            const songNumber = songItem.querySelector(".song-number");
            songNumber.textContent = "#" + (index + 1);
            // Update dataset.index attribute
            songItem.dataset.index = index;
        });
    }

    // Update the search result songs with filtered songs
    function updateResults() {
        const resultsBox = document.querySelector('.results-box');
        resultsBox.innerHTML = '';
        searchResultSongs.forEach((song, index) => {
            const resultElement = document.createElement('div');
            resultElement.className = 'result-element';

            const songName = document.createElement('div');
            songName.className = 'song-name';
            songName.textContent = song.name;

            const songArtist = document.createElement('div');
            songArtist.className = 'song-artist';
            songArtist.textContent = song.artist;

            const songYear = document.createElement('div');
            songYear.className = 'song-year';
            songYear.textContent = song.year;

            resultElement.appendChild(songName);
            resultElement.appendChild(songArtist);
            resultElement.appendChild(songYear);

            // Add click event listener to add song to playlist
            resultElement.addEventListener('click', function () {
                addSongToPlaylist(song, index); // Pass the index to addSongToPlaylist
            });

            resultsBox.appendChild(resultElement);
        });
    }


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

    function fetchDJsFromDatabase() {
        return models.DJ.find().exec();
    }

    function generateDJList(djs) {
        let djList = document.querySelector('.dj-list ul');
        djs.forEach(dj => {
            let djBox = document.createElement('li');
            djBox.className = 'dj-box';
            djBox.textContent = dj.name;
            djBox.addEventListener('click', function () {
                // Highlight the selected DJ box
                if (selectedDJ) {
                    selectedDJ.style.backgroundColor = '';
                }
                // Highlight the clicked DJ box with green background
                this.style.backgroundColor = 'green';

                // Store the reference to the clicked DJ box
                selectedDJ = this;

                // Call the function to handle DJ box click with both DJ name and selected time slot
                handleDJBoxClick(dj.name, selectedTimeSlot);
            });
            djList.appendChild(djBox);
        });
    }

    // Function to fetch playlists for a DJ
    async function fetchPlaylistsForDJ(djName, selectedTimeSlot) {
        try {
            // Make an asynchronous request to the backend API
            const response = await fetch(`/api/playlists?djName=${djName}&dateTime=${selectedDateValue.toISOString()}&selectedTimeSlot=${selectedTimeSlot}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data.playlists;
            } else {
                throw new Error('Failed to fetch playlists');
            }
        } catch (error) {
            console.error('Error fetching playlists:', error);
            return null;
        }
    }

    // Function to handle DJ box click
    function handleDJBoxClick(djName, selectedTimeSlot) {
        fetchPlaylistsForDJ(djName, selectedTimeSlot)
            .then(playlists => {

                // Clear the current playlist songs
                currentPlaylist.innerHTML = '';
                currentPlaylistSongs = [];

                if (playlists && playlists.length > 0) {

                    // Iterate through each playlist
                    playlists.forEach(playlist => {
                        // Iterate through each song in the playlist and add it to currentPlaylistSongs
                        playlist.songs.forEach(song => {
                            currentPlaylistSongs.push({
                                name: song.name,
                                year: song.year,
                                artist: song.artist
                            });
                        });
                    });

                    // Clear the current playlist section
                    currentPlaylist.innerHTML = '';

                    // Add the songs from currentPlaylistSongs to the current playlist
                    currentPlaylistSongs.forEach(song => {
                        addSongToPlaylist(song);
                    });

                    updatePlaylistIndices();

                } else {
                    console.log(`No playlists found for DJ ${djName}`);
                    console.log(`Playlist size was ${playlists.length}`);
                }
            })
            .catch(error => {
                console.error('Error handling DJ box click:', error);

                currentPlaylist.innerHTML = '';
                currentPlaylistSongs = []; // Clear the current playlist songs arra
            });
    }

    const dateTimePicker = document.getElementById("dateTimePicker");

    const datePickerForm = document.querySelector(".date-picker form");
    if (datePickerForm) {
        datePickerForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const selectedDateTimeValue = dateTimePicker.value;
            const selectedDateTime = new Date(selectedDateTimeValue);
            const selectedHour = selectedDateTime.getHours(); // Extracting the selected hour

            const currentDate = new Date();

            if (!selectedDateTimeValue) {
                document.querySelector(".error-box h3").textContent = "No Date & Time Selected";
                document.querySelector(".error-box").style.display = "block";
            } else if (selectedDateTime < currentDate) {
                document.querySelector(".error-box h3").textContent = "Date & Time cannot be in the past";
                document.querySelector(".error-box").style.display = "block";
            } else {
                document.querySelector(".error-box").style.display = "none";
                alert("Selected date and time: " + selectedDateTime.toLocaleString());

                try {
                    // Fetch DJs from the server
                    const response = await fetch('/api/djs');
                    const djs = await response.json();

                    // Filter DJs based on availability for the selected hour
                    const availableDJsForHour = djs.filter(dj => {
                        // Extracting start and end hour from availableTimes
                        const [startHour, endHour] = dj.availableTimes.map(slot => slot.split('-')[0].split(':')[0]);
                        // Checking if the selected hour falls within the available hour range
                        return selectedHour >= parseInt(startHour) && selectedHour <= parseInt(endHour);
                    });

                    // Clear existing DJ list
                    const djList = document.querySelector('.dj-list ul');
                    djList.innerHTML = '';

                    // Populate availableDJs array with the filtered DJs
                    generateDJList(availableDJsForHour);

                    // Set the selected time slot and date
                    selectedTimeSlot = selectedHour + ":00-" + (selectedHour + 1) + ":00";
                    selectedDateValue = selectedDateTime;
                } catch (error) {
                    console.error("Error fetching DJs:", error);
                }
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


});