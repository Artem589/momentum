import playList from "./playList.js";

const time = document.querySelector('.time');
const day = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const firstName = document.querySelector('.name');
const body = document.querySelector('body');
const slidePrev = document.querySelector('.slide-prev');
const slideNext = document.querySelector('.slide-next');

// Weather UI
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');

// quote
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote')

const quoteUrl = `https://type.fit/api/quotes`;
// const API_KEY = 'f5fdf807386918df4534391f094f007c';
const API_KEY = '08f2a575dda978b9c539199e54df03b0';

// player
const audio = document.querySelector('audio');
const playBtn = document.querySelector('.play');
const playPrevBtn = document.querySelector('.play-prev');
const playNextBtn = document.querySelector('.play-next');
const playListContainer = document.querySelector('.play-list');



let randomNum = getRandomNum(1, 20);
let playNum = 0;
let isPlay = false;

audio.src = audio.src = playList[playNum].src;

playList.forEach(track => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = track.title;
    playListContainer.append(li);
});

const playItem = document.querySelectorAll('.play-item');
playListContainer.children[0].classList.add('current-track');

// Play btn
function playAudio() {
    if (!isPlay) {
        console.log(isPlay)
        audio.currentTime = 0;
        audio.play();
        toggleBtn();
        isPlay = true;
    } else {
        console.log(isPlay)
        audio.pause();
        toggleBtn();
        isPlay = false;
    }
}

// Next track
function playNext() {
    if (playNum < playList.length - 1) {
        playNum++;
        console.log(playList)
        audio.src = playList[playNum].src;
    } else {
        playNum = 0;
        audio.src = playList[playNum].src;
    }
    checkPlay();
    currentTrack(playItem);
};


// Prev track
function playPrev() {
    
    if (playNum > 0) {
        playNum--;
        audio.src = playList[playNum].src;
    } else {
        playNum = playList.length - 1
        console.log(`prev: ${playNum}`)
        audio.src = playList[playNum].src;
    };
    checkPlay();
    currentTrack(playItem);
   
};

function toggleBtn() {
    playBtn.classList.toggle('pause');
};

function currentTrack(el) {
    [...el].find(track => {
        track.classList.remove('current-track');
        if (track.innerHTML === playList[playNum].title) {
            track.classList.add('current-track');
        }
    })
}

function checkPlay() {
    if (isPlay) {
        audio.play();
    } else {
        audio.pause();
    };
};

// Show Time
function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    showDate();
    showGreeting();
    setTimeout(showTime, 1000);
};

// Show Date
function showDate() {
    const date = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const currentDate = date.toLocaleDateString('en-En', options);
    day.textContent = currentDate;
};
// Set Greeting
function showGreeting() {
    const timeOfDay = getTimeOfDay();
    greeting.textContent = `Good ${timeOfDay}`;

};
// Get Time of Day
function getTimeOfDay() {
    const timeOfDayArray = ['night', 'morning', 'day', 'evening'];
    const date = new Date();
    const hours = date.getHours();
    const indexOfDay = Math.floor(hours / 6);
    return timeOfDayArray[indexOfDay];
};

// Set localStorage
function setLocalStorage() {
    localStorage.setItem('name', firstName.value);
}

// Get local Storage
function getLocalStorage() {
    if (localStorage.getItem('name')) {
        firstName.value = localStorage.getItem('name');
    } else {
        firstName.value = '[Enter name]';
    }
}

// Set background

function setBg() {
    const timeOfDay = getTimeOfDay();
    const bgNum = `${randomNum}`.padStart(2, '0');
    const img = new Image();
    img.src = `./assets/img/night/${bgNum}.jpg`;
    img.onload = () => {
        body.style.background = `url('${img.src}')`
    };

    console.log(timeOfDay);
    console.log(bgNum);

    switch (timeOfDay) {
        case 'night':
            body.style.background = `url('./assets/img/night/${bgNum}.jpg')`;
            break;
        case 'morning':
            body.style.background = `url('./assets/img/morning/${bgNum}.jpg')`;
            break;
        case 'day':
            body.style.background = `url('./assets/img/day/${bgNum}.jpg')`;
            break;
        case 'evening':
            body.style.background = `url('./assets/img/evening/${bgNum}.jpg')`;
            break;
        default:
            alert('none')
    }
}

// Random number
function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Slider prev and next

function getSlideNext() {
    if (randomNum < 20) {
        randomNum++;
    } else {
        randomNum = 1;
    }
    setBg();
};

function getSlidePrev() {
    if (randomNum > 1) {
        randomNum--;
    } else {
        randomNum = 20;
    }
    setBg();
};

// Get weather
async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.ceil(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
};

function setCity(event) {
    if (event.code === 'Enter') {
        getWeather();
        city.blur();
    }
};


// get quotes 
function getQuotes() {
    fetch(quoteUrl)
        .then(res => res.json())
        .then(data => {
            const idx = getRandomNum(0, data.length)
            quote.textContent = data[idx].text;
            author.textContent = data[idx].author;
            console.log(data);
        });
}






showTime();
setBg(randomNum);
slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);
window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);


document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);
changeQuote.addEventListener('click', getQuotes);

playBtn.addEventListener('click', playAudio);
playPrevBtn.addEventListener('click', playPrev);
playNextBtn.addEventListener('click', playNext);






