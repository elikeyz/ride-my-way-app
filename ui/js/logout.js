const logoutBtn = document.getElementById('logout');

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('rideMyWayToken');
  localStorage.removeItem('rideMyWayUser');
  window.location = '../ui/index.html';
});
