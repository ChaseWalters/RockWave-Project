document.addEventListener('DOMContentLoaded', async function() {
    async function fetchDJsFromDatabase() {
        try {
            const response = await fetch('/api/djs');
            if (!response.ok) {
                throw new Error('Failed to fetch DJs');
            }
            const djs = await response.json();
            return djs;
        } catch (error) {
            console.error('Error fetching DJs:', error);
            return [];
        }
    }
    
    async function generateLeftTableContent() {
        const leftTableBody = document.querySelector('.left-table tbody');
        let leftTableContent = '';

        const djs = await fetchDJsFromDatabase();
        djs.forEach(dj => {
            leftTableContent += `
                <tr>
                    <td>${dj.name}</td>
                </tr>
            `;
        });
        leftTableBody.innerHTML = leftTableContent;
    }
    
    async function fetchSongs() {
        try {
            const response = await fetch('/api/songs');
            if (!response.ok) {
                throw new Error('Failed to fetch songs');
            }
            const songs = await response.json();
            
            return songs;
        } catch (error) {
            console.error('Error fetching songs:', error);
            return [];
        }
    }
    
    async function generateCenterTableContent() {
        const centerTableBody = document.querySelector('.center-table tbody');
        let centerTableContent = '';
    
        const songs = await fetchSongs();
        songs.forEach(song => {
            centerTableContent += `
                <tr>
                    <td>${song.name}</td>
                    <td>${song.year}</td>
                    <td>${song.genre}</td>
                </tr>
            `;
        });
    
        centerTableBody.innerHTML = centerTableContent;
    }
    await generateLeftTableContent();
    await generateCenterTableContent();
});
function handleFormSubmission(event) {
    event.preventDefault(); 
  
    var startDateInput = document.getElementById('startDate');
    var endDateInput = document.getElementById('endDate'); 
    var errorMessage = document.getElementById('errorMessage');
  
    var startDate = startDateInput.value;
    var endDate = endDateInput.value;
  
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
        errorMessage.style.display = 'block'; 
        return;
    }
  
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
}

var helpBox = document.querySelector('.help-box');
helpBox.addEventListener('click', function() {
    alert('Help will be available shortly.');
});
