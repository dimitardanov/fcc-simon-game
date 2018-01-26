
// Notes
const FREQUENCIES = [
  329.628 / 2,      // green
  440,              // red
  277.18,           // yellow
  329.628           // blue
];

const NOTEDURATION = 0.3;

const Audio = require('./lib/audio.js').Audio;
var audio;

const btnContainerHTML = document.querySelector('.container');

const btnColor = [
  document.querySelector('[data-sound="0"]'),
  document.querySelector('[data-sound="1"]'),
  document.querySelector('[data-sound="2"]'),
  document.querySelector('[data-sound="3"]')
];

const gameControls = document.querySelector('.game-controls');

const onSwitchHTML = document.querySelector('.on-switch');
const btnStartHTML = document.querySelector('.btn-start');
const btnStrictHTML = document.querySelector('.btn-strict');

const statusHTML = document.querySelector('.status-display');

const bodyHTML = document.querySelector('body');

onSwitchHTML.addEventListener('click', function(event) {
  if (!onSwitchHTML.classList.contains('on')) {
    turnSimonOn();
  } else {
    turnSimonOff();
  }
  onSwitchHTML.classList.toggle('on');
  statusHTML.classList.toggle('on');
  btnStrictHTML.classList.toggle('on');
});

function turnSimonOn() {
  btnStartHTML.addEventListener('click', startGame);
  btnStrictHTML.addEventListener('click', toggleStrictMode);
}

function turnSimonOff() {
  btnStartHTML.removeEventListener('click', startGame);
  btnStrictHTML.removeEventListener('click', toggleStrictMode);
  btnContainerHTML.removeEventListener('click', colorButtonHandler);
  statusHTML.textContent = '--';
  audio.rampDownGainsFor(0.2);
}

function startGame(event) {
  newGame();
  if (!audio) {
    audio = new Audio();
    audio.startOscillators();
  }
}

function newGame() {
  var seq = createGameSequence(4, 20);
  gameControls.setAttribute('data-sequence', seq);
  statusHTML.textContent = 1;
  statusHTML.setAttribute('data-step', 0);
  setTimeout(function() {
    playSequence(seq[0]);
    btnContainerHTML.addEventListener('click', colorButtonHandler);
  }, 500);
}

function toggleStrictMode(event) {
  event.target.classList.toggle('active');
}

function playSoundFor(ind) {
  var noteFrequency = FREQUENCIES[ind];
  audio.playSoundFor(noteFrequency, NOTEDURATION);
}

function colorButtonHandler(event) {
  if (event.target.classList.contains('color-button')) {
    var ind = Number(event.target.getAttribute('data-sound'));
    colorButtonFeedback(ind);
    playSoundFor(ind);
    var level = Number(statusHTML.textContent) - 1;
    var stepInd = Number(statusHTML.getAttribute('data-step'));
    var seq = gameControls.getAttribute('data-sequence');
    btnContainerHTML.removeEventListener('click', colorButtonHandler);
    if (seq[stepInd] == ind) {
      stepInd++;
      statusHTML.setAttribute('data-step', stepInd);
      continueGame(true);
    } else {
      continueGame(false);
    }
  }
}

function continueGame(correct) {
  var level = Number(statusHTML.textContent);
  var stepInd = Number(statusHTML.getAttribute('data-step'));
  var seq = gameControls.getAttribute('data-sequence');
  if (correct) {
    if (stepInd <= level - 1) {
      btnContainerHTML.addEventListener('click', colorButtonHandler);
    } else if (level == seq.length) {
      gameOverSequence();
      setTimeout(function() {
        newGame();
      }, 2000);
    } else {
      level++;
      setTimeout(function() {
        statusHTML.setAttribute('data-step', 0);
        statusHTML.textContent = level;
        setTimeout(function() {
          playSequence(seq.slice(0, level));
          btnContainerHTML.addEventListener('click', colorButtonHandler);
        }, 500);
      }, 1000);
    }
  } else {
    statusHTML.textContent = '!!';
    statusHTML.setAttribute('data-step', 0);
    if (btnStrictHTML.classList.contains('active')) {
      level = 1;
    }
    setTimeout(function() {
      statusHTML.textContent = level;
      playSequence(seq.slice(0, level));
      btnContainerHTML.addEventListener('click', colorButtonHandler);
    }, 1000);
  }
}

function colorButtonFeedback(ind) {
  btnColor[ind].classList.add('active');
  setTimeout(function() {
    btnColor[ind].classList.remove('active');
  }, 500);
}

function createGameSequence(n, len) {
  var seq = [];
  for (var i = 0; i < len; i++) {
    seq.push(Math.floor(Math.random() * n));
  }
  return seq.join('');
}

function playSequence(seq) {
  if (seq.length > 0 && onSwitchHTML.classList.contains('on')) {
    var ind = Number(seq[0]);
    colorButtonFeedback(ind);
    playSoundFor(ind);
    setTimeout(function() {
      playSequence(seq.slice(1));
    }, 1000);
  }
}

function gameOverSequence() {
  statusHTML.textContent = '+1';
  for (var i = 0; i < 3; i++) {
    setTimeout(function() {
      for (var j = 0; j < 4; j++) {
        btnColor[j].classList.add('active');
      }
    }, 500 * i);
    setTimeout(function() {
      for (var j = 0; j < 4; j++) {
        btnColor[j].classList.remove('active');
      }
    }, 500 * i + 200);
  }
}
