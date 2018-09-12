if (!localStorage.rideMyWayToken) {
  window.location = '../ui/login.html';
}

const ridesContainer = document.getElementsByClassName('container')[0];
const modal = document.getElementById('myModal');
const modalBody = document.getElementsByClassName('modal-body')[0];
const myRequests = [];
const requestStatus = [];

fetch('https://shrouded-plains-80012.herokuapp.com/api/v1/users/requests', {
  method: 'GET',
  headers: {
    'Content-type': 'application/json',
    token: localStorage.rideMyWayToken,
  },
}).then(response => response.json()).then((requests) => {
  if (requests.success) {
    for (let i = 0; i < requests.body.length; i += 1) {
      myRequests.push(requests.body[i].rideid);
      requestStatus.push(requests.body[i].isaccepted);
    }
  }
  return myRequests;
}).then((requests) => {
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
          let subContent = '';
          if (data.body[i].driver === localStorage.rideMyWayUserUserName) {
            subContent = '<p><strong>Status: </strong>Given</p>';
          } else if (requests.indexOf(data.body[i].id) >= 0) {
            let status = '';
            if (requestStatus[requests.indexOf(data.body[i].id)]) {
              status = 'Taken';
            } else if (requestStatus[requests.indexOf(data.body[i].id)] === null) {
              status = 'Requested';
            }
            subContent = `<p><strong>Status: </strong>${status}</p>`;
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
  }).then((data) => {
    for (let i = 0; i < data.body.length; i += 1) {
      if (new Date(data.body[i].date) >= new Date()) {
        const requestBtn = document.getElementById(`request-ride${data.body[i].id}`);
        if (data.body[i].driver !== localStorage.rideMyWayUserUserName) {
          requestBtn.addEventListener('click', (rideCopy => () => {
            fetch(`https://shrouded-plains-80012.herokuapp.com/api/v1/rides/${rideCopy.id}/requests`, {
              method: 'POST',
              headers: {
                'Content-type': 'application/json',
                token: localStorage.rideMyWayToken,
              },
            }).then(response => response.json()).then((request) => {
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
              });
            });
          })(data.body[i]));
        }
      }
    }
  });
})
  .catch((err) => {
    ridesContainer.innerHTML = `<p>${err}</p>`;
  });
