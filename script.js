const questions = [
    {
        type: "multiple-choice",
        question: "Who is the greatest leader?",
        answers: {
            a: "Adolf Hitler",
            b: "Batman",
            c: "Joseph Stalin",
        },
        correctAnswer: "a",
    },
    {
        type: "fill-in-the-blank",
        question: "Fill in the blanks:",
        words: ["attend", "were", "in", "dogs", "pride"],
        sentences: [
            {
                text: "She couldn't ___ the meeting because she was feeling unwell.",
                correctWord: "attend",
            },
            {
                text: "If I ___ you, I would apologize immediately.",
                correctWord: "were",
            },
            {
                text: "He is interested ___ learning new languages.",
                correctWord: "in",
            },
            { text: "It’s raining cats and ___ .", correctWord: "dogs" },
            { text: "She takes ___ in her work.", correctWord: "pride" },
        ],
    },
    {
        type: "match-words",
        question: "Match words to their definitions:",
        words: ["dog", "gratitude", "criticism", "entitlement"],
        definitions: [
            { text: "A domesticated carnivorous mammal.", correctWord: "dog" },
            { text: "The quality of being thankful.", correctWord: "gratitude" },
            { text: "Expressing strong disapproval.", correctWord: "criticism" },
            { text: "Having the right to do something.", correctWord: "entitlement" },
        ],
    },
    {
        type: "true-or-false",
        question: "True or False:",
        statements: [{ text: "The sun is a planet", correctAnswer: "false" }],
    },
];

let currentQuestionIndex = 0;
let numCorrect = 0;
let startTime;
let timerInterval;

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const now = new Date();
    const elapsedTime = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    document.getElementById("timer").textContent = `Time: ${minutes}:${seconds < 10 ? "0" : ""
        }${seconds}`;
}

function buildQuiz() {
    const quizContainer = document.getElementById("quiz");
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.type === "multiple-choice") {
        const answers = [];
        for (let letter in currentQuestion.answers) {
            answers.push(
                `
<div class="list-group">
    <label class="list-group-item custom-radio">
        <input class="form-check-input me-1" type="radio" name="question${currentQuestionIndex}" value="${letter}">
        ${currentQuestion.answers[letter]}
    </label>
</div>`
            );
        }

        quizContainer.innerHTML = `
            <div class="question mb-4">
                <p class="lead">${currentQuestion.question}</p>
                <div class="answers">${answers.join("")}</div>
            </div>
        `;
    } else if (currentQuestion.type === "fill-in-the-blank") {
        const sentences = currentQuestion.sentences
            .map(
                (sentence, index) =>
                    `<tr id="question${index}">
                <td>${index + 1}. ${sentence.text
                        .split("___")
                        .join(
                            `<div class="dropzone" id="dropzone${index}" ondrop="drop(event)" ondragover="allowDrop(event)"></div>`
                        )} <span class="" id="${index}"></span></td>
            </tr>`
            )
            .join("");

        quizContainer.innerHTML = `
            <h2 class="my-4">${currentQuestion.question}</h2>
            <p>Drag and drop the words into the correct blanks to complete the sentences.</p>
            <div id="words">
                ${currentQuestion.words
                .map(
                    (word) =>
                        `<div class="word" draggable="true" ondragstart="drag(event)" id="${word}">${word} </div>/`
                )
                .join("")}
            </div>
            <table class="table">
                <h3>Sentences</h3>
                ${sentences}
            </table>
        `;
    } else if (currentQuestion.type === "match-words") {
        const words = currentQuestion.words
            .map(
                (word) =>
                    `<div class="draggable-word" draggable="true" ondragstart="drag(event)" id="${word}">${word}</div>`
            )
            .join("");

        const definitions = currentQuestion.definitions
            .map(
                (definition, index) =>
                    `<div class="definition mb-3">
                <p>${index + 1}. ${definition.text}</p>
                <div class="dropzone-word" id="dropzone${index}" ondrop="drop(event)" ondragover="allowDrop(event)"></div><span class="" id="${index}"></span>
            </div>`
            )
            .join("");

        quizContainer.innerHTML = `
            <h2 class="my-4">${currentQuestion.question}</h2>
            <p>Drag and drop the words into the correct blanks to match the definitions.</p>
            <div id="words">${words}</div>
            <div id="definitions">${definitions}</div>
        `;
    } else if (currentQuestion.type === "true-or-false") {
        const statements = currentQuestion.statements
            .map(
                (statement, index) =>
                    `<p>${statement.text}</p>
                    <div class="d-flex list-group">
                        <label class="flex-column list-group-item bg-danger text-light">
                            <input name="statement${index}" type="radio" value="false"> False
                        </label>
                    </div>
                    <div class="list-group">
                         <label class="success flex-column list-group-item bg-success text-light">
                            <input name="statement${index}" type="radio" value="true"> True
                        </label>
                    </div>`
            )
            .join("");

        quizContainer.innerHTML = `
            <h2 class="my-4">${currentQuestion.question}</h2>
            ${statements}
        `;
    }

    updateCounter();
}

function showNextQuestion() {
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.type === "multiple-choice") {
        const answerContainers = document.querySelectorAll(".answers");
        const answerContainer = answerContainers[0];
        const selector = `input[name=question${currentQuestionIndex}]:checked`;
        const userAnswer = (answerContainer.querySelector(selector) || {}).value;

        if (!userAnswer) {
            alert("Please select an answer before proceeding.");
            return;
        }

        if (userAnswer === currentQuestion.correctAnswer) {
            numCorrect++; // Increment if choice is correct
        }
    } else if (currentQuestion.type === "fill-in-the-blank") {
        const sentences = currentQuestion.sentences;
        let allCorrect = true;

        sentences.forEach((sentence, index) => {
            const dropzone = document.getElementById(`dropzone${index}`);
            const droppedWord = dropzone && dropzone.textContent.trim();

            if (droppedWord !== sentence.correctWord) {
                allCorrect = false;
            }
        });

        if (allCorrect) {
            numCorrect++; // Increment if all blanks are correct
        }
    } else if (currentQuestion.type === "match-words") {
        const definitions = currentQuestion.definitions;
        let allCorrect = true;

        definitions.forEach((definition, index) => {
            const dropzone = document.getElementById(`dropzone${index}`);
            const droppedWord =
                dropzone && dropzone.firstChild && dropzone.firstChild.id;

            if (droppedWord !== definition.correctWord) {
                allCorrect = false;
            }
        });

        if (allCorrect) {
            numCorrect++; // Increment if all matches are correct
        }
    } else if (currentQuestion.type === "true-or-false") {
        const statements = currentQuestion.statements;
        let allCorrect = true;

        statements.forEach((statement, index) => {
            const selector = `input[name=statement${index}]:checked`;
            const userAnswer = (document.querySelector(selector) || {}).value;

            if (!userAnswer) {
                alert("Please select an answer before proceeding.");
                allCorrect = false;
                return;
            }

            if (userAnswer !== statement.correctAnswer) {
                allCorrect = false;
            }
        });

        if (allCorrect) {
            numCorrect++; // Increment if all answers are correct
        }
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        buildQuiz();
    } else {
        showResults();
    }

    if (currentQuestionIndex === questions.length) {
        document.getElementById("next").classList.add("d-none");
        document.getElementById("submit").classList.remove("d-none");
    }
}

// Disable reload page when the quiz starts until its over
window.onbeforeunload = function() {
    if (currentQuestionIndex < questions.length || localStorage.getItem("totalScore") === null) {
        return "You will lose your progress if you leave this page.";
    }
}

// //===========================================================================================


// // onclick Submit progress button it will be save result in the browser storage
// document.getElementById("submit").addEventListener("click", function() {
//     //save totalScore in the browser storage
//     localStorage.setItem("totalScore", numCorrect);
// })
// // when the page is loaded 
// window.onload = function() {
//     //check for totalScore if it is 0 send a welcome alert
//     if (localStorage.getItem("totalScore") === null) {
//         //send a welcome alert
//         alert("Welcome to the quiz! Good luck!");
//     } else if (localStorage.getItem("totalScore") === "50") {
//         alert("Congratulations! You scored 50% on the quiz. You're halfway there!");
//     }
// }

// //===========================================================================================


// Calculate the total score and answers correct with times spent
function showResults() {
    clearInterval(timerInterval);
    const totalTime = Math.floor((new Date() - startTime) / 1000);
    const totalMinutes = Math.floor(totalTime / 60);
    const totalSeconds = totalTime % 60;

    // Calculate correct percentage based on total correct answers
    const correctPercentage = (numCorrect / questions.length) * 100;

    // Calculate time percentage based on time spent (max 50% for 0-30 minutes)
    const timePercentage = Math.min((30 / totalMinutes) * 50, 50);

    // Calculate total score
    const totalScore = correctPercentage + timePercentage - 50;

    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = `
        <p>You got ${numCorrect} out of ${questions.length} correct.</p>
        <p>Time spent: ${totalMinutes}:${totalSeconds < 10 ? "0" : ""
        }${totalSeconds}</p>
        <p>Your total score is ${totalScore.toFixed(2)}%.</p>
    `;
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const element = document.getElementById(data);
    element.classList.add("dropzone-word");
    event.target.appendChild(element);

    const questionIndex = event.target.id.replace("dropzone", "");
    const sentence = questions[currentQuestionIndex].sentences[questionIndex];
    const word = element.textContent.trim();
}

function updateCounter() {
    document.getElementById("counter").textContent = `Question ${currentQuestionIndex + 1
        } of ${questions.length}`;
}

document.getElementById("next").addEventListener("click", showNextQuestion);
document.getElementById("submit").addEventListener("click", showResults);

buildQuiz();
startTimer();
