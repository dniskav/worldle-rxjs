import { fromEvent, Subject, merge } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import wordsList from './data/words';

let words = [];
let currentWord = '';
let matchWord = '';

const restartButton = document.querySelector('.restart-button');

const onWindowLoad$ = fromEvent(window, 'load');
const onRestartButtonCLick$ = fromEvent(restartButton, 'click');
const restartGame$ = merge(onRestartButtonCLick$, onWindowLoad$);
const onKeyDown$ = fromEvent(document, 'keydown').pipe(
  map(event => ({ code: event.code, key: event.key })),
);
const checkWin$ = new Subject();
let endgame$ = new Subject();
const letterRows = document.querySelectorAll('.letter-row');
const messageText = document.querySelector('#messageText');

function getRandomWord() {return wordsList[Math.floor(Math.random() * wordsList.length)]};

const clearBoard = () => {
  letterRows.forEach(row => {
    row.querySelectorAll('.letter').forEach((box, i) => {
      box.textContent = '';
      box.className =  'letter';
    });
  });
}


const renderLetters = () => {
  messageText.textContent = '';
  const currentRow = letterRows[words.length].querySelectorAll('.letter');

  currentRow.forEach((box, i) => {
    const letter = currentWord.toUpperCase()[i] ? currentWord[i] : '';
    box.textContent = letter;
    box.className = letter ? 'letter filled-letter' : 'letter';
  });
};

const deleteLetters = () => {
  currentWord = currentWord.slice(0, -1);
  messageText.textContent = '';
}

const checkLettersPosition = () => {
  const currentRow = letterRows[words.length].querySelectorAll('.letter');
  currentRow.forEach( (box, i) => {
    const letter = currentWord.toUpperCase()[i];
    const located = letter === matchWord[i];
    const exists = matchWord.includes(letter);
    box.className = letter ? `letter filled-letter ${located ? 'letter-green' : exists ? 'letter-yellow' : ''}` : 'letter filled-letter';
  });

  const sameWord = currentWord === matchWord;
  words.push(currentWord);
  currentWord = '';

  checkWin$.next(sameWord);
}

const checkWin = (status) => {
  if(status) {
    messageText.textContent = `Correcto la palabra es: ${matchWord} `;
    endgame$.next();
  } else if(words.length >= letterRows.length ) {
    messageText.textContent = `Lo siento la palabra es: ${matchWord} `
    endgame$.next();
  } else {
    return;
  }
}

const restartGame = () => {
  messageText.textContent = '';
  clearBoard();
  words = [];
  matchWord = getRandomWord();
  console.log(matchWord);
  restartButton.disabled = true;

  endgame$.next();
  endgame$.complete();

  endgame$ = new Subject();

  checkWin$.pipe(takeUntil(endgame$)).subscribe((data) => {
    checkWin(data)
  });
  onKeyDown$.pipe(takeUntil(endgame$)).subscribe(keyData => {
    const { key, code } = keyData;
  
    if(code.includes('Key')) {
      currentWord += key.toUpperCase(); 
      renderLetters();
    } else if(code === 'Backspace' || code === 'Delete') {
      deleteLetters();
      renderLetters();
    } else if(code === 'Enter' || code === 'NumpadEnter') {
      if(currentWord.length === matchWord.length) {
        checkLettersPosition();
      } else {
        messageText.textContent = `Te faltan ${matchWord.length - currentWord.length} letras`;
      }
    } else {
      return;
    }
  });

  endgame$.subscribe(() => {
    restartButton.disabled = false;
  })
}

// suscriptions
restartGame$.subscribe(restartGame);

