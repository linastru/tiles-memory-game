let faces = [
  {icon: "./images/tile_icon_waves.svg", background: "./images/tile_face_dark_blue.svg"},
  {icon: "./images/tile_icon_bubbles.svg", background: "./images/tile_face_light_blue.svg"},
  {icon: "./images/tile_icon_wind.svg", background: "./images/tile_face_grey.svg"},
  {icon: "./images/tile_icon_rain.svg", background: "./images/tile_face_light_blue.svg"},
  {icon: "./images/tile_icon_lightning.svg", background: "./images/tile_face_purple.svg"},
  {icon: "./images/tile_icon_fire.svg", background: "./images/tile_face_red.svg"},
  {icon: "./images/tile_icon_honey.svg", background: "./images/tile_face_yellow.svg"},
  {icon: "./images/tile_icon_flower.svg", background: "./images/tile_face_pink.svg"},
  {icon: "./images/tile_icon_moon.svg", background: "./images/tile_face_dark.svg"},
  {icon: "./images/tile_icon_sun.svg", background: "./images/tile_face_yellow.svg"},
  {icon: "./images/tile_icon_flower2.svg", background: "./images/tile_face_pink.svg"},
  {icon: "./images/tile_icon_grass.svg", background: "./images/tile_face_green.svg"},
  {icon: "./images/tile_icon_mountains.svg", background: "./images/tile_face_brown.svg"},
  {icon: "./images/tile_icon_hurricane.svg", background: "./images/tile_face_grey.svg"},
  {icon: "./images/tile_icon_snowflake.svg", background: "./images/tile_face_white.svg"},
  {icon: "./images/tile_icon_waves2.svg", background: "./images/tile_face_dark_blue.svg"},
  {icon: "./images/tile_icon_cloud.svg", background: "./images/tile_face_grey.svg"},
  {icon: "./images/tile_icon_leaf.svg", background: "./images/tile_face_green.svg"},
  {icon: "./images/tile_icon_earth.svg", background: "./images/tile_face_brown.svg"},
  {icon: "./images/tile_icon_berries.svg", background: "./images/tile_face_red.svg"}
]

let smallBoard = 20;
let smallBoardX = 5;
let mediumBoard = 30;
let mediumBoardX = 6;
let largeBoard = 40;
let largeBoardX = 8;

let totalTiles = mediumBoard;
let tilesX = mediumBoardX;

let flippedIndex1 = null;
let flippedIndex2 = null;
let flips = 0;
let board = [];

$(document).ready(() => {
  initializeTiles();
  addEventListeners();
});

// Resize tiles to maintain the board aspect ratio and prevent overflow.
$(window).resize(setTileSize);

function initializeTiles() {
  flippedIndex1 = null;
  flippedIndex2 = null;
  flips = 0;
  board = [];
  
  $(".tiles-container").empty();
  $(".flips").html(flips);
  
  let tileTemplateStart = 
    "<div class='tile-box'>" +
      "<div class='tile-wrapper'>" +
        "<div class='tile tile-hover'>" +
          "<div class='tile-back'>" +
            "<img src='./images/tile_back.svg'>" +
          "</div>" +
          "<div class='tile-face'>";

  let tileTemplateEnd = 
              "' alt=''>" +
          "</div>" +
        "</div>" +
      "</div>" +
    "</div>";
  
  // Generate half of the board array (single copies of tiles).
  FYShuffle(faces);
  
  for (let i = 0; i < (totalTiles / 2); i++) {
    board[i] = {
      id : i,
      face : faces[i],
      matched : false
    };
  }
  
  // Generate the full board array (two copies of each tile).
  board = board.concat(board);
  FYShuffle(board);
  
  // Generate the tiles in HTML.
  for (let i = 0; i < totalTiles; i++) {
    let faceBackground = "<img src='" + board[i].face.background + "'>";
    let faceIcon = "<img class='tile-img' src='" + board[i].face.icon + "'>";
    let tile = tileTemplateStart + faceBackground + faceIcon + tileTemplateEnd;
  
    if (i % tilesX == 0) {
      $(".tiles-container").append("<br>");  
    }
  
    $(".tiles-container").append(tile);
  }

  // Add event listeners to the tiles.
  $(".tile").click(flipTile);
  
  // Set tile sizes based on container size.
  setTileSize();
}

function addEventListeners() {
  $("p.size-option").click(selectBoardSize);
  $(".dropdown-btn").click(toggleSizeDropdown);
}

function toggleSizeDropdown() {
  $(".dropdown-content").toggle();
  $(".dropdown-btn i").toggleClass("fa fa-angle-down fa-lg");
  $(".dropdown-btn i").toggleClass("fa fa-angle-up fa-lg");
}

function selectBoardSize() {
  toggleSizeDropdown();
  let size = $(this).attr("id");

  if (size === "small") {
    totalTiles = smallBoard;
    tilesX = smallBoardX;
  } else if (size === "medium") {
    totalTiles = mediumBoard;
    tilesX = mediumBoardX;
  } else if (size === "large") {
    totalTiles = largeBoard;
    tilesX = largeBoardX;
  }

  initializeTiles();
}

function flipTile() {
  let clickedIndex = $(".tile").index($(this));

  if (!board[clickedIndex].matched) {
    // If the tile has not been matched yet.

    if (clickedIndex === flippedIndex1 && flippedIndex2 === null) {
      // If the clicked card is already flipped up as card #1. (But card #2 is not
      // flipped up yet.)
      $(".tile").eq(flippedIndex1).toggleClass("flipped-up");
      flippedIndex1 = null;

    } else if (clickedIndex === flippedIndex1 || clickedIndex === flippedIndex2) {
      // If the clicked card is already flipped up and there are 2 cards flipped up
      // on the board.
      $(".tile").eq(flippedIndex1).toggleClass("flipped-up");
      $(".tile").eq(flippedIndex2).toggleClass("flipped-up");
      flippedIndex1 = null;
      flippedIndex2 = null;

    } else {
      // If the clicked card isn't flipped up yet.

      if (flippedIndex1 !== null && flippedIndex2 !== null) {
        // If both cards #1 and #2 are already flipped up.
        // Flip down the previous guessed pair.
        $(".tile").eq(flippedIndex1).toggleClass("flipped-up");
        $(".tile").eq(flippedIndex2).toggleClass("flipped-up");
        flippedIndex1 = clickedIndex;
        flippedIndex2 = null;

        $(".tile").eq(flippedIndex1).toggleClass("flipped-up");
        flips += 1;
        
      } else if (flippedIndex1 !== null) {
        // If card #1 is already flipped up.
        flippedIndex2 = clickedIndex;
        $(".tile").eq(flippedIndex2).toggleClass("flipped-up");
        flips += 1;

        if (board[flippedIndex1].id === board[flippedIndex2].id) {
          // If flipped up cards #1 and #2 are a matching pair.
          $(".tile").eq(flippedIndex1).toggleClass("tile-hover");
          $(".tile").eq(flippedIndex2).toggleClass("tile-hover");

          animateMatch(flippedIndex1);
          animateMatch(flippedIndex2);

          board[flippedIndex1].matched = true;
          board[flippedIndex2].matched = true;
          flippedIndex1 = null;
          flippedIndex2 = null;

          if (isSolved()) {
            // If all tiles are matched - game over. Show all tiles at full
            // opacity. Delay by 800 to allow the matching animation to finish.
            setTimeout(() => {
              $(".tile-wrapper").animate({
                opacity: 1
              }, 300);
            }, 800);
          }
        } else {
          // If flipped up cards #1 and #2 don't match.
          animateMismatch(flippedIndex1);
          animateMismatch(flippedIndex2);
        }
      } else {
        // If neither card #1, nor card #2 are flipped up yet.
        flippedIndex1 = clickedIndex;
        $(".tile").eq(flippedIndex1).toggleClass("flipped-up");
        flips += 1;
      }
    }
  }
  $(".flips").html(flips);
}

function isSolved() {
  let solved = true;

  for (let i = 0; i < board.length; i++) {
    if (board[i].matched === false) {
      solved = false;
    }
  }

  return solved;
}

function setTileSize() {
  let x = $(".tiles-container").width() / tilesX;
  let h = $("body").height() - $(".header").height() - $(".footer").height();
  let y = h / (totalTiles / tilesX);

  if (y < x) {
    $(".tile-box").width((Math.floor(y) + "px")).height((Math.floor(y) + "px"));
  } else {
    $(".tile-box").width((Math.floor(x) + "px")).height((Math.floor(x) + "px"));
  }
}

// Fisher-Yates array shuffle.
function FYShuffle(array) {
  for (let i = (array.length - 1); i > 0; i--) {
    let a = Math.floor(Math.random() * i);
    let temp = array[i];
    array[i] = array[a];
    array[a] = temp;
  }
}

function animateMismatch(index) {
  // Set 200ms delay to allow the 0.15s flip animation to complete first.
  setTimeout(() => {
    $(".tile-wrapper").eq(index)
      .animate({
        left: "55%"
      }, 85)
      .animate({
        left: "45%"
      }, 85)
      .animate({
        left: "50%"
      }, 85);
  }, 200);
}

function animateMatch(index) {
  // Set 200ms delay to allow the 0.15s flip animation to complete first.
  setTimeout(() => {
    $(".tile-wrapper").eq(index)
      .animate({
        height: "120%",
        width: "120%"
      }, 100)
      .animate({
        height: "100%",
        width: "100%"
      }, 100)
      .animate({
        opacity: 0.2
      }, 300);
  }, 200);
}