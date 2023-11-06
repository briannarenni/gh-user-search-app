let toggleWrap = document.querySelector('.color-toggle');
let toggleBtnDark = document.querySelector('#dark-btn');
let toggleBtnLight = document.querySelector('#light-btn');
let searchInput = document.querySelector('.search-bar');
let profileCard = document.querySelector('.profile-card');
let deskContainer = document.querySelector('.desk-container');
let isLargeScreen = window.matchMedia('(min-width:1024px)').matches;

// Handle box shadow responsively
const removeShadow = (el) => (el.style.boxShadow = 'none');
const addShadow = (el) => (el.style.boxShadow = '0px 16px 30px -10px rgba(70, 96, 187, 0.2)');

const responsiveShadow = () => {
  if (isLargeScreen && document.documentElement.getAttribute('data-theme') === 'light') {
    addShadow(deskContainer);
    removeShadow(profileCard);
  } else if (!isLargeScreen && document.documentElement.getAttribute('data-theme') === 'light') {
    addShadow(profileCard);
    removeShadow(deskContainer);
  }
};

// Handle theme toggle
const setLightTheme = () => {
  document.documentElement.setAttribute('data-theme', 'light');
  toggleBtnDark.style.display = '';
  toggleBtnLight.style.display = 'none';
  addShadow(searchInput);
  responsiveShadow();
};

const setDarkTheme = () => {
  document.documentElement.setAttribute('data-theme', 'dark');
  toggleBtnLight.style.display = '';
  toggleBtnDark.style.display = 'none';
  removeShadow(searchInput);
  removeShadow(profileCard);
  removeShadow(deskContainer);
};

const setFavicon = () => {
  const favicon = document.querySelector('link[rel="icon"]');
  favicon.href = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? '../assets/dark-favicon.ico'
    : '../assets/light-favicon.ico';
};

const toggleTheme = () => {
  document.documentElement.getAttribute('data-theme') === 'dark' ? setLightTheme() : setDarkTheme();
};

toggleBtnDark.addEventListener('click', toggleTheme);
toggleBtnLight.addEventListener('click', toggleTheme);
window.addEventListener('resize', () => {
  isLargeScreen = window.matchMedia('(min-width:1024px)').matches;
  responsiveShadow();
});

// Check user pref & update theme on page load
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
prefersDark ? setDarkTheme() : setLightTheme();
setFavicon();
