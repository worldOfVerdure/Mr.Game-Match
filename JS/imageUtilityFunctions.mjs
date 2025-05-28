import { animalImages } from "./dataObjects.mjs";

export function randomizeImages(numOfTiles, chosenOptgroup, chosenOption) {
  const NUM_OF_IMAGES = 16;
  const UNIQUE_NUM_IMAGES = numOfTiles >> 1;
  // Array of numbers, representing the indices of the image file name array
  const radomizedImageArray = new Array(UNIQUE_NUM_IMAGES);

  for (let i = 0; i < NUM_OF_IMAGES; ++i)
    radomizedImageArray[i] = i;

  function generateRandomIndices (sortArray, indexStart) {
    let tempSwapNum, randomNum;
    // Randomize array with Knuth shuffle, O(n)
    for (let j = indexStart; j > 0; --j) {
      randomNum = Math.floor(Math.random() * (j+1));
      tempSwapNum = sortArray[randomNum];
      sortArray[randomNum] = sortArray[j];
      sortArray[j] = tempSwapNum;
    }
  }
  //Get the images that we need
  generateRandomIndices(radomizedImageArray, NUM_OF_IMAGES - 1);

  const truncatedImages = radomizedImageArray.slice(0, UNIQUE_NUM_IMAGES);
  const doublyTruncatedImages = truncatedImages.concat(truncatedImages);
  generateRandomIndices(doublyTruncatedImages, doublyTruncatedImages.length - 1);
  const imageArray = new Array(doublyTruncatedImages.length);

  function populateImageNames() {
    const lowerCaseOptGroup = chosenOptgroup.toLowerCase();
    const lowerCaseOption = chosenOption.toLowerCase();

    doublyTruncatedImages.forEach((e, index) => {
      imageArray[index] = `${animalImages[lowerCaseOptGroup][lowerCaseOption][e]}`;
    });
  }
  populateImageNames();
  
  return imageArray;
}

export function addImage(imageArray, index, chosenOptgroup, chosenOption) {
  const imgEle = document.createElement("img");
  const lowerCaseOptGroup = chosenOptgroup.toLowerCase();
  const lowerCaseOption = chosenOption.toLowerCase();
  
  imgEle.src = `./images/${lowerCaseOptGroup}/${lowerCaseOption}/${imageArray[index]}.webp`;
  imgEle.alt = `A picture of a ${imageArray[index]}`;
  imgEle.title = `${imageArray[index]}`;
  // Could have served (larger? Higher res, greater css pixel width) images for higher pixel density devices.
  imgEle.srcset = `
    ./images/${lowerCaseOptGroup}/${lowerCaseOption}/${imageArray[index]}-sm.webp 100w,
    ./images/${lowerCaseOptGroup}/${lowerCaseOption}/${imageArray[index]}-md.webp 130w,
    ./images/${lowerCaseOptGroup}/${lowerCaseOption}/${imageArray[index]}-lg.webp 190w,
    ./images/${lowerCaseOptGroup}/${lowerCaseOption}/${imageArray[index]}-xlg.webp 250w
  `;
  // If the viewport doesn't exceed 600, 900, 1200px, use the specified image sizes, else, use 250px.
  imgEle.sizes = `
    (max-width: 600px) 100px,
    (max-width: 900px) 130px,
    (max-width: 1200px) 190px,
    250px
  `;
  imgEle.classList.add("match-image");
  
  return imgEle;
}
