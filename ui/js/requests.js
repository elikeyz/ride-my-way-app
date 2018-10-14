if (!localStorage.rideMyWayToken) {
  window.location = '../ui/login.html';
}

const container = document.getElementsByClassName('container')[0];
const modal = document.getElementById('myModal');
const modalBody = document.getElementsByClassName('modal-body')[0];
const myRides = [];

container.innerHTML = '<p>Loading...</p>';

fetch('https://shrouded-plains-80012.herokuapp.com/api/v1/rides', {
  method: 'GET',
  headers: {
    'Content-type': 'application/json',
    token: localStorage.rideMyWayToken,
  },
}).then(response => response.json()).then((data) => {
  if (data.success) {
    container.innerHTML = '';
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
      }).then(response => response.json()).then((requests) => {
        if (requests.success && requests.body.length > 0) {
          for (let k = 0; k < requests.body.length; k += 1) {
            let subContent = '';
            if (new Date(myRides[j].date) <= new Date()) {
              subContent = '<p class="expired"><em>Expired</em></p>';
            } else if (requests.body[k].isaccepted) {
              subContent = `<p class="taken"><em>Accepted</em></p> <button id="reject-req${requests.body[k].id}" class="reject submit action">Reject</button>`;
            } else if (requests.body[k].isaccepted === false) {
              subContent = `<button id="accept-req${requests.body[k].id}" class="accept submit action">Accept</button> <p class="rejected"><em>Rejected</em></p>`;
            } else if (requests.body[k].isaccepted === null) {
              subContent = `<button id="accept-req${requests.body[k].id}" class="accept submit action">Accept</button><button id="reject-req${requests.body[k].id}" class="reject submit action">Reject</button>`;
            }
            const htmlContent = `<div class="ride">            
                                 <div class="ride-body">
                                   <div class="ride-header">
                                     <h3>${requests.body[k].passenger}: ${myRides[j].location} - ${myRides[j].destination}</h3>
                                   </div>
                                   <p><strong>Date: </strong>${new Date(myRides[j].date).toDateString()}</p>
                                   <p><strong>Passenger: </strong>${requests.body[k].passenger}</p>
                                   <p><strong>Location: </strong>${myRides[j].location}</p>
                                   <p><strong>Destination: </strong>${myRides[j].destination}</p>
                                   <p><strong>Departure Time: </strong>${myRides[j].departuretime}</p>
                                   ${subContent}
                                   </div>
                                   </div>`;
            container.insertAdjacentHTML('beforeend', htmlContent);
          }
        }
        return requests;
      }).then((requests) => {
        if (requests.success && requests.body.length > 0) {
          for (let k = 0; k < requests.body.length; k += 1) {
            if (new Date(myRides[j].date) >= new Date()) {
              const acceptBtn = document.getElementById(`accept-req${requests.body[k].id}`);
              const rejectBtn = document.getElementById(`reject-req${requests.body[k].id}`);
              if (acceptBtn) {
                acceptBtn.addEventListener('click', (rideCopy => (requestCopy => () => {
                  fetch(`https://shrouded-plains-80012.herokuapp.com/api/v1/users/rides/${rideCopy.id}/requests/${requestCopy.id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-type': 'application/json',
                      token: localStorage.rideMyWayToken,
                    },
                    body: JSON.stringify({
                      accept: 'true',
                    }),
                  }).then(response => response.json()).then((accept) => {
                    let feedback = '';
                    if (accept.success) {
                      feedback = `<p>
                                  Request from ${requestCopy.passenger}<br>
                                  ${rideCopy.location} - ${rideCopy.destination}<br>
                                  ${new Date(rideCopy.date)}<br>
                                  ${rideCopy.departuretime}<br>
                                  ${accept.message}<br>
                                  <button class="submit modal-btn">Ok</button>
                                </p>`;
                    } else {
                      feedback = `<p>
                                  ${accept.message}<br>
                                  <button class="submit modal-btn">Ok</button>
                                </p>`;
                    }
                    modal.style.display = 'block';
                    modalBody.innerHTML = feedback;
                    const modalBtn = document.getElementsByClassName('modal-btn')[0];
                    modalBtn.addEventListener('click', () => {
                      modal.style.display = 'none';
                      window.location = '../ui/requests.html';
                    });
                  });
                })(requests.body[k]))(myRides[j]));
              }
              if (rejectBtn) {
                rejectBtn.addEventListener('click', (rideCopy => (requestCopy => () => {
                  fetch(`https://shrouded-plains-80012.herokuapp.com/api/v1/users/rides/${rideCopy.id}/requests/${requestCopy.id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-type': 'application/json',
                      token: localStorage.rideMyWayToken,
                    },
                    body: JSON.stringify({
                      accept: 'false',
                    }),
                  }).then(response => response.json()).then((reject) => {
                    let feedback = '';
                    if (reject.success) {
                      feedback = `<p>
                                Request from ${requestCopy.passenger}<br>
                                ${rideCopy.location} - ${rideCopy.destination}<br>
                                ${new Date(rideCopy.date)}<br>
                                ${rideCopy.departuretime}<br>
                                ${reject.message}<br>
                                <button class="submit modal-btn">Ok</button>
                              </p>`;
                    } else {
                      feedback = `<p>
                                ${reject.message}<br>
                                <button class="submit modal-btn">Ok</button>
                              </p>`;
                    }
                    modal.style.display = 'block';
                    modalBody.innerHTML = feedback;
                    const modalBtn = document.getElementsByClassName('modal-btn')[0];
                    modalBtn.addEventListener('click', () => {
                      modal.style.display = 'none';
                      window.location = '../ui/requests.html';
                    });
                  });
                })(requests.body[k]))(myRides[j]));
              }
            }
          }
        }
      });
    }
  }
}).catch((err) => {
  container.innerHTML = `<p>${err}</p>`;
});
