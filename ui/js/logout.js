const logoutBtn = document.getElementById('logout');

logoutBtn.addEventListener('click', () => {
  localStorage.rideMyWayToken = '';
  window.location = '../ui/index.html';
});
