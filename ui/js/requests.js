if (!localStorage.rideMyWayToken) {
  window.location = '../ui/login.html';
}

const container = document.getElementsByClassName('container')[0];
const myRides = [];

fetch('https://shrouded-plains-80012.herokuapp.com/api/v1/rides', {
  method: 'GET',
  headers: {
    'Content-type': 'application/json',
    token: localStorage.rideMyWayToken,
  },
}).then(response => response.json()).then((data) => {
  if (data.success) {
    for (let i = 0; i < data.body.length; i += 1) {
      if (data.body[i].driver === localStorage.rideMyWayUserUserName) {
        myRides.push(data.body[i]);
      }
    }
    for (let j = 0; j < myRides.length; j += 1) {
      fetch(`https://shrouded-plains-80012.herokuapp.com/api/v1/users/rides/${myRides[j].id}/requests`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          token: localStorage.rideMyWayToken,
        },
      }).then(response => response.json()).then((request) => {
        if (request.success && request.body.length > 0) {
          for (let k = 0; k < request.body.length; k += 1) {
            let subContent = '';
            if (new Date(myRides[j].date) <= new Date()) {
              subContent = '<p><em>Expired</em></p>';
            } else if (request.body[k].isaccepted) {
              subContent = '<p><em>Accepted</em></p> <button id="reject-req" class="submit action">Reject</button>';
            } else if (request.body[k].isaccepted === false) {
              subContent = '<button id="accept-req" class="submit action">Accept</button> <p><em>Rejected</em></p>';
            } else if (request.body[k].isaccepted === null) {
              subContent = '<button id="accept-req" class="submit action">Accept</button><button id="reject-req" class="submit action">Reject</button>';
            }
            const htmlContent = `<div class="ride">            
                                 <div class="ride-body">
                                   <div class="ride-header">
                                     <h3>${request.body[k].passenger}: ${myRides[j].location} - ${myRides[j].destination}</h3>
                                   </div>
                                   <p><strong>Date: </strong>${new Date(myRides[j].date).toDateString()}</p>
                                   <p><strong>Passenger: </strong>${request.body[k].passenger}</p>
                                   <p><strong>Location: </strong>${myRides[j].location}</p>
                                   <p><strong>Destination: </strong>${myRides[j].destination}</p>
                                   <p><strong>Departure Time: </strong>${myRides[j].departuretime}</p>
                                   ${subContent}
                                   </div>
                                   </div>`;
            container.insertAdjacentHTML('beforeend', htmlContent);
          }
        }
      });
    }
  }
});
