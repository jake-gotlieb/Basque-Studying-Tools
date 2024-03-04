let currentCardIndex = 0;
let flashcardsData = [];
let showClue = false; // Variable to track whether clue is shown

document.addEventListener("DOMContentLoaded", function() {
  const clueBtn = document.getElementById('clueBtn');
  clueBtn.onclick = toggleClue; // Assign the onclick handler directly
});

function selectJSONFile() {
  const select = document.getElementById('fileSelect');
  const selectedFile = select.value;
  if (selectedFile) {
    fetch(selectedFile)
      .then(response => response.json())
      .then(data => displayFlashcards(data))
      .catch(error => console.error('Error loading JSON file:', error));
  }
}

function loadJSONFile(file) {
  const reader = new FileReader();

  reader.onload = function(e) {
    const flashcards = JSON.parse(e.target.result);
    displayFlashcards(flashcards);
  }

  reader.readAsText(file);
}

function displayFlashcards(flashcards) {
  // Shuffle the flashcards array
  flashcardsData = shuffleArray(flashcards);
  showCard(currentCardIndex);
}

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function toggleClue() {
  showClue = !showClue; // Toggle the value of showClue
  showCard(currentCardIndex); // Re-render the card to update clue visibility
  console.log(showClue);
}

function nextCard() {
  currentCardIndex = (currentCardIndex + 1) % flashcardsData.length;
  showCard(currentCardIndex);
}

function prevCard() {
  currentCardIndex = (currentCardIndex - 1 + flashcardsData.length) % flashcardsData.length;
  showCard(currentCardIndex);
}

async function showCard(index) {
  const flashcardContainer = document.getElementById('flashcardContainer');
  flashcardContainer.innerHTML = '';

  const card = document.createElement('div');
  card.classList.add('flashcard');

  const front = document.createElement('div');
  front.classList.add('front');

  // Display question with pronunciation
  const question = document.createElement('h1');
  question.textContent = flashcardsData[index].question;
  const pronunciationButton = document.createElement('button');
  pronunciationButton.textContent = 'Pronounce';
  pronunciationButton.addEventListener('click', async (event) => {
    event.stopPropagation(); // Stop event propagation to prevent flipping the card
    const text = flashcardsData[index].question;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'eu'; // Set language to Basque
    speechSynthesis.speak(utterance);
  });
  front.appendChild(question);
  front.appendChild(pronunciationButton);

  // Check if the clue exists and is not an empty string
  if (showClue && flashcardsData[index].clue) {
    const clue = document.createElement('h2');
    clue.textContent = `Clue: ${flashcardsData[index].clue}`;
    front.appendChild(clue);
  }

  card.appendChild(front);

  const back = document.createElement('div');
  back.classList.add('back');
  back.innerHTML = `<h1>${flashcardsData[index].answer}</h1>`;
  card.appendChild(back);

  card.addEventListener('click', function () {
    card.classList.toggle('active');
  });

  flashcardContainer.appendChild(card);
}

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}