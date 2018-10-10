var cardList, openCards, symbols, matchedCards, stars, modal, span, moves,
clock, timeCount, timeFinal, timerInterval;

cardList = $('.card');
openCards = $('.open').not('.match');
matchedCards = $('.match');

stars = $('.fa-star');

modal = document.getElementById('myModal');
span = $('.close')[0];

moves = 0;
moveCount = $('#moves');

clock = $('.clock');
timeCount = 0;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/* event listener for restart button, calls reset function */
$('.restart').on('click', function(){
  resetGame();
})

/* resets all parameters for game to starting values */
function resetGame() {
  resetTimer();
  resetMoves();
  resetStars();
  matchedCards=[];
  shuffle(cardList);
  $('.deck').remove('li');
  $('.deck').append(cardList.removeClass('open show match'));
}

/* event listener for card clicks, walks through card reveals and game counters */
$('.card').on('click', function(evt){
  if (timeCount===0) {
    timer();
    timeCount++;
  }
  if (openCards.length<=1) {
    cardOpener(evt);
    if (openCards.length===2) {
      moveCounter();
      if (matchChecker(openCards)===true){
        matchMaker(openCards);
      } else {
        wrongCard(openCards);
        cardCloser(openCards);
      }
    }
  }
  winChecker(matchedCards);
})

/* shifts CSS classes to transform hidden cards into revealed cards */
function cardOpener(evt) {
  if ($(evt.target).is('.card')){
    $(evt.target).addClass('open show');
  }
  openCards=$('.open');
  return openCards;
}

/* turns revealed cards back into hidden cards */
function cardCloser(array) {
  setTimeout(function() {
    $(array[0]).removeClass('open show red');
    $(array[1]).removeClass('open show red');
    openCards=[];
    return openCards;
  },800);
}

/* checks 'types' to see if cards match */
function matchChecker(array) {
  if (array[0].type===array[1].type) {
    return true;
  }
}

/* locks cards into finish position */
function matchMaker(array) {
  $(array[0]).toggleClass('open show match');
  $(array[1]).toggleClass('open show match');
  openCards = [];
  matchedCards = $('.match');
}

/* turns wrong choices red before cardCloser() hides them again */
function wrongCard(array) {
  $(array[0]).addClass('red');
  $(array[1]).addClass('red');
}

/* checks for win condition (all 16 cards matched) and displays end dialog */
function winChecker(matchedCards) {
  if (matchedCards.length===16) {
    clearInterval(timerInterval);
    timeFinal = $(clock).text();
    modal.style.display='block';
    $('#myModal').find('p').text('You did it! With '+moves+' moves in '+timeFinal+', you got '+stars.length+' stars!');
  }
}

/* closes the modal on click */
span.onclick = function() {
    modal.style.display='none';
}

/* increments count of moves taken in display, shows rating dynamically */
function moveCounter() {
  moves++;
  $(moveCount).text(moves);
  if (moves > 15 && moves < 30) {
    $('#star3').removeClass('fa fa-star');
    $('#star3').addClass('fa fa-times');
  } else if (moves > 30) {
    $('#star2').removeClass('fa fa-star');
    $('#star2').addClass('fa fa-times');
  }
  stars=$('.fa-star');
}

/* resets rating stars to starting values */
function resetStars() {
  $('#star3').removeClass('fa fa-times');
  $('#star3').addClass('fa fa-star');
  $('#star2').removeClass('fa fa-times');
  $('#star2').addClass('fa fa-star');
}

/* returns move count to 0 on reset */
function resetMoves() {
  moves=0;
  $(moveCount).text(moves);
}

/* adds one second per second and transfers to minutes, keeping time */
function timer() {
  var minutes = 0;
  var seconds = 0;
  timerInterval = setInterval(function () {
    seconds = parseInt(seconds, 10) + 1;
    minutes = parseInt(minutes, 10);
    if (seconds >= 60) {
      minutes += 1;
      seconds = 0;
    }
    $(clock).text(minutes + ' minutes ' + seconds + ' seconds');
  }, 1000);
}

/* returns clock to 0 at reset */
function resetTimer() {
  clearInterval(timerInterval);
  timeCount=0;
  $(clock).text('0 minutes 0 seconds');
}
