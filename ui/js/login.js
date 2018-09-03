const usernameField = document.getElementById('username-login');
const passwordField = document.getElementById('password-login');
const submitBtn = document.getElementById('login');
const feedback = document.getElementById('feedback');

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  fetch('https://shrouded-plains-80012.herokuapp.com/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      username: usernameField.value,
      password: passwordField.value,
    }),
  }).then((response) => {
    return response.json();
  }).then((data) => {
    if (data.success) {
      localStorage.rideMyWayToken = data.accessToken;
      window.location = '../rides.html'
    } else {
      feedback.innerHTML = `<p>${data.message}</p>`
    }    
  }).catch((err) => {
    feedback.innerHTML = `<p>Sorry, there was an error experienced while logging in: ${err}</p>`
  });
});

