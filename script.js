const rockBtn = document.querySelector('.js-rock-button');
const paperBtn = document.querySelector('.js-paper-button');
const scissorsBtn = document.querySelector('.js-scissors-button');
const resetBtn = document.querySelector('.js-reset-button');
const userResult = document.querySelector('.js-result');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const scoreboardEl = document.getElementById('scoreboard');

const userPickUpdate = document.querySelector('.js-user-pick-update');
const computerPickUpdate = document.querySelector('.js-computer-pick-update');
const resultUpdate = document.querySelector('.js-result-update');

const clickSound = new Audio('audio/click.mp3');

// get stored values or fallback
let savedResult = localStorage.getItem('updated result');
let resultCount = savedResult ? JSON.parse(savedResult) : { wins: 0, loses: 0, ties: 0 };

let savedUserPick = localStorage.getItem('update userPick');
let savedComputerSelection = localStorage.getItem('update computerSelection');

// Clean up invalid or 'undefined' values
if (!savedUserPick || savedUserPick === 'undefined') savedUserPick = '';
if (!savedComputerSelection || savedComputerSelection === 'undefined') savedComputerSelection = '';

if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
}
darkModeToggle.textContent =
    localStorage.getItem('darkMode') === 'enabled'
        ? '☀️ Light Mode'
        : '🌙 Dark Mode';

// update UIfunction
function updateUI(userPickText, computerPickText, results) {
    userPickUpdate.innerHTML = userPickText ? `You picked ${userPickText}` : 'You picked';
    computerPickUpdate.innerHTML = computerPickText ? `Computer picked ${computerPickText}` : 'Computer picked';
    resultUpdate.innerHTML = `WINS: ${resultCount.wins}, LOSES: ${resultCount.loses}, TIES: ${resultCount.ties}`;
    scoreboardEl.textContent = `Score board ${results.wins}:${results.loses}`;
}

//initial page load
updateUI(savedUserPick, savedComputerSelection, resultCount);

// computer choice function
function computerPick() {
    let randomNumber = Math.random();
    if (randomNumber < 1 / 3) return 'Rock';
    else if (randomNumber < 2 / 3) return 'Paper';
    else return 'Scissors';
}

// decide result
function getResult(userPick, computerSelection) {
    if (userPick === computerSelection) return 'Tie';
    else if ((userPick === 'Rock' && computerSelection === 'Scissors') ||
        (userPick === 'Paper' && computerSelection === 'Rock') ||
        (userPick === 'Scissors' && computerSelection === 'Paper')) return 'You win';
    else return 'You lose';
}

// update counter and local storage
function updateResultCount(result, userPick, computerSelection) {
    if (result === 'You win') resultCount.wins++;
    else if (result === 'You lose') resultCount.loses++;
    else resultCount.ties++;

    //update localStorage
    localStorage.setItem('updated result', JSON.stringify(resultCount));
    localStorage.setItem('update userPick', userPick);
    localStorage.setItem('update computerSelection', computerSelection);
    updateScoreboard();
}

function flashBackground(result) {
    let color;

    const isDark = document.body.classList.contains('dark-mode');

    if (isDark) {
        // softer versions for dark mode
        if (result === 'You win') color = '#27632a';
        else if (result === 'You lose') color = '#6a1b1b';
        else color = '#665c1a';
    } else {
        // normal soft light colors
        if (result === 'You win') color = '#d4edda';
        else if (result === 'You lose') color = '#f8d7da';
        else color = '#fff3cd';
    }

    document.body.style.backgroundColor = color;

    setTimeout(() => { //fade to normal
        document.body.style.backgroundColor = '';
    }, isDark ? 400 : 200);
}

function updateScoreboard() {
    scoreboardEl.textContent = `Score board ${resultCount.wins}:${resultCount.loses}`;
}

function updateTime() {
    const now = new Date();
    document.getElementById("local-time").textContent = `⏰ ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

//main gameplay
function gamePlay(userPick) {
    let computerSelection = computerPick();
    let result = getResult(userPick, computerSelection);
    updateResultCount(result, userPick, computerSelection);             //updates counters and local storagea
    userResult.textContent = result;
    updateUI(userPick, computerSelection, resultCount);     // updates all the DOM elements
    flashBackground(result);

}

setInterval(updateTime, 1000);
updateTime();

// button listeners
rockBtn.addEventListener('click', () => {
    clickSound.play();
    rockBtn.classList.add('button-pop');
    setTimeout(() => rockBtn.classList.remove('button-pop'), 200);
    gamePlay('Rock')
});

paperBtn.addEventListener('click', () => {
    clickSound.play();
    paperBtn.classList.add('button-pop');
    setTimeout(() => paperBtn.classList.remove('button-pop'), 200);
    gamePlay('Paper')
});;

scissorsBtn.addEventListener('click', () => {
    clickSound.play();
    scissorsBtn.classList.add('button-pop');
    setTimeout(() => scissorsBtn.classList.remove('button-pop'), 200);
    gamePlay('Scissors')
});;

resetBtn.addEventListener('click', () => {
    // Remove stored value
    localStorage.removeItem('updated result');
    localStorage.removeItem('update userPick');
    localStorage.removeItem('update computerSelection');

    // reset in memory value
    resultCount = { wins: 0, loses: 0, ties: 0 };
    updateUI('', '', resultCount);
});

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    const isDark = document.body.classList.contains('dark-mode');

    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    darkModeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});
