if (!localStorage.rideMyWayToken) {
  window.location = '../ui/login.html';
}

const rideForm = document.getElementsByTagName('form')[0];
const dateField = document.getElementById('new-date');
const locationField = document.getElementById('new-location');
const destinationField = document.getElementById('new-destination');
const timeField = document.getElementById('new-time');
const modal = document.getElementById('myModal');
const modalBody = document.getElementsByClassName('modal-body')[0];
const modalBtn = document.getElementsByClassName('modal-btn')[0];

const rideOfferSuccess = (data) => {
  const feedback = `<p>${data.message}</p>`;
  modal.style.display = 'block';
  modalBody.insertAdjacentHTML('afterbegin', feedback);
  modalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    if (data.success) {
      window.location = '../ui/rides.html';
    }
  });
};

const rideOfferFail = (err) => {
  const feedback = `<p>${err}</p>`;
  modal.style.display = 'block';
  modalBody.insertAdjacentHTML('afterbegin', feedback);
  modalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
};

rideForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const tripDate = new Date(`${dateField.value} ${timeField.value}`);
  fetch('https://shrouded-plains-80012.herokuapp.com/api/v1/users/rides', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.rideMyWayToken,
    },
    body: JSON.stringify({
      date: dateField.value,
      location: locationField.value,
      destination: destinationField.value,
      departureTime: `${tripDate.getHours()}:${tripDate.getMinutes()}`,
    }),
  })
    .then(response => response.json())
    .then(rideOfferSuccess)
    .catch(rideOfferFail);
});
