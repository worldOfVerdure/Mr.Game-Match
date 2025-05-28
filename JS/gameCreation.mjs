import { attemptsDiv, resetButton, timerDataObj, timerComponents} from "./index.mjs";
import { GameData } from "./dataObjects.mjs";
import { randomizeImages, addImage } from "./imageUtilityFunctions.mjs";

function clearGame (mainElement) {
  while(mainElement.firstChild)
    mainElement.removeChild(mainElement.firstChild);

  attemptsDiv.innerText = 0;
  //Reset timer
  clearInterval(timerDataObj.intervalID);
  for (const timerProperty in timerDataObj) {
    if (typeof timerProperty === "number")
      timerDataObj[timerProperty] = 0;

    else if (Array.isArray(timerProperty))
      timerDataObj[timerProperty] = ["00", "00", "00"];
  }
}

function flipCard(event, gameData, eventHandler) {
  // function to handle the case where neither card is a match
  function nonMatch() {
    gameData.firstCard.addEventListener("click", eventHandler);
    gameData.secondCard.addEventListener("click", eventHandler);
    gameData.firstCard.classList.toggle("isRotated");
    gameData.secondCard.classList.toggle("isRotated");
    gameData.resetCards();
  }
  
  const selectedCard = event.currentTarget;
  const selectedImg = selectedCard.children[0].children[0].title;

  if (gameData.firstCard === null) {
    // Recall first card to restore event listner if needed
    gameData.firstImg = selectedImg;
    gameData.firstCard = selectedCard;
    gameData.firstCard.classList.toggle("isRotated");
    gameData.firstCard.removeEventListener("click", eventHandler);
  }

  else if (gameData.secondCard === null) {
    attemptsDiv.innerText = ++gameData.attempts;
    gameData.secondImg = selectedImg;
    gameData.secondCard = selectedCard;
    gameData.secondCard.classList.toggle("isRotated");
    gameData.secondCard.removeEventListener("click", eventHandler);

    if (gameData.firstImg === gameData.secondImg) {
      ++gameData.matches;
      if(gameData.matches === (gameData.numOfTiles / 2)) {
        //!zzzPlace closeInterval() here
        clearInterval(timerDataObj.intervalID);
        console.log("Game over"); // TODO: Implement function
        return;
      }

      gameData.resetCards();

      //TODO: Implement green outline flash
    }
  
    else {
      setTimeout(() => {
        nonMatch();
      }, 1250);
    }
  }
}

function createCards(mainElement, gameData, imageNamesArray, chosenOptgroup, chosenOption) {
  const gridFragment = new DocumentFragment();
  
  for (let i = 0; i < gameData.numOfTiles; ++i) {
    const scene = document.createElement("div"); //Has Perspective
    const card = document.createElement("div"); //Gets flipped
    const cardFront = document.createElement("div"); //Front of card
    const cardBack = document.createElement("div"); //Back of card
    const frontImg = addImage(imageNamesArray, i, chosenOptgroup, chosenOption);
    
    const eventHandler = event => flipCard(event, gameData, eventHandler);
    card.addEventListener("click", eventHandler);

    cardFront.classList.add("front");
    cardFront.append(frontImg);
    card.append(cardFront);
    card.append(cardBack);
    scene.append(card);
    scene.classList.add("scene");
    card.classList.add("card");

    switch (chosenOptgroup) {
      case "Fauna":
        cardBack.classList.add("back", "backFauna");
        break;
      case "Flora":
        cardBack.classList.add("back", "backFlora");
        break;
      case "Fungi":
        cardBack.classList.add("back", "backFungi");
        break;
      default:
        throw new Error("The appropriate optgroup was not chosen.");
    }
    
    gridFragment.append(scene);
  }
  mainElement.append(gridFragment);

  let start = new Date().getTime();
  timerDataObj.intervalID = setInterval(() => {
    timerDataObj.calculateTime(start);
    timerDataObj.timeArray.forEach((e, i) => {
      timerComponents[2 - i].innerText = e; 
    });
  }, 25);
}

export function setGame(event, mainElement) {
  //Everytime we enter setGame, check if we need to clear the board.
  if(mainElement.hasChildNodes())
    clearGame(mainElement);

  let gameData = new GameData();
  //Recall event for potential reset of the game
  gameData.selection = event;

  resetButton.addEventListener("click", () => {
    const eventSelected = gameData.selection;
    clearGame(mainElement);
    setGame(eventSelected, mainElement, gameData);
  });
  
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  
  if (vw <= 600)
    gameData.numOfTiles = 16;

  else if (vw > 600 && vw <= 1000)
    gameData.numOfTiles = 24;

  else if (vw > 1000)
    gameData.numOfTiles = 30;

  else
    gameData.numOfTiles = undefined;

  if (gameData.numOfTiles !== undefined) {
    const optgroupSelection = event.target.selectedOptions[0].closest("optgroup").label;
    const selectOption = event.target.selectedOptions[0].innerHTML;
    const theBody = document.querySelector("body");
    const pElements = document.querySelectorAll("p");
    // Select colors 
    theBody.className = ""; //Reset classes
    pElements.forEach(p => {p.className = ""});
    switch (optgroupSelection) {
      case "Fauna":
        theBody.classList.add("faunaGradient");
        pElements.forEach(p => {p.classList.add("faunaColor")});
        break;
      case "Flora":
        theBody.classList.add("floraGradient");
        pElements.forEach(p => {p.classList.add("floraColor")});
        break;
      case "Fungi":
        theBody.classList.add("fungiGradient");
        pElements.forEach(p => {p.classList.add("fungiColor")});
        break;
      default:
        throw new Error("The appropriate optgroup was not chosen.");
    }
    // Generates random order for front card images
    const imageNamesArray = randomizeImages(gameData.numOfTiles, optgroupSelection, selectOption);

    createCards(mainElement, gameData, imageNamesArray, optgroupSelection, selectOption);
  }
}
