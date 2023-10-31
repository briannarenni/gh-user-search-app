import ky from 'https://cdn.jsdelivr.net/npm/ky@1.1.2/+esm';
import { format, parseISO } from 'https://cdn.skypack.dev/date-fns';

// ! Remove before deployment
const token =
  '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';
// ! Remove before deployment

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const errorEl = document.querySelector('#error-text');
const profileImgMobileEl = document.querySelector('#profile-img-mobile');
const profileImgDeskEl = document.querySelector('#profile-img-desk');
const nameEl = document.querySelector('#user-name');
const usernameEl = document.querySelector('#user-login');
const joinDateEl = document.querySelector('#user-joined');
const bioEl = document.querySelector('#user-bio');
const reposEl = document.querySelector('#user-repos');
const followersEl = document.querySelector('#user-followers');
const followingEl = document.querySelector('#user-following');
const locationEl = document.querySelector('#user-location');
const websiteEl = document.querySelector('#user-website');
const twitterEl = document.querySelector('#user-twitter');
const companyEl = document.querySelector('#user-company');
let usernameStr = '';

const htmlElements = [
  nameEl,
  usernameEl,
  joinDateEl,
  bioEl,
  reposEl,
  followersEl,
  followingEl,
  locationEl,
  websiteEl,
  twitterEl,
  companyEl
];

const profileKeys = [
  'name',
  'username',
  'join_date',
  'bio',
  'repos',
  'followers',
  'following',
  'location',
  'website',
  'twitter',
  'company'
];

let profile = {
  avatar_url: '',
  name: '',
  username: '',
  join_date: '',
  bio: '',
  repos: 0,
  followers: 0,
  following: 0,
  location: '',
  website: '',
  twitter: '',
  company: ''
};

// TODO 6: Handle the error state

const checkForNull = (value) => (value ? value : 'N/A');

const handleZeroValue = (value, element) => {
  if (value === 0) {
    element.textContent = 0;
    element.classList.remove('na-text');
  }
};

const handleNullValue = (value, element) => {
  const textContent = checkForNull(value);
  element.textContent = textContent;
  textContent === 'N/A' ? element.classList.add('na-text') : element.classList.remove('na-text');
  if (value === 0) {
    element.textContent = 0;
  }
};

const handleLinkStyle = (value, element, linkType) => {
  let href;
  if (value) {
    switch (linkType) {
      case 'twitter':
        href = `https://twitter.com/${value}`;
        break;
      case 'company':
        href = `https://github.com/${value.startsWith('@') ? value.substring(1) : value}`;
        break;
      default:
        href = value;
    }
    element.href = href;
    element.classList.remove('na-text');
  } else {
    element.href = '#';
    element.classList.add('na-text');
  }
};

const updateHTML = () => {
  console.log(profile);
  profileImgMobileEl.src = profile.avatar_url;
  profileImgDeskEl.src = profile.avatar_url;

  profileKeys.forEach((key, index) => {
    handleNullValue(profile[key], htmlElements[index]);
  });

  handleZeroValue(profile.repos, reposEl);
  handleZeroValue(profile.followers, followersEl);
  handleZeroValue(profile.following, followingEl);

  handleLinkStyle(profile.website, websiteEl);
  handleLinkStyle(profile.twitter, twitterEl, 'twitter');
  handleLinkStyle(profile.company, companyEl, 'company');
};

const fetchUser = (username) => {
  const baseURL = 'https://api.github.com/';

  ky.get(`${baseURL}users/${username}`, {
    headers: {
      Authorization: `token ${token}`
    }
  })
    .json()
    .then((data) => {
      const rawDate = data.created_at;
      const formattedDate = format(parseISO(rawDate), 'dd MMM yyyy');

      profile.avatar_url = data.avatar_url;
      profile.name = data.name;
      profile.username = `@${data.login}`;
      profile.join_date = `Joined ${formattedDate}`;
      profile.bio = data.bio;
      profile.repos = data.public_repos;
      profile.followers = data.followers;
      profile.following = data.following;
      profile.location = data.location;
      profile.website = data.blog;
      profile.twitter = data.twitter_username;
      profile.company = data.company;

      updateHTML();
    })
    .catch((error) => {
      console.log(error);
      if (error.response && error.response.status === 404) {
        errorEl.textContent = 'No results';
      } else {
        errorEl.textContent = 'An unexpected error occurred';
      }
    });
};

const submitSearch = (event) => {
  event.preventDefault();
  usernameStr = searchInput.value.trim();
  if (usernameStr === '') {
    errorEl.textContent = 'Field cannot be empty';
    return;
  }
  errorEl.textContent = '';
  fetchUser(usernameStr);
  updateHTML();
};

// On page load
searchInput.value = '';
fetchUser('octocat');
searchForm.addEventListener('submit', submitSearch);
