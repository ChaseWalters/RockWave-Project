var helpBox = document.querySelector('.help-box');
    helpBox.addEventListener('click', function() {
        alert('Help will here in afew seconds');
    });


// const leftTable = document.getElementById("left-table");
// help.addEventListener('click', 
//     (params)=> {
//         leftTable.style.background = "red";
//     }
// )


document.addEventListener('DOMContentLoaded', function() {
    var rows = document.querySelectorAll("#left-table tbody tr");
    rows.forEach(function(row) {
        row.addEventListener('click', function() {
            this.style.backgroundColor = 'red';
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 300); 
        });
    });
});


document.body.addEventListener("keydown", 
    (ev)=>{
        if (ev.key === 'h'){
                alert('Help will here in afew seconds');
        }
    }
);


var startDateInput = document.getElementById('startDate');
var endDateInput = document.getElementById('endDate'); 
var errorMessage = document.getElementById('errorMessage');


function isValidDate(dateString) {
  var regEx = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/;
  if(!dateString.match(regEx)) return false; 
  var parts = dateString.split('/');
  var month = parseInt(parts[0], 10);
  var day = parseInt(parts[1], 10);
  var year = parseInt(parts[2], 10); 
  if(year < 1000 || year > 3000 || month == 0 || month > 12) return false; 
  var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) monthLength[1] = 29; 
  return day > 0 && day <= monthLength[month - 1]; 
}

function handleFormSubmission(event) {
  event.preventDefault(); 
  
  var startDate = startDateInput.value;
  var endDate = endDateInput.value;
  
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    errorMessage.style.display = 'block'; 
    return;
  }
  
  console.log('Start Date:', startDate);
  console.log('End Date:', endDate);
}

document.getElementById('searchForm').addEventListener('submit', handleFormSubmission);




const tbody = document.querySelector('.center-table tbody');

function modifyTable() {
    tbody.innerHTML = '';

    for(let i = 1; i <= 15; i++) {
        const newRow = tbody.insertRow();
        const newCell = newRow.insertCell();
        newCell.textContent = `mm/dd/yyyy Report ${i} (Updated Producer) (Updated DJ) `;
        const span = document.createElement('span');
        span.classList.add('preview-icon');
        span.innerHTML = '&#128065;'; // Eye icon
        newCell.appendChild(span);
    }

    document.querySelector('.center-table').style.textAlign = 'center';
}

modifyTable();



document.addEventListener('DOMContentLoaded', function() {
    let djSchedule = {
        DJ1: { date: "01/02/2024", name: "DJ1", genre: "Dj1 genre" },
        DJ2: { date: "02/03/2024", name: "DJ2", genre: "Dj2 genre" },
    };

    function updateTable() {
        let rows = document.querySelectorAll("#left-table tbody tr");
        
        rows.forEach((row, index) => {
            let djKey = `DJ${index + 1}`;
            let dj = djSchedule[djKey];
            
            if (dj) {
                
                row.cells[0].textContent = dj.date;
                row.cells[1].textContent = dj.name;
                
             
                if (dj.genre) {
                    if (row.cells.length < 3) {
                        let genreCell = row.insertCell(2);
                        genreCell.textContent = dj.genre;
                    } else {
                        row.cells[2].textContent = dj.genre; 
                    }
                }
            }
        });
    }

    updateTable();
});


