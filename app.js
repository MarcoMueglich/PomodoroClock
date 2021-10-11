// Variables & Objects --------------------------------------
let timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    finishedWorkphases: 0,
};

let interval;

var audio = new Audio('bowl.mp3');

// Functions ------------------------------------------------
let getRemainingTime = (endTime) => {
    const currentTime = Date.parse(new Date());
    const diff = endTime - currentTime;

    const total = Number.parseInt(diff / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);

    return {
        total,
        minutes,
        seconds,
    };
};

let playConversionSound = () => {
    audio.play();
};

let changeBGColor = (mode) => {
    document.body.style.background = `radial-gradient(transparent 50%, var(--${mode}-bg-color-dark)), var(--${mode}-bg-color-light)`;
};

let changeMode = (mode) => {
    timer.mode = mode;
    timer.remainingTime = {
        total: timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0,
    };

    changeBGColor(mode);
    document
        .querySelectorAll('.modeBtn')
        .forEach((element) => element.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    updateTimer();
};

let updateTimer = () => {
    let { remainingTime } = timer;
    const minutes =
        remainingTime.minutes < 10
            ? '0' + remainingTime.minutes
            : remainingTime.minutes;
    const seconds =
        remainingTime.seconds < 10
            ? '0' + remainingTime.seconds
            : remainingTime.seconds;
    document.querySelector('.timer').textContent = minutes + ':' + seconds;
};

let startTimer = () => {
    changeBGColor(timer.mode);
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;

    interval = setInterval(() => {
        timer.remainingTime = getRemainingTime(endTime);
        updateTimer();

        total = timer.remainingTime.total;
        if (total <= 0) {
            clearInterval(interval);
            if (timer.mode == 'pomodoro') {
                timer.finishedWorkphases++;
                if (timer.finishedWorkphases % timer.longBreakInterval == 0) {
                    changeMode('longBreak');
                    playConversionSound();
                } else {
                    changeMode('shortBreak');
                    playConversionSound();
                }
            } else {
                changeMode('pomodoro');
                playConversionSound();
            }
            startTimer();
        }
    }, 1000);
};

let stopTimer = () => {
    changeBGColor('idle');
    clearInterval(interval);
};

let resetTimer = () => {
    stopTimer();
    changeMode(timer.mode);
    changeBGColor('idle');
    updateTimer();
};

let showInfo = () => {
    document.getElementById('infoModal').style.display = 'block';
};

let showSettings = () => {
    document.getElementById('workInput').value = timer.pomodoro;
    document.getElementById('breakInput').value = timer.shortBreak;
    document.getElementById('longBreakInput').value = timer.longBreak;
    document.getElementById('intervalInput').value = timer.longBreakInterval;
    document.getElementById('settingsModal').style.display = 'block';
};

let closeInfo = () => {
    document.getElementById('infoModal').style.display = 'none';
};

let closeSettings = () => {
    document.getElementById('settingsModal').style.display = 'none';
};

let changeSettings = () => {
    stopTimer();
    timer = {
        pomodoro: document.getElementById('workInput').value,
        shortBreak: document.getElementById('breakInput').value,
        longBreak: document.getElementById('longBreakInput').value,
        longBreakInterval: document.getElementById('intervalInput').value,
        finishedWorkphases: 0,
    };

    closeSettings();
    initClock();
};

let initClock = () => {
    changeMode('pomodoro');
    changeBGColor('idle');
};

// Event Listeners for Control Buttons ----------------------
document.getElementById('startBtn').addEventListener('click', startTimer);
document.getElementById('stopBtn').addEventListener('click', stopTimer);
document.getElementById('settingsBtn').addEventListener('click', showSettings);
document.getElementById('infoBtn').addEventListener('click', showInfo);
document.getElementById('closeInfoBtn').addEventListener('click', closeInfo);
document
    .getElementById('closeSettingsBtn')
    .addEventListener('click', closeSettings);
document.getElementById('acceptBtn').addEventListener('click', changeSettings);

// Close Modal when clicking outside of it
window.onclick = (event) => {
    if (event.target == document.getElementById('infoModal')) {
        closeInfo();
    } else if (event.target == document.getElementById('settingsModal')) {
        closeSettings();
    }
};

// Initialization -------------------------------------------
initClock();
