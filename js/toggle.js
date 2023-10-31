let toggleBtn = document.querySelector('.toggle-btn');
let toggleBtnDark = document.querySelector('#dark-btn');
let toggleBtnLight = document.querySelector('#light-btn');
let searchInput = document.querySelector('.search-bar');
let profileCard = document.querySelector('.profile-card');
let deskContainer = document.querySelector('.desk-container');
let currentTheme = '';
let isLargeScreen = window.matchMedia('(min-width:1024px)').matches;
let screenWidth = window.innerWidth;

// Handle box shadow responsively
const removeShadow = (el) => (el.style.boxShadow = 'none');
const addShadow = (el) => (el.style.boxShadow = '0px 16px 30px -10px rgba(70, 96, 187, 0.2)');

const responsiveShadow = () => {
  if (isLargeScreen && currentTheme === 'light') {
    addShadow(deskContainer);
    removeShadow(profileCard);
  } else if (screenWidth <= 1024 && currentTheme === 'light') {
    addShadow(profileCard);
    removeShadow(deskContainer);
  }
};

// Handle theme toggle
const setLightTheme = () => {
  document.documentElement.setAttribute('data-theme', 'light');
  currentTheme = 'light';
  toggleBtnDark.style.display = '';
  toggleBtnLight.style.display = 'none';
  addShadow(searchInput);
  responsiveShadow();
};

const setDarkTheme = () => {
  document.documentElement.setAttribute('data-theme', 'dark');
  currentTheme = 'dark';
  toggleBtnLight.style.display = '';
  toggleBtnDark.style.display = 'none';
  removeShadow(searchInput);
  removeShadow(profileCard);
  removeShadow(deskContainer);
};

const toggleScheme = () => {
  currentTheme === 'dark' ? setLightTheme() : setDarkTheme();
};

// Check user pref & update theme on page load
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
prefersDark ? setDarkTheme() : setLightTheme();

// Event handlers
toggleBtnDark.addEventListener('click', toggleScheme);
toggleBtnLight.addEventListener('click', toggleScheme);
window.addEventListener('resize', () => {
  isLargeScreen = window.matchMedia('(min-width:1024px)').matches;
  responsiveShadow();
});
