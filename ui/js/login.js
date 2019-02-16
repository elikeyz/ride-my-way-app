const usernameField = document.getElementById('username-login');
const passwordField = document.getElementById('password-login');
const submitBtn = document.getElementById('login');
const feedback = document.getElementById('feedback');

const login = (data) => {
  if (data.success) {
    localStorage.rideMyWayToken = data.accessToken;
    localStorage.rideMyWayUser = JSON.stringify({
      firstname: data.user.firstname,
      lastname: data.user.lastname,
      email: data.user.email,
      username: data.user.username,
    });
    window.location = '../ui/rides.html';
  } else {
    feedback.innerHTML = `<p>${data.message}</p>`;
  }
};

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  feedback.innerHTML = '<p>Logging in...</p>';
  fetch('https://shrouded-plains-80012.herokuapp.com/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      username: usernameField.value,
      password: passwordField.value,
    }),
  })
    .then(response => response.json())
    .then(login)
    .catch((err) => {
      feedback.innerHTML = `<p>Sorry, there was an error experienced while logging in: ${err}</p>`;
    });
});
