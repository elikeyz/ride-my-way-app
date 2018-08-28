const menuIcon = document.getElementById('menu-icon');
const menu = document.getElementsByClassName('header');

menuIcon.addEventListener('click', () => {
  if (menu[0].style.display === 'flex') {
    menu[0].style.display = 'none';
  } else {
    menu[0].style.display = 'flex';
  }
});
