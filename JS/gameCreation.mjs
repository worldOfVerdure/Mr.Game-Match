function clearGame (mainElement, gameData, timerObj) {
  while(mainElement.firstChild)
    mainElement.removeChild(mainElement.firstChild);
    gameData.numOfTiles = 0;
    gameData.attempts = 0;
    gameData.firstCard = null;
    gameData.secondCard = null;

  // clearInterval(timerObj.intervalID);
  // for (const timerProperty in timerObj) {
  //   timerObj[timerProperty] = 0;
  // }
}

function flipCard(event) {
  event.currentTarget.classList.toggle("isRotated");
}

function runGame(mainElement, gameData, timerObj, chosenOptgroup, chosenOption) {
  const gridFragment = new DocumentFragment();
  
  for (let i = 0; i < gameData.numOfTiles; ++i) {
    const scene = document.createElement("div"); //Has Perspective
    const card = document.createElement("div"); //Gets flipped
    const cardBack = document.createElement("div"); //Back of card
    const cardFront = document.createElement("div"); //Front of card
    //TODO: Change card flip function so that the eventlistener of the event.currentTarget is
    //TODO: temporarily disabled. The function that is called will handle the attempt. Have an
    //TODO: if-else that checks if 0, 1, or 2 cards have been flipped.
    
    //*gameData object to record number of cards clicked, determines if more may be flipped
    card.addEventListener("click", event => {
      flipCard(event);
    });

    card.append(cardFront);
    card.append(cardBack);
    scene.append(card);
    //TODO: add transform to inner card via js during click event
    scene.classList.add("scene");
    card.classList.add("card");

    switch (chosenOptgroup) {
      case "Fauna":
        
    }
    cardBack.classList.add("back", "backPolypore");



    cardFront.classList.add("front");
    // scene.style.gridArea = `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`;
    
    gridFragment.append(scene);
  }
  mainElement.append(gridFragment);
  //timerObj.intervalID = setInterval(timer(), 1);
}

export function setGame(event, mainElement, gameData, timerObj) {
  //Everytime we enter setGame, check if we need to clear the board.
  if(mainElement.hasChildNodes())
    clearGame(mainElement, gameData, timerObj);

  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  
  if ((vw <= 600) || (vh <= 700))
    gameData.numOfTiles = 16;

  else if ((vw > 600 && vw <= 1000) && (vh > 700 && vh <= 1000))
    gameData.numOfTiles = 24;

  else if ((vw > 1000) || (vh > 1000))
    gameData.numOfTiles = 30;

  else
    gameData.numOfTiles = undefined;

  if (gameData.numOfTiles !== undefined) { // maybe check type
    const optgroupSelection = event.target.selectedOptions[0].closest("optgroup").label;
    const selectOption = event.target.selectedOptions[0];
    const theBody = document.querySelector("body");
    const pElements = document.querySelectorAll("p");
    // Select colors 
    // TODO: clean this up. Add a css classList. Try to avoid adding styles
    switch (optgroupSelection) {
      case "Fauna":
        theBody.style.background = "conic-gradient(at 50% -3%, #382417 90deg, #2d634c, #B19470 270deg)";
        pElements.forEach(e => {e.style.color = "#F8FAE5"});
        break;
      case "Flora":
        theBody.style.background = "conic-gradient(at 50% -3%, #2da5ad 120deg, #169761, #463594 240deg)";
        pElements.forEach(e => {e.style.color = "#F8FF95"});
        break;
      case "Fungi":
        theBody.style.background = "conic-gradient(at 50% -1%, #35858B, #072227, #AEFEFF";
        pElements.forEach(e => {e.style.color = "#78e6e2"});
        break;
      default:
        console.log("The appropriate optgroup was not chosen.");
        alert("Try refreshing the webpage.");
    }
    runGame(mainElement, gameData, timerObj, optgroupSelection, selectOption);
  }
}