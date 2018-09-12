if (!localStorage.rideMyWayToken) {
  window.location = '../ui/login.html';
}

const userInfo = document.getElementsByClassName('user-info')[0];
const container = document.getElementsByClassName('container')[0];
let givenRidesCount = 0;

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
        givenRidesCount += 1;
        const htmlContent = `<div class="ride">                    
                                <div class="ride-body">
                                  <div class="ride-header">
                                    <h3>${data.body[i].location} - ${data.body[i].destination}</h3>
                                  </div>
                                  <p><strong>Date: </strong>${new Date(data.body[i].date).toDateString()}</p>
                                  <p><strong>Driver: </strong>${data.body[i].driver}</p>
                                  <p><strong>Location: </strong>${data.body[i].location}</p>
                                  <p><strong>Destination: </strong>${data.body[i].destination}</p>
                                  <p><strong>Departure Time: </strong>${data.body[i].departuretime}</p>
                                  <p><strong>Status: </strong>Given</p>
                                </div>
                              </div>`;
        container.insertAdjacentHTML('beforeend', htmlContent);
      }
    }
    fetch('https://shrouded-plains-80012.herokuapp.com/api/v1/users/requests', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        token: localStorage.rideMyWayToken,
      },
    }).then(response => response.json()).then((requests) => {
      if (requests.success) {
        for (let j = 0; j < requests.body.length; j += 1) {
          fetch(`https://shrouded-plains-80012.herokuapp.com/api/v1/rides/${requests.body[j].rideid}`, {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
              token: localStorage.rideMyWayToken,
            },
          }).then(response => response.json()).then((ride) => {
            if (ride.success) {
              let status = '';
              if (requests.body[j].isaccepted) {
                status = 'Taken';
              } else if (requests.body[j].isaccepted === null) {
                status = 'Requested';
              }
              const htmlContent = `<div class="ride">                    
                                <div class="ride-body">
                                  <div class="ride-header">
                                    <h3>${ride.body.location} - ${ride.body.destination}</h3>
                                  </div>
                                  <p><strong>Date: </strong>${new Date(ride.body.date).toDateString()}</p>
                                  <p><strong>Driver: </strong>${ride.body.driver}</p>
                                  <p><strong>Location: </strong>${ride.body.location}</p>
                                  <p><strong>Destination: </strong>${ride.body.destination}</p>
                                  <p><strong>Departure Time: </strong>${ride.body.departuretime}</p>
                                  <p><strong>Status: </strong>${status}</p>
                                </div>
                              </div>`;
              container.insertAdjacentHTML('beforeend', htmlContent);
            }
          });
        }
        const htmlContent = `<h3>${localStorage.rideMyWayUserFirstName} ${localStorage.rideMyWayUserLastName}</h3>
                    <h4>${localStorage.rideMyWayUserEmail}</h4>
                    <h4>${localStorage.rideMyWayUserUserName}</h4>
                    <h4>Number of Rides Given: ${givenRidesCount}</h4>
                    <h4>Number of Rides Taken: ${requests.body.length}</h4>`;

        userInfo.innerHTML = htmlContent;
      }
    });
  }
});
