const logoutBtn = document.getElementById('logout');

logoutBtn.addEventListener('click', () => {
  localStorage.rideMyWayToken = '';
  localStorage.rideMyWayUserFirstName = '';
  localStorage.rideMyWayUserLastName = '';
  localStorage.rideMyWayUserUserName = '';
  localStorage.rideMyWayUserEmail = '';
  window.location = '../ui/index.html';
});
