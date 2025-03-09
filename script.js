import { playCorrectSound, playIncorrectSound } from './sound.js';

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById('start-btn');
    const quizContainer = document.getElementById("quiz-container");
    const configContainer = document.getElementById("container-config");
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
    const savedTheme = localStorage.getItem("theme") || "dark";
    body.setAttribute("data-theme", savedTheme);
    themeToggle.classList.toggle("fa-sun", savedTheme === "light");
    themeToggle.classList.toggle("fa-moon", savedTheme === "dark");
    themeToggle.addEventListener("click", () => {
        const currentTheme = body.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";

        body.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);

        // Toggle icon
        themeToggle.classList.toggle("fa-sun", newTheme === "light");
        themeToggle.classList.toggle("fa-moon", newTheme === "dark");
    });

    startButton.addEventListener("click", () => {
        configContainer.style.display = "none";
        quizContainer.style.display = "block";
        startQuiz();
    });
});

async function startQuiz() {
    const category = document.querySelector('select[name="Topic"]').value;
    const difficulty = document.querySelector('select[name="difficulty"]').value;
    const type = document.querySelector('select[name="TypeOfQuestion"]').value;
    const numQuestions = document.querySelector('select[name="NoOfQuestion"]').value;

    const url = `https://opentdb.com/api.php?amount=${numQuestions}&category=${category}&difficulty=${difficulty}&type=${type}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayQuestions(data.results);
    } catch (error) {
        console.log("Error fetching data", error);
    }
}

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

function displayQuestions(quizQuestions) {
    questions = quizQuestions; // Store questions globally
    const quizContainer = document.getElementById("quiz-container");
    const questionContainer = document.getElementById("question-container");
    const nextButton = document.getElementById("next-btn");

    showQuestion(questions[currentQuestionIndex]);

    
    nextButton.addEventListener("click", () => {
        const theme = document.documentElement.getAttribute("data-theme");
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion(questions[currentQuestionIndex]);
        } else {
            if(theme === "dark"){
                quizContainer.innerHTML = `
                    <div class="end-screen">
                        <h2 class="end-screen-text">Congratulations!</h2>
                        <h2 class="end-screen-text">Quiz Completed!</h2>
                        <p class="end-screen-text">Your score: ${score} out of ${quizQuestions.length}</p>
                        <button id="restart-btn" class="restart-btn">Restart Quiz</button>
                    </div>
                `;
            } else {
                quizContainer.innerHTML = `
                    <div class="end-screen">
                        <h2 class="end-screen-text">Congratulations!</h2>
                        <h2 class="end-screen-text">Quiz Completed!</h2>
                        <p class="end-screen-text">Your score: ${score} out of ${quizQuestions.length}</p>
                        <button id="restart-btn" class="restart-btn">Restart Quiz</button>
                    </div>
                `;
            }

            document.getElementById("restart-btn").addEventListener("click", resetQuiz);
        }
    });
}

function showQuestion(questionObj) {
    const questionContainer = document.getElementById("question-container");
    const nextButton = document.getElementById("next-btn");

    // Clear previous question
    questionContainer.innerHTML = "";

    // Display Question number
    
    const questionNum = document.createElement("div");
    questionNum.classList.add("questionNum");
    questionNum.innerText = `Question ${currentQuestionIndex+1} of ${questions.length}`;
    questionContainer.appendChild(questionNum);
    // Display the question
    const questionElement = document.createElement("div");
    questionElement.classList.add("question");
    questionElement.innerText = decodeHTML(questionObj.question);
    questionContainer.appendChild(questionElement);

    // Display answer options
    const answers = [...questionObj.incorrect_answers, questionObj.correct_answer];
    answers.sort(() => Math.random() - 0.5);

    answers.forEach(answer => {
        const button = document.createElement("button");
        button.classList.add("answer-option");
        button.innerText = decodeHTML(answer);
        button.addEventListener("click", () => {
            selectAnswer(answer, questionObj.correct_answer);
        });
        questionContainer.appendChild(button);
    });

    // Update "Next" button text on the last question
    if (currentQuestionIndex === questions.length - 1) {
        nextButton.innerText = "Finish"; // Changed to "Finish"
    } else {
        nextButton.innerText = "Next"; // Default text
    }
}

function selectAnswer(selectedAnswer, correctAnswer) {
    const buttons = document.querySelectorAll(".answer-option");
    buttons.forEach(button => {
        button.disabled = true; // Disable all buttons after selection
        if (button.innerText === correctAnswer) {
            button.classList.add("correct");
            
        } else if (button.innerText === selectedAnswer) {
            button.classList.add("incorrect");
            playIncorrectSound();
        }
    });

    if (selectedAnswer === correctAnswer) {
        playCorrectSound();
        score++;
    }
}

function resetQuiz() {
    const quizContainer = document.getElementById("quiz-container");
    const configContainer = document.getElementById("container-config");

    // Reset quiz state
    currentQuestionIndex = 0; // Reset question index
    score = 0; // Reset score
    questions = []; // Clear questions array

    configContainer.style.display = "flex";
    quizContainer.style.display = "none";

    quizContainer.innerHTML = `
        <div id="question-container">Loading...</div>
        <button id="next-btn" class="next-btn">Next</button>
    `;  
}

function decodeHTML(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}