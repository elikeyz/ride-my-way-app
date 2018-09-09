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
    const htmlContent = `<h3>${localStorage.rideMyWayUserFirstName} ${localStorage.rideMyWayUserLastName}</h3>
                    <h4>${localStorage.rideMyWayUserEmail}</h4>
                    <h4>${localStorage.rideMyWayUserUserName}</h4>
                    <h4>Number of Rides Given: ${givenRidesCount}</h4>
                    <h4>Number of Rides Taken: 0</h4>`;

    userInfo.innerHTML = htmlContent;
  }
});
