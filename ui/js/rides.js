if (!localStorage.rideMyWayToken) {
  window.location = '../ui/login.html';
}

const ridesContainer = document.getElementsByClassName('container')[0];


fetch('https://shrouded-plains-80012.herokuapp.com/api/v1/rides', {
  method: 'GET',
  headers: {
    'Content-type': 'application/json',
    token: localStorage.rideMyWayToken,
  },
}).then(response => response.json()).then((data) => {
  if (data.success) {
    for (let i = 0; i < data.body.length; i += 1) {
      if (new Date(data.body[i].date) >= new Date()) {
        let htmlContent = '';
        if (data.body[i].driver === localStorage.rideMyWayUserUserName) {
          htmlContent = `<div class="ride">
        <div class="ride-body">
          <div class="ride-header">
              <h3>${data.body[i].location} - ${data.body[i].destination}</h3>
          </div>
          <p><strong>Date: </strong>${new Date(data.body[i].date).toDateString()}</p>
          <p><strong>Driver: </strong>${data.body[i].driver}</p>
          <p><strong>Location: </strong>${data.body[i].location}</p>
          <p><strong>Destination: </strong>${data.body[i].destination}</p>
          <p><strong>Departure Time: </strong>${data.body[i].departuretime}</p>
          </div></div>`;
          ridesContainer.insertAdjacentHTML('beforeend', htmlContent);
        } else {
          htmlContent = `<div class="ride">
          <div class="ride-body">
            <div class="ride-header">
                <h3>${data.body[i].location} - ${data.body[i].destination}</h3>
            </div>
            <p><strong>Date: </strong>${new Date(data.body[i].date).toDateString()}</p>
            <p><strong>Driver: </strong>${data.body[i].driver}</p>
            <p><strong>Location: </strong>${data.body[i].location}</p>
            <p><strong>Destination: </strong>${data.body[i].destination}</p>
            <p><strong>Departure Time: </strong>${data.body[i].departuretime}</p>
            <button id="request-ride" class="submit request">Request Ride</button>
            </div></div>`;
          ridesContainer.insertAdjacentHTML('beforeend', htmlContent);
        }
      }
    }
  } else {
    ridesContainer.innerHTML = `<p>${data.message}</p>`;
  }
}).catch((err) => {
  ridesContainer.innerHTML = `<p>${err}</p>`;
});
