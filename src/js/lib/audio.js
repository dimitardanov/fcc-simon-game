var FREQUENCY = 5;
var SCALE = 0.3;
var MAINGAIN = 0.3;
var RAMPTIME = 0.2;

function Audio() {
  this.context = new AudioContext();
  // create oscillators
  this.oscMain = this.context.createOscillator();
  this.oscSec = this.context.createOscillator();
  this.tremoloOsc = this.context.createOscillator();
  // create gains
  this.gainNodeMain = this.context.createGain();
  this.gainNodeSec = this.context.createGain();
  this.tremoloGain = this.context.createGain();
  // mute gains
  this.gainNodeMain.gain.setValueAtTime(0, this.context.currentTime);
  this.gainNodeSec.gain.setValueAtTime(0, this.context.currentTime);
  this.tremoloGain.gain.setValueAtTime(0, this.context.currentTime);
  // wire nodes
  this.oscMain.connect(this.gainNodeMain);
  this.gainNodeMain.connect(this.context.destination);
  this.oscSec.connect(this.gainNodeSec);
  this.gainNodeSec.connect(this.context.destination);
  this.tremoloOsc.connect(this.tremoloGain);
  this.tremoloGain.connect(this.gainNodeSec.gain);
}

Audio.prototype.setFrequencies = function(mainFrequency) {
  this.oscMain.frequency.setValueAtTime(
    mainFrequency, this.context.currentTime);
  this.oscSec.frequency.setValueAtTime(
    mainFrequency * 2, this.context.currentTime);
  // Set tremolo value
  this.tremoloOsc.frequency.setValueAtTime(FREQUENCY, this.context.currentTime);
};

Audio.prototype.startOscillators = function() {
  this.oscMain.start(0);
  this.oscSec.start(0);
  this.tremoloOsc.start(0);
};

Audio.prototype.rampUpGainsFor = function(seconds) {
  this.tremoloGain.gain.setValueAtTime(SCALE, this.context.currentTime);
  this.gainNodeMain.gain.linearRampToValueAtTime(
    MAINGAIN, this.context.currentTime + seconds);
  this.gainNodeSec.gain.linearRampToValueAtTime(
    SCALE, this.context.currentTime + seconds);
};

Audio.prototype.playSoundFor = function(frequency, seconds) {
  this.setFrequencies(frequency);
  this.rampUpGainsFor(RAMPTIME);
  setTimeout(function() {
    this.rampDownGainsFor(0.01);
  }.bind(this), seconds * 1000);
};

Audio.prototype.rampDownGainsFor = function(seconds) {
  this.gainNodeMain.gain.linearRampToValueAtTime(
    0, this.context.currentTime + seconds);
  this.gainNodeSec.gain.linearRampToValueAtTime(
    0, this.context.currentTime + seconds);
  this.tremoloGain.gain.linearRampToValueAtTime(
    0, this.context.currentTime + seconds);
};

module.exports = {
  Audio: Audio
};
