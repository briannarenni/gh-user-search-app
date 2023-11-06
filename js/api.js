import ky from 'https://cdn.jsdelivr.net/npm/ky@1.1.2/+esm';
import { format, parseISO } from 'https://cdn.skypack.dev/date-fns';

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

const baseURL = 'https://api.github.com/';
let usernameStr;

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

const mapApiData = (data) => {
  return {
    avatar_url: data.avatar_url,
    name: data.name,
    username: `@${data.login}`,
    join_date: `Joined ${format(parseISO(data.created_at), 'dd MMM yyyy')}`,
    bio: data.bio,
    repos: data.public_repos,
    followers: data.followers,
    following: data.following,
    location: data.location,
    website: data.blog,
    twitter: data.twitter_username,
    company: data.company
  };
};

const handleNullValue = (value, element) => {
  if (value === 0) {
    element.textContent = '0';
    element.classList.remove('na-text');
  } else {
    const textContent = typeof value === 'string' ? value.trim() || 'N/A' : value || 'N/A';
    element.textContent = textContent;
    textContent === 'N/A' ? element.classList.add('na-text') : element.classList.remove('na-text');
  }
};

const validateUrl = (url) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

const handleInvalidCompany = (element) => {
  element.style.color = 'var(--primary-text)';
  element.style.textDecoration = 'none';
  element.style.pointerEvents = 'none';
  element.setAttribute('aria-disabled', 'true');
};

const resetStyles = (element) => {
  element.style.color = '';
  element.style.textDecoration = '';
  element.style.pointerEvents = '';
  element.removeAttribute('aria-disabled');
  element.classList.remove('na-text');
};

const handleLinkStyle = (value, element, linkType) => {
  resetStyles(element);
  let href;

  if (!value) {
    element.href = '#';
    element.classList.add('na-text');
    element.setAttribute('aria-disabled', 'true');
    return;
  }

  switch (linkType) {
    case 'twitter':
      href = `https://twitter.com/${value}`;
      break;
    case 'company':
      if (value.startsWith('@') && (value.match(/@/g) || []).length === 1) {
        value.trim();
        href = `https://github.com/${value.slice(1)}`;
      } else {
        href = '#';
        handleInvalidCompany(element);
        return;
      }
      break;
    default:
      href = validateUrl(value);
  }

  element.href = href;
  element.classList.remove('na-text');
  element.setAttribute('aria-disabled', 'false');
};

const updateHTML = () => {
  console.log(profile);
  profileImgMobileEl.src = profile.avatar_url;
  profileImgDeskEl.src = profile.avatar_url;

  profileKeys.forEach((key, index) => {
    handleNullValue(profile[key], htmlElements[index]);
  });

  handleLinkStyle(profile.website, websiteEl);
  handleLinkStyle(profile.twitter, twitterEl, 'twitter');
  handleLinkStyle(profile.company, companyEl, 'company');
};

const fetchUser = (username) => {
  ky.get(`${baseURL}users/${username}`)
    .json()
    .then((data) => {
      profile = mapApiData(data);
      updateHTML();
    })
    .catch((error) => {
      console.error(error);
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
};

// On page load
searchInput.value = '';
fetchUser('octocat');
searchForm.addEventListener('submit', submitSearch);
