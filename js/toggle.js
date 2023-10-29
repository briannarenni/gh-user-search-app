let toggleBtn = document.querySelector('.toggle-btn');
let toggleBtnDark = document.querySelector('.dark-btn');
let toggleBtnLight = document.querySelector('.light-btn');
let searchInput = document.querySelector('.search-bar');
let profileCard = document.querySelector('.profile-card');
let deskContainer = document.querySelector('.desk-container');

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (prefersDark) {
  document.documentElement.setAttribute('data-theme', 'dark');
  toggleBtnDark.classList.add('hidden');
  toggleBtnLight.classList.remove('hidden');
} else {
  document.documentElement.setAttribute('data-theme', 'light');
  toggleBtnDark.classList.remove('hidden');
  toggleBtnLight.classList.add('hidden');
}

const removeShadow = (el) => {
  el.classList.toggle('no-box-shadow');
};

const currentTheme = document.documentElement.getAttribute('data-theme');

if (currentTheme === 'dark') {
  removeShadow(searchInput);
  removeShadow(profileCard);
  removeShadow(deskContainer);
}
