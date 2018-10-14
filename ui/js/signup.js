const firstNameField = document.getElementById('first-name');
const lastNameField = document.getElementById('last-name');
const emailField = document.getElementById('email');
const usernameField = document.getElementById('username-signup');
const passwordField = document.getElementById('password-signup');
const confirmPasswordField = document.getElementById('password-confirm-signup');
const submitBtn = document.getElementById('signup');
const feedback = document.getElementById('feedback');

submitBtn.addEventListener('click', (e) => {
  feedback.innerHTML = '<p>Signing you up</p>';
  e.preventDefault();
  if (passwordField.value !== confirmPasswordField.value) {
    feedback.innerHTML = '<p>Please confirm your password</p>';
  } else {
    fetch('https://shrouded-plains-80012.herokuapp.com/api/v1/auth/signup', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstNameField.value,
        lastName: lastNameField.value,
        email: emailField.value,
        username: usernameField.value,
        password: passwordField.value,
      }),
    }).then(response => response.json()).then((data) => {
      if (data.success) {
        localStorage.rideMyWayToken = data.accessToken;
        window.location = '../ui/rides.html';
      } else {
        feedback.innerHTML = `<p>${data.message}</p>`;
      }
    }).catch((err) => {
      feedback.innerHTML = `<p>Sorry, there was an error experienced while signing up: ${err}</p>`;
    });
  }
});
