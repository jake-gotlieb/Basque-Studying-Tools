let quizData = [];
let shuffledQuizData = [];
let correctData = [];
let incorrectData = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;

// Function to fetch and process JSON quiz data
function selectJSONQuizFile() {
  const select = document.getElementById('quizFileSelect');
  const selectedFile = select.value;
  if (selectedFile) {
    fetch(selectedFile)
      .then(response => response.json())
      .then(data => {
        quizData = data;
        shuffleQuizData();
        displayCurrentQuestion();
      })
      .catch(error => console.error('Error loading JSON file:', error));
  }
  document.getElementById('userInput').style.display = "block";
  document.getElementById('next').style.display = "block";
  document.getElementById('finish').style.display = "block";
  document.getElementById('quizSummary').style.display = "none";
  document.getElementById('userInput').value = '';
  correctData = [];
  incorrectData = [];
  correctAnswers = 0;
  incorrectAnswers = 0;
}

// Function to shuffle the quiz data array
function shuffleQuizData() {
  shuffledQuizData = [...quizData].sort(() => Math.random() - 0.5);
}

// Function to display the current question
function displayCurrentQuestion() {
  const questionContainer = document.getElementById('questionContainer');
  questionContainer.textContent = shuffledQuizData[currentQuestionIndex].question;
}

function checkAnswer() {
  const userInput = document.getElementById('userInput').value.toLowerCase().trim();
  const currentQuestion = shuffledQuizData[currentQuestionIndex];
  const correctAnswer = currentQuestion.answer.toLowerCase().trim();

  const resultContainer = document.getElementById('resultContainer');

  if (userInput === correctAnswer) {
    correctAnswers++;
    correctData.push(currentQuestion.question + ": " + currentQuestion.answer);
    moveToNextQuestion();
  } else {
    incorrectAnswers++;
    incorrectData.push(currentQuestion.question + ": " + currentQuestion.answer);
    moveToNextQuestion();
  }
}

// Function to move to the next question
function moveToNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= shuffledQuizData.length) {
    displayQuizSummary();
  } else {
    displayCurrentQuestion();
    document.getElementById('userInput').value = ''; // Clear the text box
  }
}

// Function to display the quiz summary
function displayQuizSummary() {
  const summaryContainer = document.getElementById('quizSummary');
  summaryContainer.style.display = "block";
  summaryContainer.innerHTML = `<p>Quiz Summary:</p>
    <p>Correct Answers: ${correctAnswers}</p>
    ${correctData}
    <p>Incorrect Answers: ${incorrectAnswers}</p>
    ${incorrectData}`;
}

// Function to finish the quiz early
function finishEarly() {
  displayQuizSummary();
  document.getElementById('userInput').style.display = "none";
  document.getElementById('next').style.display = "none";
  document.getElementById('finish').style.display = "none";
}