const correctSound = new Audio("./assets/correctSound.mp3");
const incorrectSound = new Audio("./assets/incorrectSound.mp3");

export function playCorrectSound() {
    correctSound.currentTime = 0; 
    correctSound.play();
}

export function playIncorrectSound() {
    incorrectSound.currentTime = 0;
    incorrectSound.volume = 0.15;
    incorrectSound.play();
}