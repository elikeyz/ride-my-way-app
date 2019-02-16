if (!localStorage.rideMyWayToken) {
  window.location = '../ui/login.html';
}

const ridesContainer = document.getElementsByClassName('container')[0];
const modal = document.getElementById('myModal');
const modalBody = document.getElementsByClassName('modal-body')[0];
const myRequests = [];
const requestStatus = [];
const user = JSON.parse(localStorage.rideMyWayUser);

const getRequestData = (requests) => {
  if (requests.success) {
    for (let i = 0; i < requests.body.length; i += 1) {
      myRequests.push(requests.body[i].rideid);
      requestStatus.push(requests.body[i].isaccepted);
    }
  }
  return myRequests;
};

const renderRides = (data, requests) => {
  if (data.success) {
    ridesContainer.innerHTML = '';
    for (let i = 0; i < data.body.length; i += 1) {
      if (new Date(data.body[i].date) >= new Date()) {
        let htmlContent = '';
        let subContent = '';
        if (data.body[i].driver === user.username) {
          subContent = '<p class="given"><strong>Status: </strong>Given</p>';
        } else if (requests.indexOf(data.body[i].id) >= 0) {
          if (requestStatus[requests.indexOf(data.body[i].id)]) {
            subContent = '<p class="taken"><strong>Status: </strong>Taken</p>';
          } else if (requestStatus[requests.indexOf(data.body[i].id)] === null) {
            subContent = '<p class="requested"><strong>Status: </strong>Requested</p>';
          } else if (requestStatus[requests.indexOf(data.body[i].id)] === false) {
            subContent = `<button id="request-ride${data.body[i].id}" class="submit request">Request Ride</button>`;
          }
        } else {
          subContent = `<button id="request-ride${data.body[i].id}" class="submit request">Request Ride</button>`;
        }
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
                        ${subContent}
                      </div></div>`;
        ridesContainer.insertAdjacentHTML('beforeend', htmlContent);
      }
    }
  } else {
    ridesContainer.innerHTML = `<p>${data.message}</p>`;
  }
  return data;
};

const setRidesBtnListeners = (data, requests) => {
  for (let i = 0; i < data.body.length; i += 1) {
    if (new Date(data.body[i].date) >= new Date() &&
        (requests.indexOf(data.body[i].id) < 0 ||
        requestStatus[requests.indexOf(data.body[i].id)] === false)) {
      const requestBtn = document.getElementById(`request-ride${data.body[i].id}`);
      if (data.body[i].driver !== user.username) {
        requestBtn.addEventListener('click', (rideCopy => () => {
          fetch(`https://shrouded-plains-80012.herokuapp.com/api/v1/rides/${rideCopy.id}/requests`, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
              token: localStorage.rideMyWayToken,
            },
          })
            .then(response => response.json())
            .then((request) => {
              let feedback = '';
              if (request.success) {
                feedback = `<p>
                          ${rideCopy.location} - ${rideCopy.destination}<br>
                          ${new Date(rideCopy.date)}<br>
                          ${rideCopy.departuretime}<br>
                          ${request.message}<br>
                          <button class="submit modal-btn">Ok</button>
                        </p>`;
              } else {
                feedback = `<p>
                          ${request.message}<br>
                          <button class="submit modal-btn">Ok</button>
                        </p>`;
              }
              modal.style.display = 'block';
              modalBody.innerHTML = feedback;
              const modalBtn = document.getElementsByClassName('modal-btn')[0];
              modalBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                window.location = '../ui/rides.html';
              });
            });
        })(data.body[i]));
      }
    }
  }
};

ridesContainer.innerHTML = '<p>Loading...</p>';

fetch('https://shrouded-plains-80012.herokuapp.com/api/v1/users/requests', {
  method: 'GET',
  headers: {
    'Content-type': 'application/json',
    token: localStorage.rideMyWayToken,
  },
})
  .then(response => response.json())
  .then(getRequestData)
  .then((requests) => {
    fetch('https://shrouded-plains-80012.herokuapp.com/api/v1/rides', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        token: localStorage.rideMyWayToken,
      },
    })
      .then(response => response.json())
      .then(data => renderRides(data, requests))
      .then((data) => {
        if (data.success) {
          setRidesBtnListeners(data, requests);
        }
      });
  })
  .catch((err) => {
    ridesContainer.innerHTML = `<p>${err}</p>`;
  });
