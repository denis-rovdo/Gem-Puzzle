'use strict';
const body = document.querySelector('body');
renderPage();

function renderPage() {

	const element = document.createElement('div');
	element.classList.add("wrapper");

	const page = `
				<div class="container">
					<div class="wrapper_buttons">
						<button class="start">New game</button>
						<button class="save">Save game</button>
						<button class="continue_game">Сontinue game</button>
						<button class="sound">Sound:Off</button>
						<button class="results">Results</button>
					</div>
					<div class="wrapper_counter">
						<div class="wrapper_moves">
							<div class="header_moves">Moves:</div>
							<div class="counter_moves">0</div>
						</div>
						<div class="wrapper_time">
							<div class="header_time">Time:</div>
							<div class="counter_time">
								<div class="hours">00:</div>
								<div class="minutes">00:</div>
								<div class="seconds">00</div>
							</div>
						</div>
					</div>
					<div class="wrapper_field">
					</div>
					<div class="wrapper_current_size">
						<div class="current_size_header">Сurrent size:</div>
						<div class="current_size">4x4</div>
					</div>
					<div class="choice_size_header">Choice size</div>
					<div class="wrapper_choice_size">
						<button class="size">3x3</button>
						<button class="size">4x4</button>
						<button class="size">5x5</button>
						<button class="size">6x6</button>
						<button class="size">7x7</button>
						<button class="size">8x8</button>
					</div>
				</div>`;

	body.prepend(element);
	element.innerHTML = page;
}


const hoursInPage = document.querySelector('.hours');
const minutesInPage = document.querySelector('.minutes');
const secondsInPage = document.querySelector('.seconds');
const startBtn = document.querySelector('.start');
const wrapperField = document.querySelector('.wrapper_field');
const sizeButtons = document.querySelectorAll('.size');
const currentSize = document.querySelector('.current_size');
const sound = document.querySelector('.sound');
const counterMoves = document.querySelector('.counter_moves');
const resultsBtn = document.querySelector('.results');
const background = document.createElement('div');
const backgroundResulst = document.createElement('div');
const resultsTextArr = document.querySelectorAll('.results_text');
const saveBtn = document.querySelector('.save');
const continueGameBtn = document.querySelector('.continue_game');

const srcClick = 'assets/click.mp3';
const srcWin = 'assets/win.mp3';


let arrSize = 4; //размер сетки
let containerSize = 400; //размер поля
let currentMatrix = []; //текущая матрица
let moves = 0; // количество выполненных движений
let countWin = 1; // количество результатов побед
let resultBestarr = []; // обьект с победами

// таймер
let inretval;
let hours = 0;
let minutes = 0;
let seconds = 0;

//кординаты пустой клетки
let emptyCellPositionX = 0;
let emptyCellPositionY = 0;

let fieldRender = () => {
	clearTimeout(inretval);
	//renderSquares(arrSize, getMatrixStart(arrSize)); // рендер решенной матрици при загрузке страницы

	inretval = setInterval(getTime, 1000);
	renderSquares(arrSize, getMatrix(arrSize));

	//размер контейнера с квадратами
	wrapperField.style.width = `${containerSize}px`;
	wrapperField.style.height = `${containerSize}px`;

};

const adaptive = () => {


	resultBestarr = JSON.parse(localStorage.getItem("saveBestResultToLocalStorage"));


	if (window.innerWidth < 410) {
		containerSize = 300;
		fieldRender();
	} else if (window.innerWidth > 410) {
		containerSize = 400;
		fieldRender();
	}
};



const adaptiveResize = () => {

	if (window.innerWidth < 410) {
		containerSize = 300;
	} else if (window.innerWidth > 410) {
		containerSize = 400;
	}
};


window.addEventListener(`load`, adaptive);
window.addEventListener(`resize`, adaptiveResize);


//генерация решенной матрицы 
function getMatrixStart(size) {

	let arr = new Array(size);
	let number = 0;

	for (let i = 0; i < size; i++) {
		arr[i] = new Array(size);
		for (let j = 0; j < size; j++) {
			number++;
			arr[i][j] = number;

		}
	}
	currentMatrix = arr;
	return arr;
}

//генерация рандомной мартицы нужного размера
function getMatrix(size) {

	let arr = new Array(size);
	let number = 0;
	let matrix = new Array(size);

	for (let i = 0; i < size * size; i++) {
		number++;
		arr[i] = number;

	}

	do {
		randomArr(arr);

	} while (!getSolvableCombinations(size, arr));

	let count = 0;
	for (let i = 0; i < size; i++) {
		matrix[i] = new Array(size);
		for (let j = 0; j < size; j++) {
			matrix[i][j] = arr[count];
			count++;

		}
	}
	currentMatrix = matrix;
	return matrix;

}


// перемешка масива
function randomArr(arr) {
	arr.sort(() => Math.random() - 0.5);
}


// проверка на решаемость 
function getSolvableCombinations(size, arr) {

	let inversionsCount = 0;
	let parityDefinition = size % 2;

	let row = 0;

	for (let i = 0; i < arr.length - 1; i++) {

		if (arr[i] === size * size) {
			row = Math.ceil((i + 1) / size);
		} else {

			for (let j = i + 1; j < arr.length; j++) {

				if (arr[i] > arr[j]) {
					inversionsCount++;
				}

			}

		}


	}

	let parityInversion = inversionsCount % 2;

	if (parityDefinition !== 0 && parityInversion === 0 || parityDefinition === 0 && row % 2 !== 0 && parityInversion !== 0 || parityDefinition === 0 && row % 2 === 0 && parityInversion === 0) {
		return true;

	} else {
		return false;
	}



}


// проверка на победу
function checkWin() {
	let count = 1;
	let win = 0;

	let arrLength = currentMatrix.length;

	for (let i = 0; i < arrLength; i++) {
		for (let j = 0; j < arrLength; j++) {

			if (currentMatrix[i][j] === count) {
				win++;
			}
			if (win === arrLength * arrLength) {
				console.log('ты выграл молодец');
				setTimeout(playAudio, 205, srcWin);
				winPopUp();
				return true;
			}
			count++;

		}

	}
	count = 1;
	win = 0;

}


// вставка на страницу кватдратов
function renderSquares(size, arr) {

	wrapperField.innerHTML = '';

	for (let i = 0; i < arr.length; i++) {

		for (let j = 0; j < arr[i].length; j++) {

			const element = document.createElement('div');
			element.classList.add(`square`);
			element.textContent = arr[i][j];

			element.style.left = (j * (containerSize / size)) + 'px';
			element.style.top = (i * (containerSize / size)) + 'px';

			element.style.height = (containerSize / size - 4) + 'px';
			element.style.width = (containerSize / size - 4) + 'px';


			if (arr[i][j] === arr[i].length ** 2) {
				element.classList.add(`zero`);
				element.setAttribute(`data-x`, i);
				element.setAttribute(`data-y`, j);
				emptyCellPositionX = i;
				emptyCellPositionY = j;

			} else {
				element.classList.add(`square_${arr[i][j]}`);
				element.setAttribute(`data-x`, i);
				element.setAttribute(`data-y`, j);

			}
			wrapperField.appendChild(element);

		}

	}
	checkEmptyCage(arr, arrSize);

	counterMoves.textContent = moves;

}





// поиск и добавление обработчиков события на нужные клетки рядом с пустой клеткой

function checkEmptyCage(matrix) {

	let sizeField = matrix.length * matrix.length;

	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {



			if (matrix[i + 1] && matrix[i + 1][j] === sizeField) {

				addEvent(`${matrix[i][j]}`);
			}

			if (matrix[i] && matrix[i][j - 1] === sizeField) {

				addEvent(`${matrix[i][j]}`);
			}

			if (matrix[i] && matrix[i][j + 1] === sizeField) {

				addEvent(`${matrix[i][j]}`);
			}

			if (matrix[i - 1] && matrix[i - 1][j] === sizeField) {

				addEvent(`${matrix[i][j]}`);
			}


		}
	}
}

// функция добавление обработчика событий на нужные кубики
function addEvent(clasName) {

	let top = (emptyCellPositionX * (containerSize / arrSize));

	let left = (emptyCellPositionY * (containerSize / arrSize));

	const currentSquare = document.querySelector(`.square_${clasName}`);

	currentSquare.style.cursor = 'pointer';
	currentSquare.setAttribute(`draggable`, true);

	let x = currentSquare.getAttribute(`data-x`);
	let y = currentSquare.getAttribute(`data-y`);

	currentSquare.ondragstart = drag; //добавление драг на нужные кубики

	const clickMotion = () => {

		currentSquare.style.left = left + 'px';
		currentSquare.style.top = top + 'px';

		currentMatrix[+x][+y] = arrSize * arrSize;
		currentMatrix[emptyCellPositionX][emptyCellPositionY] = +clasName;


		emptyCellPositionX = +x;
		emptyCellPositionY = +y;
		moves++;
		setTimeout(renderSquares, 200, arrSize, currentMatrix);
		checkWin();
		playAudio(srcClick);



	};

	currentSquare.addEventListener('click', clickMotion, {
		once: true
	});




	//добавлени дропа на кубики

	wrapperField.ondragover = allowDrop;
	wrapperField.ondrop = drop;

	function allowDrop(e) {
		e.preventDefault();
	}

	function drag(e) {
		e.dataTransfer.setData('key', e.target.className);
		//e.target.style.opacity = 0; // при взятии элемент проподает 
	}

	function drop(e) {

		let getClass = e.dataTransfer.getData('key');
		let itemClass = getClass.slice(7);

		const currentSquare = document.querySelector(`.${itemClass}`);

		let x = currentSquare.getAttribute(`data-x`);
		let y = currentSquare.getAttribute(`data-y`);

		e.target.append(currentSquare);

		//currentSquare.style.opacity = 1; // при вcтавке элемент появляется  

		currentSquare.style.left = left + 'px';
		currentSquare.style.top = top + 'px';


		currentMatrix[+x][+y] = arrSize * arrSize;
		currentMatrix[emptyCellPositionX][emptyCellPositionY] = +itemClass.slice(7);


		emptyCellPositionX = +x;
		emptyCellPositionY = +y;
		moves++;
		renderSquares(arrSize, currentMatrix);
		checkWin();
		playAudio(srcClick);



	}

}



//кнопка старт 

const startTheGame = () => {
	hours = 0;
	minutes = 0;
	seconds = 0;
	moves = 0;
	clearTimeout(inretval);
	inretval = setInterval(getTime, 1000);
	renderSquares(arrSize, getMatrix(arrSize));
	updateTime();

};

startBtn.addEventListener('click', startTheGame);


function getTime() {
	seconds++;
	if (seconds >= 60) {
		minutes++;
		seconds = 0;
	} else if (minutes >= 60) {
		minutes++;
		hours = 0;
	} else if (hours >= 60) {
		hours = 0;
	}
	updateTime();
}

function updateTime() {
	hoursInPage.textContent = `${getZero(hours)}:`;
	minutesInPage.textContent = `${getZero(minutes)}:`;
	secondsInPage.textContent = getZero(seconds);
}

function getZero(num) {
	return ('0' + num).slice(-2);
}



// изменнение размера сетки

sizeButtons.forEach((button, i) => {

	button.addEventListener('click', () => {

		arrSize = i + 3;
		currentSize.textContent = `${arrSize}x${arrSize}`;
		startTheGame();

	});
});



const audio = new Audio();

// проиграивание мелодии
function playAudio(melody) {
	audio.src = melody;
	audio.play();

}
// вкл выкл звук
const soundOff = () => {
	sound.classList.toggle('sound_none');
	if (audio.volume !== 0) {
		audio.volume = 0;
		sound.textContent = 'Sound:On';
	} else {
		sound.textContent = 'Sound:Off';
		audio.volume = 1;
	}
};

sound.addEventListener('click', soundOff);




//функция появления поп ап при выйгреше

function winPopUp() {

	

	if (countWin > 10) {
		countWin = 1;
	}


	background.classList.add("background");
	body.prepend(background);

	const popUp = document.createElement('div');
	popUp.classList.add("pop_up_win");
	background.prepend(popUp);



	const text = document.createElement('div');
	text.classList.add("win_text");
	popUp.prepend(text);
	text.textContent = `Hooray! 
	You solved the puzzle in ${getZero(hours)}:${getZero(minutes)}:${getZero(seconds)} and ${moves} moves!`;

	//console.log( resultBestarr=== null);

	if (resultBestarr === null){
		resultBestarr = [];
		console.log( resultBestarr=== null);
	}

	resultBestarr.push([moves, (`Time:${getZero(hours)}:${getZero(minutes)}:${getZero(seconds)} and ${moves} moves!`)]);

	if (resultBestarr.length > 20) {
		resultBestarr.pop();
	}

	resultBestarr.sort((a, b) => {
		return a[0] - b[0];
	});

	localStorage.setItem('saveBestResultToLocalStorage', JSON.stringify(resultBestarr));

	countWin++;
	clearTimeout(inretval);
	
}


const closePopUp = () => {

	background.remove();
	background.innerHTML = '';
	//wrapperField.innerHTML = '';
	startTheGame();

};

background.addEventListener('click', closePopUp);



//кнопка с результатами
const showResults = () => {

	backgroundResulst.classList.add("background_resulst");
	body.prepend(backgroundResulst);

	const popUpResults = document.createElement('div');
	popUpResults.classList.add("pop_up_results");
	backgroundResulst.prepend(popUpResults);

	const resultsHeader = document.createElement('div');
	resultsHeader.classList.add("results_header");
	popUpResults.prepend(resultsHeader);
	resultsHeader.textContent = 'Best results!';

	const resultsTextWrap = document.createElement('div');
	resultsTextWrap.classList.add("results_text_wrap");
	popUpResults.append(resultsTextWrap);

	clearTimeout(inretval);

	for (let i = 0; i < resultBestarr.length; i++) {

		if (i < 10) {
			const resultsText = document.createElement('div');
			resultsText.classList.add("results_text");
			resultsTextWrap.append(resultsText);
			resultsText.innerText = `${i+1}: ${resultBestarr[i][1]}`;
		}
	}
	
};


resultsBtn.addEventListener('click', showResults);

const removeResulrs = () => {
	//clearTimeout(inretval);
	backgroundResulst.remove();
	backgroundResulst.innerHTML = '';
	inretval = setInterval(getTime, 1000);
};

backgroundResulst.addEventListener('click', removeResulrs);




// сохранение игры
const saveGame = () => {

	let obj = {
		'currentMatrix': currentMatrix,
		'moves': moves,
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds,
		'arrSize': arrSize

	};

	localStorage.setItem('saveDataToLocalStorage', JSON.stringify(obj));
};

// начать с сохраненной игры
const removeSaveGame = () => {


	let obj = JSON.parse(localStorage.getItem("saveDataToLocalStorage"));


	currentMatrix = obj.currentMatrix;
	moves = obj.moves;
	hours = obj.hours;
	minutes = obj.minutes;
	seconds = obj.seconds;
	arrSize = obj.arrSize;

	currentSize.textContent = `${arrSize}x${arrSize}`;

	clearTimeout(inretval);
	inretval = setInterval(getTime, 1000);

	renderSquares(arrSize, currentMatrix);
	updateTime();
};



saveBtn.addEventListener('click', saveGame);
continueGameBtn.addEventListener('click', removeSaveGame);