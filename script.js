var c = document.getElementById("myCanvas");
var toolbar = document.getElementById("toolbar");
var ctx = c.getContext("2d");

toolbar.setAttribute('width', window.innerWidth);

c.setAttribute('width', window.innerWidth);
c.setAttribute('height', window.innerHeight);

var width = c.width;
var states = [];
var stored = [];

var selected;

function changeClass(id, c) {
	document.getElementById(id).className = c;
}	

function sort(selected) {
	var go = document.getElementById('go').className;
	if (go != 'disabled') {
		selected(stored, 0, stored.length - 1);
	}
}

function getSliderValue(id) {
	var sliderValue = document.getElementById(id).value;
	return sliderValue;
}	

function drawBars(arr) {
	ctx.clearRect(0, 0, c.width, c.height);
	var y = 0;
	var gap = 10;
	var w = Math.min(20, (width - gap*arr.length - 100 + gap) / arr.length);
	var offset = w + gap;
	var x = (width/2) - ((arr.length*w + (arr.length-1)*(offset-w))/2);
	
    for (var i = 0; i < arr.length; i++) {
        ctx.beginPath();
		if (states[i] == 1) {
			//	pivot
			ctx.fillStyle = '#DC7633';
		} else if (states[i] == 2) {
			// sorted
			ctx.fillStyle = '#5499C7';
		} else if (states[i] == -1) {
			// comparing
			ctx.fillStyle = '#7DCEA0';
		} else {
			ctx.fillStyle = 'white';
		}	
        ctx.fillRect(x + offset*i, y, w, arr[i]*2);
		ctx.arc(x + offset*i + w/2, arr[i]*2, w / 2 , 0, Math.PI);
		ctx.fill();
    }
}

function getArray(s) {
    var arr = [];
    for (var i = 0; i < s; i++) {
        var x = Math.floor(Math.random() * 250);
        arr.push(x);
		states[i] = 0;
    }
    return arr;
}

function generateArray() {
	ctx.clearRect(0, 0, c.width, c.height);
	var size = getSliderValue("sizeSliderval");
    var barLengths = [];
    barLengths = getArray(size);
	stored = barLengths;
    drawBars(barLengths);
}

// ################## QUICK SORT ################### //

async function quickSort(arr, low, high) {
	if (selected == 0) { return; }
	if (low < high) {
		var pi = await partition(arr, low, high);
		
		states[pi] = 2;
		
		Promise.all([quickSort(arr, low, pi - 1), quickSort(arr, pi + 1, high)]);
		
	} else if ( low == high) { states[low] = 2; }
	drawBars(stored);
}	

async function partition(arr, low, high) {
	await sleep(100);
	var pivot = arr[high];
	states[high] = 1;
	states[i+1] = 0;
	var i = low - 1;

	for (var j = low; j <= high - 1; j++) {
		if (arr[j] <= pivot) {
			i++;
			states[i] = -1;
			states[j] = -1;
			drawBars(stored);
			await swapElements(arr, i, j);
			drawBars(stored);
			states[i] = 0;
			states[j] = 0;
		}	
	}
	await swapElements(arr, i+1, high);
	states[high] = 0;
	drawBars(stored);
	return (i + 1);
}	

async function swapElements(arr, i, j) {
	var speed = getSliderValue("speedSliderval");
	speed = Math.abs(speed - 300);
	await sleep(speed);
	var x = arr[i];
	arr[i] = arr[j];
	arr[j] = x;
}	

async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve,ms));
}	

// ############# BUBBLE SORT ################# //

async function bubbleSort(arr) {
	var swaps = 0;
	var passes = 0;
	var high = arr.length;
	
	while (high >= 0) {
		swaps = 0;
		for (var i = 0; i < high - 1; i++) {
			states[i] = -1;
			states[i+1] = -1;
			drawBars(stored);
			if (arr[i] > arr[i+1]) { await swapElements(arr, i, i+1); swaps++; drawBars(stored); } 
			states [i] = 0;
			states[i+1] = 0;
			drawBars(stored);
			if (selected == 0) { return; }
		}	
		passes++;
		states[high-1] = 2;
		if (high == 0) { states[0] = 2; states[1] = 2; drawBars(stored); }
		high -= 1;
	}	
}	

// ############# MERGE SORT ################ //