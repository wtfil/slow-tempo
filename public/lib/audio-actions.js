var Reflux = require('reflux');
var audio = new Audio();
var currentRiff;

var actions = Reflux.createActions({
	setFile: {
		children: ['completed']
	},
	changePosition: {
		children: ['completed']
	},
	addRiff: {},
	updateRiff: {},
	deleteSong: {},
	changeName: {},
	play: {},
	pause: {},
	speedUp: {},
	slowDown: {},
	jumpForward: {},
	jumpBack: {},
	changeTempo: {},
	pausePlay: {},
	changeDuration: {},
	changeSong: {},
	playRiff: {},
	deleteRiff: {}
});

audio.addEventListener('loadedmetadata', () => {
	actions.changeDuration(audio.duration);
});
audio.addEventListener('timeupdate', () => {
	var time = audio.currentTime;
	if (currentRiff && time > currentRiff.to) {
		audio.currentTime = currentRiff.from;
	} else {
		actions.changePosition.completed(audio.currentTime);
	}
});

actions.changePosition.listen(function (position) {
	audio.currentTime = position;
	this.completed(position);
});
actions.speedUp.listen(function () {
	actions.changeTempo(audio.playbackRate += 0.1);
});
actions.slowDown.listen(function () {
	actions.changeTempo(audio.playbackRate -= 0.1);
});
actions.jumpForward.listen(function () {
	audio.currentTime += 5;
});
actions.jumpBack.listen(function () {
	audio.currentTime -= 5;
});
actions.changeTempo.listen(function (tempo) {
	audio.playbackRate = tempo;
});
actions.play.listen(function () {
	audio.play();
});
actions.pause.listen(function () {
	audio.pause();
});

actions.pausePlay.listen(function () {
	if (audio.paused) {
		actions.play();
	} else {
		actions.pause();
	}
});

actions.setFile.listen(function (file) {
	if (!file) {
		return;
	}
	var reader = new FileReader();
	reader.onerror = console.error.bind(console);
	reader.onload = (e) => this.completed(e.target.result);
	reader.readAsDataURL(file);
});

actions.setFile.completed.listen(function (src) {
	audio.src = src;
	actions.play();
});

function updateRiff(riff) {
	currentRiff = riff;
	if (riff) {
		audio.currentTime = riff.from;
	}
}

actions.changeSong.listen(function (song) {
	if (!currentRiff && audio.src === song.src) {
		return actions.pausePlay();
	}
	audio.src = song.src;
	currentRiff = null;
	actions.play();
});
actions.playRiff.listen(function (data) {
	if (data.riff === currentRiff) {
		return actions.pausePlay();
	}
	audio.src = data.song.src;
	updateRiff(data.riff);
	actions.play();
});

module.exports = actions;
