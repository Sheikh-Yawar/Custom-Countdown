'use strict';
const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');


const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

let countdownTitle = ' ';
let countdownDate = ' ';
let countdownValue = Date;
let countdownActive;
let savedCountDown;

//*Set Date Input Min with Today's DATE
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today); 

//* Populate Countdown/ Complete UI
const updateDom = function () {
    //* Update the countdown after every second
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;

        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);

        //* Hide input
        inputContainer.hidden = true;

        //* If the countdowon has ended, show complete
        if (distance < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        }
        else {
            //* Show the countdown in progress
            //* Populate CountDown
            countdownElTitle.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;
            //*Show CountDown
            countdownEl.hidden = false;
            completeEl.hidden = true;
        }

    }, second);
}

//*Take Values from Form Input
const updateCountdown = function (e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountDown = {
        title: countdownTitle,
        date: countdownDate,
    };

    localStorage.setItem('countdown',JSON.stringify(savedCountDown));
    //*Check for valid date
    if (countdownDate === '')
        alert('Please select a date for the countdown.');
    else {
        //* Get number version of  countdownDate,updateDom
        countdownValue = new Date(countdownDate).getTime();
        updateDom();
    }
}
//* Reset all values
const reset = function () {
    completeEl.hidden = true;
    countdownEl.hidden = true;
    inputContainer.hidden = false;


    //* Stop the countdown
    clearInterval(countdownActive);

    //*Reset Value
    countdownTitle = ' ';
    countdownDate = ' ';

    localStorage.removeItem('countdown');
}

const restorePreviousCountdown=function(){
    //* Get coundown from localStorae if availabel
    if(localStorage.getItem('countdown'))
    {
        inputContainer.hidden=true;
        savedCountDown=JSON.parse(localStorage.getItem('countdown'));
        countdownTitle=savedCountDown.title;
        countdownDate=savedCountDown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDom();
    }
}

//* Event Listener
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);


//*On Load, check local storage
restorePreviousCountdown();