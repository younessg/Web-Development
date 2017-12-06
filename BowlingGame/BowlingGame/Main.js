var frameNumber = 0;
var firstRoll = 0;
var secondRoll = 0;
var rollsTotal = 0;

var score = new Array();
var rollsArray = new Array();
var sumArray = new Array();

var frameState = "";
var prevState = "";

var bonusFrame = false;

function domath(){
	
	firstRoll = document.getElementById('myForm').elements.namedItem('first_roll').value;
	secondRoll = document.getElementById('myForm').elements.namedItem('second_roll').value;

	frameNumber += 1;
	
	if(frameNumber > 10){
		bonusFrame = true;		
		document.getElementById('myForm').elements.namedItem('second_roll').disabled = true;
	} else {		
		document.getElementById('frame_' + frameNumber + '_first_roll').innerHTML = firstRoll;
		document.getElementById('frame_' + frameNumber + '_second_roll').innerHTML = secondRoll;
		document.getElementById('frame_' + frameNumber).style.backgroundColor = '#CEE3F6';
	};
	
	rollsTotal = parseInt(firstRoll) + parseInt(secondRoll);

	var roll = Object.create(Roll);
	roll.setFirstRoll(firstRoll);
	roll.setSecondRoll(secondRoll);
	rollsArray[frameNumber] = roll;	
	
	if (rollsTotal == 10) {
	
		// console.log("score for frame " + frameNumber + " = " + score[frameNumber] + ", score for frame " + prevFrame + " = " + score[prevFrame]);		
		
		// STRIKE
		if(firstRoll == 0 || secondRoll == 0) {
			prevState = frameState;
			frameState = "Strike";
		// SPARE
		} else {
			prevState = frameState;
			frameState = "Spare";
		}
		// OPEN
	} else {
		prevState = frameState;
		frameState = "Open";
	};
	
	// Previous frame number
	prevFrame = (frameNumber - 1) < 1 ? 1 : frameNumber - 1;
	
	if(frameNumber <= 10) {
		if(frameState == "Open"){
			
			updateCurrentFrameScore();		
			
			// Update score based on previous frame state		
			if (prevState == "Strike" || prevState == "Spare") {
				updatePreviousFrameScore(prevState);
			};
			
		} else if(frameState == "Strike" || frameState == "Spare") {
			if(frameNumber > prevFrame)	{			
				score[frameNumber] =  score[prevFrame] + rollsTotal;
				updatePreviousFrameScore(prevState);
			} else {
				score[frameNumber] =  rollsTotal;
				updateUI();
			}
		};
	}
	
	// Update current frame score
	function updateCurrentFrameScore(){
		// Handle open state calculations
		if(frameNumber > prevFrame) {
			 score[frameNumber] = score[prevFrame] + rollsArray[frameNumber].getTotal();
		} else {
			score[frameNumber] = rollsArray[frameNumber].getTotal();
		};
		
		updateUI();
	}
	
	// Update previous frame score
	function updatePreviousFrameScore(prevState)
	{
		var currentScore = score[frameNumber];
		var prevScore = score[prevFrame];
		
		if (prevState == "Strike") {
			score[prevFrame] = prevScore + rollsArray[frameNumber].getTotal();
		} 
		else if(prevState == "Spare") {
			
			console.log("Prev state:" + prevState + ". Current state:" + frameState);
			console.log("Prev score:" + score[prevFrame] + ". Current score:" + score[frameNumber] + ". Curent frame sum:" + rollsArray[frameNumber].getTotal());
			
			score[prevFrame] = prevScore + parseInt(rollsArray[frameNumber].getFirstRoll());
		}
		
		updateCurrentFrameScore();
	};
	
	function updateUI(){
		document.getElementById('frame_' + frameNumber + '_sum').innerHTML = rollsArray[frameNumber].getTotal();
		document.getElementById('frame_' + frameNumber + '_state').innerHTML = frameState;
		document.getElementById('frame_' + prevFrame + '_score').innerHTML = score[prevFrame];	
		document.getElementById('frame_' + frameNumber + '_score').innerHTML = score[frameNumber];
		document.getElementById('myForm').elements.namedItem('currentFrame').value = frameNumber;	
	}
	
	return false;
}