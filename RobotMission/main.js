var compass = ['N', 'E', 'S', 'W']; // North, East, South, West
var commands = ['L', 'R', 'G'];     // Left, Right, Go i.e. walk
var validMatrix = [];               // Holds data used initiating drwaing the map tiles
var mapGraph = [];                  // The actual map graph used for robot navigation
var validFirstPosition = [];        // Used for Robot start position
var validCommands = [];             // Commands the Robot will follow
var isValidSize;					// Valide size, a global flag (boolean) needed in run time
var isValidRobotCommands;           // Valide robot command, a global flag (boolean) needed in run time
var isValidPosition;                // Valide robot start position, a global flag (boolean) needed in run time

// Robot variables
var robotStartOrientation;
var robotCurrentOrientation;
var startPosition = [];
var endPosition = [];
var isRobotCrashed = false;         // Mission assumed a success until the robot crash
var totalRobotCrash = 0;
var totaRobotSuccess = 0;

// UI object references
var rootDiv = document.querySelector('.main-container-div');
var workBench = workBench = document.querySelector('.user-input-div'); // Place for showing different views
var userInputBtn = document.querySelector('.user-input-btn');
userInputBtn.addEventListener("click", parseUserInput);
var warningSymbol1 = document.querySelector('.warning-symbol-1');
var warningSymbol2 = document.querySelector('.warning-symbol-2');
var warningSymbol3 = document.querySelector('.warning-symbol-3');
var screenTitle = document.querySelector('.screen-title');
var missionReportHtml; // Place holder for the mission summary

var warningMessages = []; // For showing warning messages
var warningSymbols = []; // Side marks for mandatory fields

// Initalize app
initialize();

// Handle user input
function parseUserInput() {

	// Emit Google analytics button event
	ga('send', 'event', 'Button', 'Click', 'Submited matrix data');

	// Reset some golobal flags and cash, needed for validation while 
	// in the same session (broswer refresh button is not used!)
	initialize();

	// Place holder for user input
	let matrixSize = document.querySelector('.matrix-size').value;
	let firstPosition = document.querySelector('.first-position').value;
	let commands = document.querySelector('.commands').value;

	// Check if user inputs are valid
	isValidSize = isValidMatrixSize(matrixSize.trim());
	isValidPosition = isValidFirstPosition(firstPosition.trim());
	isValidRobotCommands = isValidCommands(commands.trim());

	// If user inputs are valid, then generate map and Robot will
	// execute commands, otherwise show warning message
	if (isValidSize && isValidPosition && isValidRobotCommands) {
		screenTitle.innerHTML = "Map and mission status!";
		drawMap(validMatrix);
		startMission(validFirstPosition, validCommands); // Start mission and generate report
		showReport(missionReportHtml);
	} else if (!isValidSize || !isValidPosition || !isValidRobotCommands) {
		showWarningMessage(warningMessages);
		highlightWarningSymbols("red");
	}
};

// Validate matrix size submitted by user
function isValidMatrixSize(matrixSize) {
	let matrixSizeAsArray;
	let isValidSize = false;

	if (isNull(matrixSize)) {
		warningMessages.push("Matrix size is empty!");
	} else {
		matrixSizeAsArray = matrixSize.toUpperCase().split(" ");
		// Convert strings to digits and validating the result, weare
		// assured to get two different digits from getArrayAsValidDigits
		matrixSizeAsArray = getArrayAsValidDigits(matrixSizeAsArray);
		let temColmnVal = matrixSizeAsArray[0];
		let temRowVal = matrixSizeAsArray[1];
		// Check is made since the matrix is used to draw starting at index 1
		if (matrixSizeAsArray.length !== 0 && (temColmnVal >= 1 && temRowVal >= 1)) {
			isValidSize = true;
			// Set global array holding valid matrix data, 
			// to be used for drwaing the map
			validMatrix = matrixSizeAsArray;
		} else {
			warningMessages.push("Matrix size is invalide, see instructions!");
		}
	};

	if (!isValidSize)
		warningSymbols.push(warningSymbol1);

	return isValidSize;
}

// Validates first position submitted by user
function isValidFirstPosition(firstPosition) {
	let matrixFirstPositionAsArray = [];
	let tempFirstPositionArray = [];
	let intialOrientation = "";
	let isValidOrientation = false;
	let isStartPosInMatrixBounds = false;
	let isValidPosition = false;

	if (isNull(firstPosition)) {
		warningMessages.push("First position is empty!");
	} else {
		matrixFirstPositionAsArray = firstPosition.toUpperCase().split(" ");
		// Check there are 3 submitted values, convert first 2 into digits,
		// all items must be valid entries i.e. 2 digits and one string
		// in ['N', 'E', 'S', 'W']
		if (matrixFirstPositionAsArray.length == 3) {
			for (var i = 0; i < matrixFirstPositionAsArray.length - 1; i++) {
				tempFirstPositionArray.push(matrixFirstPositionAsArray[i]);
			}
			intialOrientation = matrixFirstPositionAsArray[2];
			matrixFirstPositionAsArray = getArrayAsValidDigits(tempFirstPositionArray);
			// Validate if the starting position is out of matrix bounds
			isStartPosInMatrixBounds = isFirstPosInMatrixBounds(matrixFirstPositionAsArray, validMatrix);
			// Third argument from user must match one of the compass items
			isValidOrientation = (compass.indexOf(intialOrientation) > -1);
		};
		if (matrixFirstPositionAsArray.length == 0 || !isValidOrientation || !isStartPosInMatrixBounds) {
			warningMessages.push("First position is invalid or out of matrix bounds!");
		} else {
			robotStartOrientation = intialOrientation;
			// Set global array holding valid first position values,
			// to be used by the robot as a starting position
			validFirstPosition = matrixFirstPositionAsArray;
			isValidPosition = true;
		};
	}

	if (!isValidPosition)
		warningSymbols.push(warningSymbol2);

	return isValidPosition;
};

function isFirstPosInMatrixBounds(firstPositionAsArray, validMatrixArray) {
	let isValidFirstPos = false;

	if (firstPositionAsArray.length == 0)
		return isValidFirstPos;
	if (validMatrixArray.length == 0)
		return isValidFirstPos;

	let firstXpos = firstPositionAsArray[0];
	let firstYpos = firstPositionAsArray[1];
	let validXpos = validMatrixArray[0];
	let validYpos = validMatrixArray[1];

	if ((firstXpos >= 1) && (firstXpos <= validXpos) && (firstYpos >= 1) && (firstYpos <= validYpos)) {
		isValidFirstPos = true;
	}

	return isValidFirstPos;
};

// Validates commands submitted by user
function isValidCommands(commandsArg) {
	let isValidRobotCommands = false;
	let tempCommandsArray = [];
	let errorMsg = "";

	if (isNull(commandsArg)) {
		errorMsg = "Walk commands are empty!";
	} else {
		tempCommandsArray = Array.from(commandsArg.toUpperCase());
		for (cmdIndex in tempCommandsArray) {
			if (!(commands.indexOf(tempCommandsArray[cmdIndex]) > -1)) {
				// Generate command error message before leaving method
				generateCommandsErrorMsg("Walk command is invalid!", warningSymbol3);
				return isValidRobotCommands = false;
			} else {
				isValidRobotCommands = true;
			}
		};
		if (isValidRobotCommands) {
			// Set global array holding valid commands to be executed by the robot
			validCommands = tempCommandsArray;
			isValidRobotCommands = true;
		} else {
			errorMsg = "Walk command is invalid!";
		}
	};

	if (!isValidRobotCommands)
		generateCommandsErrorMsg(errorMsg, warningSymbol3);

	return isValidRobotCommands;
};

function generateCommandsErrorMsg(errorMsg, warningSymbol) {
	warningMessages.push(errorMsg);
	warningSymbols.push(warningSymbol);
}

// Validates if passed argument is null or empty
function isNull(arg) {
	return arg == null || arg == "";
};

// Converts character numbers into integers, validates
// all are integres and only two are present, eg. 5 * 5 or
// 10 * 10, otherwise return empty array
function getArrayAsValidDigits(stringArray) {
	let _array = [];
	let isItemNaN = false;
	let maxPairCount = 2; // Only 2 pair digts are needed

	stringArray.map(function (item) {
		var tempItem = parseInt(item, 10); // Radix 10 for decimal numerals commonly used		
		if (isNaN(tempItem)) {
			// User enterred something wrong
			isItemNaN = true;
		} else {
			_array.push(tempItem);
		}
	});

	if (isItemNaN || _array.length != maxPairCount) {
		_array = [];
	}
	return _array;
}

// Shows warning message(s) if user input is invalid
function showWarningMessage($warningMessages) {
	let warningDialog = document.querySelector('.alert-dialog');
	let closeBtn = document.querySelector('.alert-dialog-close-btn');
	let alertDialogMessage = document.querySelector('.alert-dialog-message');
	let alertDialogMessageHTML = "";

	if ($warningMessages.length > 0) {
		// Show warning dialog
		warningDialog.style.display = "block";
		$warningMessages.forEach(function (warning) {
			alertDialogMessageHTML += warning + "<br>"
		});

		alertDialogMessage.innerHTML = alertDialogMessageHTML;
		warningMessages = []; // Clear warnings once shown
		// When the user clicks on <span> (x), close the warning
		closeBtn.onclick = function () {
			warningDialog.style.display = "none";
		};
		// When the user clicks anywhere outside of the warning, close it
		window.onclick = function (event) {
			if (event.target == warningDialog) {
				warningDialog.style.display = "none";
			}
		}
	}
};

function highlightWarningSymbols(color) {
	if (warningSymbols.length != 0) {
		warningSymbols.forEach(function (item) { item.style.color = color; });
	}
};

// Lazy color reset of all warning symbols that have been marked in red
function resetWarningSymbols(color) {
	if (warningSymbols.length != 0) {
		warningSymbols.forEach(function (item) { item.style.color = color; });
	}
	warningSymbols = [];
};

function initialize() {
	// Intialize golobal flags
	isValidSize = false;
	isValidRobotCommands = false;
	isValidPosition = false;
	resetWarningSymbols("#000000");
	screenTitle.innerHTML = "Please key-in map size and robot commands";
};

// Draw map based on validMap array, we are assured to
// get two different digits in it
function drawMap(validMap) {
	let rowsCount = validMap[0];
	let columnsCount = validMap[1];
	let tileSize = 60; // Size in pixels, must be changed in css also if modified here
	let tileSpacing = 0; // Spacing in pixels
	let mapHtml = "";
	let divId = "";

	// Empty div contair so we can drw the map in it
	workBench.innerHTML = "";
	workBenchWdith = (rowsCount * (tileSize + tileSpacing));
	workBenchHeight = (columnsCount * (tileSize + tileSpacing));

	if (workBenchWdith < 200)
		workBenchWdith = 200;

	workBench.style.width = workBenchWdith;
	workBench.style.height = workBenchHeight;

	// Loop through and draw tiles
	for (var column = 1; column <= columnsCount; column++) {
		mapGraph[column] = [];
		for (var row = 1; row <= rowsCount; row++) {
			divId = column + "-" + row;
			mapGraph[column][row] = divId;
			if ((column + row) % 2 == 0) {
				mapHtml += '<div id="' + divId + '" class="tile1 baseTile">' + divId + '</div>';
			} else {
				mapHtml += '<div id="' + divId + '"class="tile2 baseTile">' + divId + '</div>';
			}
		}
		mapHtml += '<br/>';
	};
	workBench.innerHTML = mapHtml;
};

// Plot path
function startMission(validFirstPosition, validCommands) {
	// Store initial start pos  
	startPosition = validFirstPosition;
	// Robot start position data
	let rowPos = validFirstPosition[0];
	let columnPos = validFirstPosition[1];
	let currentOrientation = robotStartOrientation;
	let orientationIndex = compass.indexOf(currentOrientation);
	// Map limits
	let mapWidth = mapGraph.length - 1;
	let mapHeight = mapGraph[1].length - 1;
	// Commands count
	let commandsCount = 0;

	missionReportHtml = "<div id='mission-report-div'>";
	missionReportHtml += "<h3><i>Mission report:</i></h3>";
	missionReportHtml += "<ul>";
	missionReportHtml += "<li>Matrix size: " + mapWidth + " x " + mapHeight + "</li>";
	missionReportHtml += "<li>Start position: " + columnPos + " " + rowPos + " " + robotStartOrientation + "</li>";
	missionReportHtml += "<li>Commands: " + validCommands.toString() + "</li>";
	missionReportHtml += "</ul>";

	// Mark starting position on the map
	let divId = mapGraph[columnPos][rowPos];
	document.getElementById(divId).style.backgroundColor = "#FF5733";
	document.getElementById(divId).innerHTML = "Start";

	// Execute commands
	for (cmdIndex in validCommands) {
		++commandsCount;
		let tempCommand = validCommands[cmdIndex];
		// Update orientation
		if (tempCommand == 'L') {
			orientationIndex -= 1;
			if (orientationIndex < 0)
				orientationIndex = compass.length - 1;
		} else if (tempCommand == 'R') {
			orientationIndex += 1;
			if (orientationIndex > compass.length - 1)
				orientationIndex = 0;
		};
		currentOrientation = compass[orientationIndex];
		// Handle walking
		if (validCommands[cmdIndex] == 'G') {
			// Check current orientation
			if (currentOrientation == 'N') {
				columnPos -= 1;
				if (columnPos < 1) { // Map tiles were drwan from index 1
					columnPos = 1;
					isRobotCrashed = true;					
					break;
				}
			} else if (currentOrientation == 'S') {
				columnPos += 1;
				if (columnPos > mapHeight) {
					columnPos = mapHeight;
					isRobotCrashed = true;					
					break;
				}
			} else if (currentOrientation == 'E') {
				rowPos += 1;
				if (rowPos > mapWidth) {
					rowPos = mapWidth;
					isRobotCrashed = true;					
					break;
				}
			} else if (currentOrientation == 'W') {
				rowPos -= 1;
				if (rowPos < 1) { // Map tiles were drwan from index 1
					rowPos = 1;
					isRobotCrashed = true;					
					break;
				}
			};
			divId = mapGraph[columnPos][rowPos];
			document.getElementById(divId).style.backgroundColor = "#FFC300";
		}
	};

	missionReportHtml += "<h4>Total commands executed: " + commandsCount + "</h4>";

	document.getElementById(divId).style.backgroundColor = "#FF5733";
	missionReportHtml += "<h4>Final position: " + divId + ", orientation to: " + currentOrientation + "</h4>";

	if (isRobotCrashed) {
		missionReportHtml += "<p class='robotCrashed'>Robot crashed during the mission!</p>";
		totalRobotCrash++;
	} else {
		missionReportHtml += "<p class='robotSafe'>Robot completed mission with success!</p>";
		totaRobotSuccess++;
	}
	missionReportHtml += "<button onclick='window.location.reload(false);'>Restart</button>"; // Simply reloads page for now!
	missionReportHtml += "</div>";
};

// Display missions report
function showReport(report) {
	workBench.innerHTML += report;
}