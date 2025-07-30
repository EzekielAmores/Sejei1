// Main Game Logic

// Main Variables
// // Dice Roll Variables
let turnOrder = []; // Holds an array for the team turn order. e.g. [4, 2, 1, 3]


// // Character Selection Variables
const characterPool = ["🐉", "🦊", "🐼", "🦁"];
let usedCharacters = [];
let selectedCharacters = {}; // { teamId: character }
let currentSelectionTurnIndex = 0;

// // Plinko Variables
let currentTurnIndex = 0;
let teamWeekSelection = {}; // Example after dropping: teamWeekSelection[teamId] = basketIndex + 1;

// // Color Wheel Variables
let teamDaySelection = {}; // teamId: dayNumber (1-5)
let currentColorWheelTurn = 0; // tracks position in turnOrder

// // Stories Variables
// // Questions Variables
const teamAnswers = {
  1: [],
  2: [],
  3: [],
  4: []
};


document.addEventListener('DOMContentLoaded', () => {
  startDiceRollTab();
});

// Utility: Switch between tabs by ID
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });
  document.getElementById(tabId).classList.add("active");

  startTab(tabId);
}

function startTab(tabId){
  switch (tabId){
    case 'character-select-tab':
        startCharacterSelectionTab();
        break;
    case 'plinko-tab':
        startPlinkoTab();
        break;
    case 'color-wheel-tab':
        startColorWheelTab();
        break;
    case 'story-tab':
        startStoryTab();
        break;
    case 'question-tab':
        startQuestionTab();
        break;
    default:
        console.log("There is an error");
        break;
  }
}

// TO REMOVE REDUNDUNCY
// Render Turn Order Function
function renderTurnOrder(index) {
  // Check if turn order is empty
  if (turnOrder.length === 0){
    console.log("No team turn order");
    return;
  }

  console.log(selectedCharacters);

  // Check if characters has been selected
  if (usedCharacters.length === 0){
    console.log("No Character yet");
  }else{
    const ul = document.getElementsByClassName("turn-order-list");
    ul[index].innerHTML = "";
    turnOrder.forEach((teamId, _index) => {
        const team = teams.find(t => t.teamId === teamId);
        const char = selectedCharacters[teamId] || "❓";
        const li = document.createElement("li");
        li.textContent = `${_index + 1}. ${team.teamName} - ${char}`;
        ul[index].appendChild(li);
    });
    return;
  }


  const containers = document.getElementsByClassName("turn-order-list"); // By Class since there are a lot
  containers[index].innerHTML = turnOrder.map((teamId, index) => {
    const team = teams.find(t => t.teamId === teamId);
    return `<div>${index + 1}. ${team.teamName}</div>`;
  }).join("");
}

// Render Players Per Team Function
function renderPlayersPerTeam(index) {
  teams.forEach(team => {
    const ul = document.getElementsByClassName(`team-${team.teamId}-players`);
    ul[index].innerHTML = "";
    const members = players.filter(p => p.teamId === team.teamId);
    members.forEach(player => {
      const li = document.createElement("li");
      li.textContent = player.name;
      ul[index].appendChild(li);
    });
  });
}

// #region Dice roll logic

function startDiceRollTab(){
    // Render players per team and team order, if possible
    renderPlayersPerTeam(0); 
    renderTurnOrder(0);
}

// Object to track each team's result
const diceResults = {
  1: null,
  2: null,
  3: null,
  4: null,
};

// Object that turns dice result relative to teamId
const teamRolls = Object.entries(diceResults).map(([teamId, roll]) => ({
  teamId: parseInt(teamId),
  roll: roll
}));

// Track number of completed rolls
let rollsCompleted = 0;

// Called when a team clicks their dice button
function rollDice(teamId) {
  // Prevent rolling again
  if (diceResults[teamId] !== null) {
    alert("Your team has already rolled.");
    return;
  }

  // rolls and used rolls
  let roll;
  let usedRolls = Object.values(diceResults).filter(val => val !== null);

  // checks if roll is used
  do {
    // Generate random dice roll (1-6)
    roll = Math.floor(Math.random() * 6) + 1;
  } while (usedRolls.includes(roll));

  // Save result
  diceResults[teamId] = roll;

  // Update UI
  document.getElementById(`dice-display-${teamId}`).textContent = `Rolled: ${roll}`;
  document.getElementById(`roll-btn-${teamId}`).disabled = true;

  console.log(`Team ${teamId} rolled a ${roll}`);

  // Check if all teams have rolled to show turn order, , proceed to next tab
  if (Object.values(diceResults).every(val => val !== null)) {
    finalizeTurnOrder();
    // Proceed to next tab
    setTimeout(() => {
      alert("All teams have rolled! Moving to character selection...");
      showTab('character-select-tab');
    }, 1000);
  }
}

// Called when sorting Team order
function finalizeTurnOrder() {
  const teamRolls = Object.entries(diceResults).map(([teamId, roll]) => ({
    teamId: parseInt(teamId),
    roll
  }));

  teamRolls.sort((a, b) => a.roll - b.roll);

  turnOrder = teamRolls.map(entry => entry.teamId);
  console.log("Turn Order:", turnOrder);

  renderTurnOrder(0); // assuming showTurnOrder accepts argument
}
// #endregion

// #region Character Selection Logic

function startCharacterSelectionTab(){
    renderCharacterButtons();
    renderPlayersPerTeam(1);
    renderTurnOrder(1);
}

  // Render character buttons
function renderCharacterButtons() {
  turnOrder.forEach(teamId => {
    const container = document.getElementById(`team-${teamId}-characters`);
    container.innerHTML = "";

    characterPool.forEach(char => {
      const btn = document.createElement("button");
      btn.textContent = char;
      btn.disabled = usedCharacters.includes(char);
      btn.onclick = () => {
        if (turnOrder[currentSelectionTurnIndex] === teamId) {
          selectedCharacters[teamId] = char;
          usedCharacters.push(char);
          document.getElementById(`team-${teamId}-selected`).textContent = char;
          currentSelectionTurnIndex++;

          renderCharacterButtons(); // Re-render all buttons
          if (currentSelectionTurnIndex === 4) {
            renderTurnOrder(1);
            setTimeout(() => {
                alert("All teams have selected a character! Moving to plinko game...");
                showTab('plinko-tab');
            }, 1000);
          }
        } else {
          alert("It's not your turn yet!");
        }
      };
      container.appendChild(btn);
    });
  });
}

// #endregion

// #region Plinko Game Logic
// TODO: Simulate ball bouncing into 1 of 4 baskets
// → each basket maps to a specific "week" for the color wheel

function startPlinkoTab(){
    renderPlayersPerTeam(2);
    renderTurnOrder(2);

    // Revert back to zero
    currentTurnIndex = 0;
}

function dropBall(teamId) {
    if (teamId !== turnOrder[currentTurnIndex]){
        alert(`It's not Team ${teamId}'s turn!`);
        return;
    }

  const plinkoArea = document.getElementById(`plinko-area-team${teamId}`);
  const ball = document.createElement('div');
  ball.classList.add('plinko-ball');

  // Position ball at the top center
  ball.style.left = "50%";
  ball.style.top = "0px";
  plinkoArea.appendChild(ball);

  // Simulated animation (replace with real pin collision later)
  let position = 0;
  const interval = setInterval(() => {
    position += 5;
    ball.style.top = position + "px";

    if (position >= 200) { // end of drop
      clearInterval(interval);
    //   const basketIndex = Math.floor(Math.random() * 4); // Simulated basket 0-3
      const basketIndex = 0; // PLACEHOLDER KAY ISA PA KA WEEK
      teamWeekSelection[teamId] = basketIndex + 1;
      console.log(`Team ${teamId} ball landed in basket ${basketIndex}`);

      // Proceed to color wheel or next phase...
      // Proceed to next team's turn
      currentTurnIndex++;
      if (currentTurnIndex >= turnOrder.length) {
        // renderTurnOrder can be used to check what they spun
        setTimeout(() => {
            alert("All teams have dropped a Plinko Ball! Moving to Color Wheel...");
            showTab('color-wheel-tab');
        }, 1000);
      } else {
        alert(`Team ${teamId} ball landed in basket ${basketIndex}, Team ${turnOrder[currentTurnIndex]}'s turn!`);
        // alert(`Team ${turnOrder[currentTurnIndex]}'s turn!`);
      }
    }
  }, 50);
}

// #endregion

// #region Color Wheel Logic
// TODO: Spin wheel based on week outcome to choose 1 of 5 stories

function startColorWheelTab(){
    console.log('color wheel');
    renderPlayersPerTeam(3);
    renderTurnOrder(3);

    currentColorWheelTurn = 0;

    for (let teamId = 1; teamId <= 4; teamId++) {
      document.getElementById(`team${teamId}DayResult`).textContent = ``;
    }
}

function spinWheel(teamId) {
  const currentTeam = turnOrder[currentColorWheelTurn];

  if (teamId !== currentTeam) {
    alert(`It's not Team ${teamId}'s turn!`);
    return;
  }

  const week = teamWeekSelection[teamId];
  if (!week) {
    alert(`Team ${teamId} has not completed the Plinko drop yet.`);
    return;
  }

  // Randomly pick a day (1 to 5)
  const day = Math.floor(Math.random() * 5) + 1;
  teamDaySelection[teamId] = day;

  // Show result
  document.getElementById(`team${teamId}DayResult`).textContent = `🎯 Picked Day ${day} of Week ${week}`;

  currentColorWheelTurn++;

  if (currentColorWheelTurn >= turnOrder.length) {
    setTimeout(() => {
        alert("All teams have spun the Wheel! Moving to Story...");
        showTab('story-tab');
    }, 1000);
    // Here you can show the next tab or continue the flow
  }
}

// #endregion

// #region Story Display Logic
// TODO: Show story content and start 60-second timer
// → after timer ends, auto-advance to question tab

function startStoryTab(){
    showStoryTab();
    // renderPlayersPerTeam(3);
    // renderTurnOrder(3);
}

// Show Story Tab and start timers
function showStoryTab() {
  for (let teamId = 1; teamId <= 4; teamId++) {
    const week = teamWeekSelection[teamId];
    const day = teamDaySelection[teamId];
    const storyId = `w${week}d${day}`;
    const story = stories.find(story => story.id === storyId) || { title: "No Story", body: "No content found." };

    const teamElem = document.getElementById(`team${teamId}-story`);
    teamElem.querySelector('.story-id').innerText = storyId.toUpperCase();
    teamElem.querySelector('.story-title').innerText = story.title;
    teamElem.querySelector('.story-body').innerText = story.content;

    startStoryTimer(teamId, 3); // Start 60s countdown
  }
}

// Start 60-second timer per team
function startStoryTimer(teamId, seconds) {
  const timerSpan = document.querySelector(`#team${teamId}-story .timer`);
  let remaining = seconds;

  const interval = setInterval(() => {
    timerSpan.innerText = remaining;
    remaining--;

    if (remaining < 0) {
      clearInterval(interval);
      checkAllTimersDone(); // Proceed to question tab only if all done
    }
  }, 1000);
}

// Check if all timers have hit 0 before switching to Questions Tab
function checkAllTimersDone() {
  const allZero = [...document.querySelectorAll('.timer')].every(t => parseInt(t.innerText) <= 0);
  if (allZero) {
    // showQuestionsTab(); // You'll implement this in Phase 6
    setTimeout(() => {
        alert("Time is up! Moving to Questions...");
        showTab('question-tab');
    }, 1000);
  }
}

// #endregion

// #region Question Logic
// TODO: Render multiple choice buttons
// On click: check answer, show feedback, then return to Plinko tab

function startQuestionTab(){
    loadTeamQuestions();

    for (let teamId = 1; teamId <= 4; teamId++) {
      teamAnswers[teamId] = [];
    }
}

function loadTeamQuestions() {
  for (let teamId = 1; teamId <= 4; teamId++) {
    const container = document.getElementById(`team${teamId}-question`);
    const week = teamWeekSelection[teamId];
    const day = teamDaySelection[teamId];
    const storyKey = `w${week}d${day}`;
    const teamStory = stories.find(story => story.id === storyKey);
    const teamQuestions = questions.filter(q => q.storyId === teamStory.id);

    let qIndex = 0;

    function renderQuestion() {
      const q = teamQuestions[qIndex];
      if (!q) {
        container.innerHTML = `<p>Waiting for other teams...</p>`;
        return;
      }

      container.innerHTML = `
        <h4>Q${qIndex + 1}: ${q.question}</h4>
        <div>
          ${q.options.map(option => `
            <button class="btn btn-outline-primary mb-1" 
            data-team="${teamId}"
            data-question="${q.id}"
            onclick="selectAnswer(${teamId}, '${q.id}', '${option}', ${qIndex})">
              ${option}
            </button>
          `).join('')}
        </div>
      `;
    }

    function nextQuestion() {
      qIndex++;
      renderQuestion();
    }

    container.renderQuestion = renderQuestion;
    container.nextQuestion = nextQuestion;

    renderQuestion();
  }
}

function selectAnswer(teamId, questionId, selected, qIndex) {
  const question = questions.find(q => q.id == questionId);
  const isCorrect = selected === question.answer;

  teamAnswers[teamId].push({ questionId, selected, isCorrect });

  if (isCorrect){
    const team = teams.find(team => team.teamId === teamId);
    team.score += 1;
  }

  // Disable all buttons for this team and question
  const buttons = document.querySelectorAll(
    `button[data-team="${teamId}"][data-question="${questionId}"]`
  );
  buttons.forEach(btn => {
    btn.disabled = true;
    btn.classList.remove('btn-outline-primary');
    btn.classList.add('btn-secondary');
  });

  const container = document.getElementById(`team${teamId}-question`);
  container.innerHTML += `
    <p class="mt-2">You selected: <strong>${selected}</strong></p>
    ${qIndex === 0 ? `<button class="btn btn-success mt-2" onclick="document.getElementById('team${teamId}-question').nextQuestion()">Next Question</button>` : `<p class="text-success">All done!</p>`}
  `;

  // Check if all teams have answered their story's questions
  if (allTeamsAnswered()) {
    setTimeout(() => {
      alert("All student have answered! going back to Plinko...");
      showTab('plinko-tab');
      displayScores();

      // Reset turn order values remove redundancy

    }, 1000); // short delay for UX
  }
}

function getNumQuestionsForTeam(teamId) {
  // Story key since I'm too lazy to make a new script
  const week = teamWeekSelection[teamId];
  const day = teamDaySelection[teamId];
  const storyId = `w${week}d${day}`;

  const story = stories.find(s => s.id === storyId);
  return story ? story.questions.length : 0;
}

function allTeamsAnswered() {
  for (let teamId = 1; teamId <= 4; teamId++) {
    const required = getNumQuestionsForTeam(teamId);
    const answered = teamAnswers[teamId].length;
    if (answered < required) return false;
  }
  return true;
}

function displayScores() {
  for (let teamId = 1; teamId <= 4; teamId++) {
    const team = teams.find(team => team.teamId === teamId);
    const score = team.score;
    document.getElementById(`score-team${teamId}`).textContent = `Score: ${score}`;
  }
}

// #endregion

// (Optional) Scoring, Turn Management, Leaderboard, etc.
// TODO: Track team scores, store progress, display leaderboard