/** Global variables */
var offset; 				// Offset from the image in the canvas
var centerX, centerY;		// Center (coordinate ) of the canvas
var cellWidth,cellHeight;	// Height and width of the cell in the board game
var signSize;				// Size of the sign (X or O)
var boardWidth,boardHeight;	// Height and width of the board game
var myLayout;				// For layout settings
var westSize=500;			// Size of west layout
var conectedUser;			// Player object of player thar conected
var opponentPlayer;			// Player object of opponent
var isFirstPlayer;			// True if the conectedUser is the first player of the game
var isOnlineGame;			// True if conectedUser is now playing online game
var gameCounter;			// Count the step of the current game 
var currentGameId;			// Game Id of the current game
var movesArray;	   			// Create an empty array for moves of the game (Move object)
var winner;					// Will contain the winner player and the cells of victory
var counterMoves;			// Count the moves of the game (from 0 to 8)
var timeResponse;

/**
 * Run when the page DOM is ready
 *	set layout, top-10 table, builds tables and more...
 */
$(document).ready( function() {

	setLayout();					// Builds the layout
	checkDataBaseConnection();		// Check connection
	setTopTenTable(false);			// Set top-10 table
	buildeScoreBoard();				// Builde score board
	buildeLogTable();				// Builde log table
	
	// Hides some elements
	document.getElementById("canvasGame").style.display = "none";
	document.getElementById("screenSelection").style.display = "none";
	document.getElementById("westGame").style.display = "none";
	document.getElementById("lookingForPlayer").style.display = "none";
	
	$("#turn").hide();
	// Set ActionListener to click on  "play online"
	$("#btnPlayOnline").click(function(){
		isOnlineGame=true;
		lookingForPlayer();			// Looking for a player
	});
	
	// Set ActionListener to click on  "play vs. computer"
	$("#btnAgainsCom").click(function(){
		
		if(!checkIfPlayerIsPlaying()  || !isOnlineGame) { // If the player isn't playing now
			
			changePlayNow(conectedUser.id,1); // Set PlayNot as "1"- ture
			isOnlineGame=false;
			if(opponentPlayer==null){
				opponentPlayer = new Player("computer", "computer",null, "computer");
			}
			else if(opponentPlayer!=null){
				if(opponentPlayer.nickname!="computer"){
					opponentPlayer = new Player("computer", "computer",null, "computer");
				}
			}
			
			startGame();	// Start game	
		}
		else{
			showAlert("You can't play two different games at the same time", "", "error",4000);
		}
	});
});

/** 
 * Set ActionListener exit button or refresh
 */
$(window).bind('beforeunload', function(){
  return 'Are you sure you want to leave?';
});

/** 
 * Delete the rows of the log table 
 */
function deleteRowsFromtblMoves(){
	
	var table = $('#tblGameLog').DataTable();
	table.clear().draw();
}

/** 
 * Building  Scoreboard 
 * One in the center on other in the west
 */
function buildeScoreBoard() {

	// Scoreboard - west
	$("#Scoreboard").DataTable({
		bInfo : false, 			// Remove bInfo
		"bPaginate": false, 	// hide pagination control,
		bFilter:false,			// Remove search box
		"bLengthChange": false, // Remove the counter
		"ordering": false,
		"columnDefs":
			[
    			{ className: "dt-body-center", "targets": [ 0 ] },
    			{ className: "dt-body-center", "targets": [ 1 ] },
    			{ className: "dt-body-center", "targets": [ 2 ] },
    			{ className: "dt-body-center", "targets": [ 3 ] }
  			],
	});

	// Scoreboard - center
	$("#ScoreboardCenter").DataTable({
		bInfo : false, 			// Remove bInfo
		"bPaginate": false, 	// hide pagination control,
		bFilter:false,			// Remove search box
		"bLengthChange": false, // Remove the counter
		"ordering": false,
		"columnDefs":
			[
    			{ className: "dt-body-center", "targets": [ 0 ] },
    			{ className: "dt-body-center", "targets": [ 1 ] },
    			{ className: "dt-body-center", "targets": [ 2 ] }
  			],	
		"columns": [
					{"width": "33%" },
					{"width": "33%"},
					{"width": "33%"}
					]
	});
	
	$('.dataTables_paginate').remove(); // Remove the pagination
}


/**
 *  Add a new move to move-table
 */
function addNewMoveToTable(move){
	
	var table= $("#tblGameLog").DataTable();
	var arrayPositions= ['up-left','up-middle','up-right',
							'center-left','center-middle','center-right',
							'down-left','down-middle','down-right'];
	var toCell="cell:"+move.moveTo+ " (" + arrayPositions[move.moveTo]+")";
	var moveOfPlayer;
	
	if(isMyTurn()){
		moveOfPlayer=conectedUser.nickname +(isFirstPlayer? " (X) ":" (O) ");
	}
	else{
		moveOfPlayer=opponentPlayer.nickname +(isFirstPlayer? " (O) ":" (X) ");
	}
	
	// Add it to the table
	table.row.add([
					counterMoves,
					moveOfPlayer,
					toCell
					]).draw(false);
	counterMoves++;
}

/** 
 * Building the log table 
 */
function buildeLogTable() {

	$("#tblGameLog").DataTable({
		bInfo : false, 			// Remove bInfo 
		bFilter:false,			// Remove search box
		"bLengthChange": false, // Remove the counter
        "scrollCollapse": true,
		"order": [[ 0, "desc" ]],
		"aoColumnDefs": 
			[
				{"aTargets":[0], 
					"fnCreatedCell": function(nTd, sData, oData, iRow, iCol){
						$(nTd).css('background-color', '#eff6f8'); 
						$(nTd).css('text-transform', 'uppercase');
						$(nTd).css('text-align', 'center'); 					
						$(nTd).css('font-weight', 'bolder'); 					
						$(nTd).css('font-size', '15px'); 									
					}     
				},{	"aTargets":[1], 
					"fnCreatedCell": function(nTd, sData, oData, iRow, iCol){
						$(nTd).css('background-color', '#eff6f8'); 
						$(nTd).css('text-align', 'center'); 					
						$(nTd).css('font-weight', 'bolder'); 					
						$(nTd).css('font-size', '15px'); 
						$(nTd).css('height', '10px'); 
					}                  
				},{	"aTargets":[2], 
					"fnCreatedCell": function(nTd, sData, oData, iRow, iCol){
						$(nTd).css('background-color', '#eff6f8'); 
						$(nTd).css('text-align', 'left'); 								
						$(nTd).css('font-weight', 'bolder'); 					
						$(nTd).css('font-size', '15px'); 
						$(nTd).css('height', '10px'); 
					}                  
				}
			],

		"columns": [
					{"width": "6%" },
					{"width": "30%"},
						null
					]
	});
	$('.dataTables_paginate').remove(); // Remove the pagination
}

/**
 * Looking For a Player
 * Checking in Games-table for a open-game
 */
function lookingForPlayer(){
	
	// Hides the canvas ans the screen selection
	document.getElementById("canvasGame").style.display = "none";
	document.getElementById("screenSelection").style.display = "none";
	
	// Showing page loading 
	document.getElementById("lookingForPlayer").style.display = "block";
	
	// Looking-for a game in Games table by ajax
	// If found an Open-Game- start the game
	// If not - adds an "Open-Game" to the table and waits for a player
	$.ajax({ 
    	type: 'POST'
    	,url: 'ajax/findWaitingGame.php'
    	,data: {playerId:conectedUser.id}
   		}).success(function(returnValue){
   			if(returnValue.trim() =="user_already_play"){
   				showAlert("You can't play two games at same time.","", "info",20000);
				outOfAGame();
   			}
   			else{
   				returnValue=JSON.parse(returnValue);
	   			gameCounter =0;
	   			if(parseInt(returnValue.gameId)>-1){ // Found an Open-game 
	   				
	   				// Save the id of the opponent
	   				opponentPlayer=getPlayerById(parseInt(returnValue.playerId));
	   				// Save the id of the game
	   				currentGameId=returnValue.gameId;
	   				// Add the player to this game - in the Games table
	   				addOrUpdateGame(parseInt(conectedUser.id), parseInt( returnValue.gameId));
	   				// Set this player as No.2 (The second that joins to this game)
	   				isFirstPlayer=false;
	   				// Start the game
	   				startGame();
	   				// Set game as start!
	   				changeGameStatus(currentGameId,0); 
	   				
	   			}
	   			else{
	   				
	   				// Set this player as No.1
	   				isFirstPlayer=true;
	   				// There isn't an open game.
	   				// Open a new game (in Games table), and set the game as open-game.
	   				addOrUpdateGame(conectedUser.id, undefined);
	   				// Set game as wait
	   				changeGameStatus(currentGameId,-1);
	   				// Wait for a new game
	   				waitingforAnOpponent(function(){
	   					startGame();

	   				});
	   			}
   			}

	});
}

/** 
 * Build the game-board on the canvas.
 * Uses jCanvs
 */
function createBoardGame() {
	
	// Get the size of the boardGame
	boardWidth=$('#boardGame').width();
	boardHeight=$('#boardGame').height();
	
	var canvas = document.getElementById("canvasGame");
	canvas.width=boardWidth;	// Set the canvas size
	canvas.height=boardHeight;
	
	offset= parseInt(Math.min(boardWidth,boardHeight)/3*0.3); // Offset of the length of the image 
	
	centerX=boardWidth/2;		// Get the centre of the image
	centerY=boardHeight/2;		
	cellWidth=(boardWidth-offset*2)/3;		// Cell Dimensions 
	cellHeight=(boardHeight-offset*2)/3;
	
	$('#canvasGame').drawImage({ // Insert a image by jCanvas 
		source: 'images/Whiteboard_Background.png',
		x: 0, y: 0,
		width: boardWidth,
		height: boardHeight,
		fromCenter: false
	});
}

/** 
 * Draw a grid on canvas 
 * Uses jCanvs
 */
function drawGrid(){

	var lineWidth = 10;
	$('canvas').drawLine({	// Draw left vertical line 
	bringToFront: true,
		strokeStyle: '#000',
		strokeWidth: lineWidth,
		x1: parseInt(centerX-cellWidth/2), y1: offset,
		x2: parseInt(centerX-cellWidth/2), y2: boardHeight-offset,
	});
	$('canvas').drawLine({	// Draw right vertical line
		strokeStyle: '#000',
		strokeWidth: lineWidth,
		x1: parseInt(centerX+cellWidth/2), y1: offset,
		x2: parseInt(centerX+cellWidth/2), y2: boardHeight-offset,
	});
	$('canvas').drawLine({	// Draw left horizontal line 
		strokeStyle: '#000',
		strokeWidth: lineWidth,
		x1: offset, y1: parseInt(centerY-cellHeight/2),
		x2: boardWidth-offset, y2: parseInt(centerY-cellHeight/2),
	});
	$('canvas').drawLine({	// Draw right horizontal line
		strokeStyle: '#000',
		strokeWidth: lineWidth,
		x1: offset, y1: parseInt(centerY+cellHeight/2),
		x2: boardWidth-offset, y2: parseInt(centerY+cellHeight/2),
	});
}

/**
 * Insert a data to scoreboard table (showing during a game)
 * Deleting before entering
 */
function setScoreboard(){

	var table= $("#Scoreboard").DataTable();
	
	// Deletes all rows 
	table.clear().draw();
	
	// Add row to table
	var usertInformation = getPlayerById(conectedUser.id);
   		table.row.add([
   			usertInformation.nickname,
			usertInformation.wins,
			usertInformation.tie,
			usertInformation.losses
		]).draw(false);
	
	if(isOnlineGame){
		var opponentInformation = getPlayerById(opponentPlayer.id);
		 table.row.add([
   			opponentInformation.nickname,
			opponentInformation.wins,
			opponentInformation.tie,
			opponentInformation.losses
		]).draw(false);
	}
	else{
		 table.row.add([
   			opponentPlayer.nickname,
			opponentPlayer.wins,
			opponentPlayer.tie,
			opponentPlayer.losses
		]).draw(false);
	}
}

/**
 * Insert a data to main scoreboard table
 * Deleting before entering
 */
function setCenterScoreboard(){
	
	var centerTable= $("#ScoreboardCenter").DataTable();
	var usertInformation = getPlayerById(conectedUser.id);
	
	// Deletes all rows
	centerTable.clear().draw();
	
	// Add row to table
   		centerTable.row.add([
			usertInformation.wins,
			usertInformation.tie,
			usertInformation.losses
		]).draw(false);
}

/**
 * Build and insert a data to top-10 table
 * If Update is true - only update the data in the table
 */
function setTopTenTable(update){

	var table;
	if(!update){
		
		// Created the table
		$("#tblTopTen").DataTable({
			
			bInfo : false, 			// Remove bInfo
			"bPaginate": false, 	// hide pagination control,
			bFilter:false,			// Remove search box
			"bLengthChange": false, // Remove the counter
			"ordering": false,
			"columnDefs":
				[
	    			{ className: "dt-body-center", "targets": [ 1 ] },
	    			{ className: "dt-body-center", "targets": [ 2 ] },
	    			{ className: "dt-body-center", "targets": [ 3 ] }
	  			],
		});
		
		table=$("#tblTopTen").DataTable();
	}
	else{
		table= $("#tblTopTen").DataTable();
		table.clear().draw();
	}

	// Add row to table
	 $.ajax({
    	type: 'POST'
    	,url: 'ajax/getTopTen.php'
   		}).success(function(response){
   			
   			var returnsult=JSON.parse(response);
			returnsult.forEach( function (player){
				// Add the row
       				table.row.add([
					player.nickname,
					player.wins,
					player.tie,
					player.losses
					]).draw(false);
			});
    });		
}

/**
 * Run this function each click on the game board 
 * Checking the status of the game, and accordingly determines if mark the cell
 */

function clickHandler(event) {
	
	// Check the time response, if there is deleting it
	if(timeResponse!=null){
		clearTimeout(timeResponse);
		timeResponse=null;
	}
	
	var cellIndex = getCellIndex(event); // Get the cell that clicked
	
	if(!isMyTurn()){		// Checks the turn
		playSound("error");	// Play error audio
		showAlert("Error","This is not your turn!","error",1200);
		return;
	}
	else if(isCellMarked(cellIndex,null) ){  // Checks if already marked 
		playSound("error");	// Play error audio
		showAlert("Error","This cell is already marked!","error",1200);
		return;
	}
	else if(winner!=null){ // Checks if already we have a winner
		playSound("error");
		showAlert("Error","We have already a winner! Game over...","error",1200);
		return;
	}
	else if(isOnlineGame){	// Checks the kind of the game
		
		// Correct mark -  add to moves:
		addToMoves(conectedUser,cellIndex);
		setRecordGame(cellIndex,currentGameId);		// Send the cell to Games table
		
		// Draw a circle or "X" ? checks by "isFirstPlayer"
		if(isFirstPlayer){
			drawXOnCell(cellIndex, function(){
				checkWinsAndSet();		// Check if we have a winner			
			});	
		}
		else{
			drawCircleOnCell(cellIndex, function(){
				checkWinsAndSet();		
			});
		}
		
		gameCounter++;   // Increases the counter
		changeTurn();    // Change the turn
		
		
		if(!checkWins()){
			
			waitingToMarkingOfOpponent(function(){		// Wait for a opponent move
			checkWinsAndSet();
			
			// Limits the response 
			if(winner==null){
				timeResponse = setTimeout(function(){
					showAlert("Too long time response... Game Over.","","info",3000);
					disconnect();
				},30000);
			}
		});	
		}

	}
	else if(!isOnlineGame){  // The game is VS. computer
		addToMoves(conectedUser,cellIndex);
		if(isFirstPlayer){
			drawXOnCell(cellIndex, function(){
				checkWinsAndSet();
			});	
		}
		else{
			drawCircleOnCell(cellIndex, function(){
				checkWinsAndSet();
			});
		}
		gameCounter++;
		changeTurn();
		if(winner==null){
			computerTurn();
		}
	}
}


/**
 * Marks the cell (computer turn)
 */
function computerTurn(){
	
	setTimeout(function(){
		
		var cellIndex = nextCellForComputer(getMax);  			// Get the cell from the algorithm
		
		var newMove = new Move(opponentPlayer,cellIndex);
		addNewMoveToTable(newMove);							// Save the move
		movesArray[movesArray.length]=newMove;
		
		// Checks if the computer is "X" or "O" and marks
		if(!isFirstPlayer){
			drawXOnCell(cellIndex, function(){
					checkWinsAndSet();	
				});
		}
		else{
			drawCircleOnCell(cellIndex, function(){
					checkWinsAndSet();	
				});
		}
		changeTurn();
		
		// Checks if we have winner or tie
		if(checkWins() && winner==null){
			setWinOrTie();
		}
		else{
			gameCounter++;
			changeTurn();	
		}
	},700);
}

/**
 * Change the turn field
 * Change the text and the background-color
 */
function changeTurn(){
	
	var playerTurn;
	
	if(winner!=null){
		playerTurn= (winner[0]==-1? "Tie!":"Win: "+winner[0].nickname);
	}
	else if(isMyTurn()){
		// playerTurn=conectedUser.nickname +(isFirstPlayer? " (X) ":" (O) ") + " TURN";
		playerTurn=" MY TURN - " + (isFirstPlayer? " X ":" O ");
		$("#turn").css("background-color", "#CCFF00");// Yellow
	}
	else{
		playerTurn=opponentPlayer.nickname +(isFirstPlayer? " (O) ":" (X) ") +"TURN";
		$("#turn").css("background-color", "#0099FF"); // Blue
	}
	$("#turn").show();
	$("#turn").text(playerTurn);
}

/**
 * Checks for victory or a tie and update
 */
function checkWinsAndSet(){
	
	if(checkWins()){ // Checks if we have winner or tie
		if(isOnlineGame){
			changeGameStatus(currentGameId,1); // Set game as end
		}
		else{
			changePlayNow(conectedUser.id,0);// Set playNow=0 ->false
		}
		if(timeResponse!=null){
			clearTimeout(timeResponse);
			timeResponse=null;
		}
		setWinOrTie();		// Update the win/tie
		currentGameId=null;
	}
}

/** 
 * Alert: victory or a tie 
 *    and  marks the victory
 */
function setWinOrTie(){

	var messageTitle;
	var messageText;
	var messageUrl;
	
	if (winner[0]==-1){ // Tie
		
		incrementScore(conectedUser.id,"tie");
		if(!isOnlineGame){
			opponentPlayer.tie++;
		}
		messageTitle="Tie!";
		messageText="This is a Tie...";	
		// messageUrl="http://voltmag.co/wp-content/uploads/2014/07/Neck-Tie2.jpg";
		messageUrl="images/tie.jpg";
	}
	else{	// We have a winner
		
		if(conectedUser.id==winner[0].id){
			messageText="You win!!!";
			// messageUrl="http://www.moonjoggers.com/wp-content/uploads/2015/04/winner.png";
			messageUrl="images/winner.png";
			incrementScore(conectedUser.id,"win");
			if(!isOnlineGame){
				opponentPlayer.losses++;
			}
		}
		else{
			messageText=winner[0].nickname + " wins!";
			messageUrl="images/gameOver.jpg";
			incrementScore(conectedUser.id,"lose");
			if(!isOnlineGame){
				opponentPlayer.wins++;
			}
		}
		
		// Marks the victory
		mark3Cells(winner[1],winner[2],winner[3]);
	}
	
	swal({ // Alert by Sweetalert
		title: messageText,
		text: "Would you like continue playing?",
		imageUrl: messageUrl,
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Of-course!",
		cancelButtonText: "No, I need to go...",
		closeOnConfirm: true,
		closeOnCancel: true
	},
	function(isConfirm){
		
		if (isConfirm) {		// Continue playing online/offline
			if(isOnlineGame){
				lookingForPlayer();	
				deleteRowsFromtblMoves();
			}
			else{
				startGame();
				deleteRowsFromtblMoves();
			}
		} else {		// Stop playing
			outOfAGame();
		}
	});
}


/** 
 * Marks the cells of victory 
 */
function mark3Cells(cell1,cell2,cell3){
	
	var diff=cell2-cell1;
	var y_pos;
	var x_pos;
	var ellipsepWidth=boardWidth-offset*2;
	var diagonalAngle=0; //  Default ellipse angle in degrees
	// Horizontal victory - 0,1,2 or 3,4,5 or 6,7,8
	if(diff==1){
		y_pos=centerY;
		x_pos=boardWidth/2;
		if(cell2==1){
			y_pos-=cellHeight;
		}
		else if(cell2==7){
			y_pos+=cellHeight;
		}
	}
	// Vertical victory - 0,3,6 or 1,4,7 or 2,5,8
	else if(diff==3){
		x_pos=centerX;
		y_pos=boardHeight/2;
		if(cell2==3){
			x_pos-=cellWidth;
		}
		else if(cell2==5){
			x_pos+=cellWidth;
		}
		diagonalAngle=90;	// Ellipse angle in degrees
		ellipsepWidth=boardHeight-offset*2;
	}
	// Diagonal victory - 2,4,6 or 0,4,8
	else{
		diagonalAngle = Math.atan(boardHeight/boardWidth)*180/Math.PI;
		if(cell1==2){
			diagonalAngle=-diagonalAngle;
		}
		x_pos=boardWidth/2;
		y_pos=boardHeight/2;
	}
	
	$('canvas').drawEllipse({	// Draw a ellipse
	  strokeStyle: '#36c',
	  strokeWidth: 4,
	  x: x_pos, y: y_pos,	
	  width: ellipsepWidth, height: signSize*4,
	  rotate: diagonalAngle
	});
}

/**
 * Returns the number of player that marks this cell 
 */
function playerOfCell(cell){
	
	for (var i=0;i<movesArray.length;i++){
		if(movesArray[i].moveTo==cell){
			return movesArray[i].player;
		}
	}
	return -1; // Nobody mark
}

/**
 * Checks for a winner or a tie 
 * 		and returns the winner and a victory cells 
 */
function checkWins() {
	
	var player=null;
	
	if(!isCellMarked(0,null)&& !isCellMarked(4,null) && !isCellMarked(8,null)){
		return false;	// There is no victory and no a tie
	}
	else{
		if(isCellMarked(0,null)){
			player=playerOfCell(0);
			if(playerOfCell(1)==player && playerOfCell(2)==player){
				winner=[player,0,1,2];
				return true; // We have a winner
			}
			if(playerOfCell(4)==player && playerOfCell(8)==player){
				winner=[player,0,4,8];
				return true; // We have a winner
			}
			if(playerOfCell(3)==player && playerOfCell(6)==player){
				winner=[player,0,3,6];
				return true; // We have a winner
			}
		}
		if(isCellMarked(4,null)){
			player=playerOfCell(4);
			if(playerOfCell(1)==player && playerOfCell(7)==player){
				winner=[player,1,4,7];
				return true;
			}
			if(playerOfCell(3)==player && playerOfCell(5)==player){
				winner=[player,3,4,5];
				return true;
			}
			if(playerOfCell(2)==player && playerOfCell(6)==player){
				winner=[player,2,4,6];
				return true;
			}
		}
		if(isCellMarked(8,null)){
			player=playerOfCell(8);
			if(playerOfCell(2)==player && playerOfCell(5)==player){
				winner=[player,2,5,8];
				return true;
			}
			if(playerOfCell(6)==player && playerOfCell(7)==player){
				winner=[player,6,7,8];
				return true;
			}
		}
	}
	if (movesArray.length>8){
		winner=[-1];
		return true; // Tie
	}
	return false; // There is no victory and no a tie
}

/**
 * Add the cell to move array
 */
function addToMoves(player,cellIndex){
	
	var newMove = new Move(player,cellIndex);	
	addNewMoveToTable(newMove);	// Updating the table					
	movesArray[movesArray.length]=newMove;  // Save the move
}

/** 
 * Draw a circle in the cell
 */
function drawCircleOnCell(Cell, callBack){
	// Gets the Coordinates of the axes
	var indexY=Math.floor(Cell/3);	
	var indexX=Cell%3;
	// Gets the position
	var positioncenterX= indexX*cellWidth+cellWidth/2+offset;
	var positionCenterY= indexY*cellHeight+(cellHeight/2)+offset;
	
	// Draw a the circle by jCanvas
	$('canvas').drawArc({
	  strokeStyle: '#000',
	  strokeWidth: 5,
	  x: positioncenterX, y: positionCenterY,
	  radius: signSize,
	  start: 0, end: 360		// 360 Degrees, A full circle
	});
	
	callBack();
}

/**
 * return "true" if is my turn now
 */
function isMyTurn(){
	
	if(isFirstPlayer==true){
		// alert(gameCounter%2==0+ " " + gameCounter);
		return gameCounter%2==0;
	}
	else{
		// alert(gameCounter%2!=0 + " " + gameCounter);
		return gameCounter%2!=0;
	}
}

/**
 * Checks if the cell marked 
 */
function isCellMarked(cell, markedBy){
	
	for (var i=0;i<movesArray.length;i++){
		if(markedBy!=null){
			if(movesArray[i].player==markedBy && movesArray[i].moveTo==cell){
				return true;
			}
		}
		else{
			if(movesArray[i].moveTo==cell){
				return true;
			}
		}
	}
	return false; // No marks
}


/**
 * Return the cell that clicked 
 */
function getCellIndex(event){
	
	var x;
	var y;

	var canvas = document.getElementById("boardGame");	// Sets the boardGame as canvas element
	var rect = canvas.getBoundingClientRect();			// Sets the posiont of the canvas in the page	

	x= event.clientX -rect.left-canvas.offsetLeft;		// Sets the posiont of the event (mouse click)
	y= event.clientY -rect.top-canvas.offsetTop;
	
	var x_index;
	if(x<offset){ // If Clicked in the offset round it to 0 index
		x_index=0;
	}
	else if((x-offset)/cellWidth>=2){
		x_index=2;
	}
	else{
		x_index=Math.floor((x-offset)/(cellWidth));
	}
	
	var y_index;
	if(y<offset){
		y_index=0;
	}
	else if((y-offset)/cellHeight>=2){
		y_index=2;
	}
	else{
		y_index=Math.floor((y-offset)/(cellHeight));
	}
	// alert(y_index*3+x_index);
	return (y_index*3+x_index); // Calculates the cell number 
}

/** 
 * Draw a X in the cell 
 */
function drawXOnCell(Cell, callBack){
	signSize=30;
	// Gets the Coordinates of the axes
	var indexY=Math.floor(Cell/3);
	var indexX=Cell%3;
	// Gets the position
	var positioncenterX= indexX*cellWidth+cellWidth/2+offset;
	var positionCenterY= indexY*cellHeight+(cellHeight/2)+offset;
	
	// Draw a the "X" by jCanvas
	$('canvas').drawLine({ 
	  strokeStyle: '#000',
	  strokeWidth: 5,
	  x1: positioncenterX-signSize, y1: positionCenterY-signSize,
	  x2: positioncenterX+signSize, y2: positionCenterY+signSize,
	});
	$('canvas').drawLine({
	  strokeStyle: '#000',
	  strokeWidth: 5,
	  x1: positioncenterX+signSize, y1: positionCenterY-signSize,
	  x2: positioncenterX-signSize, y2: positionCenterY+signSize,
	});
	
	callBack();
}

/**
 * Actions during user log-in
 */
function setConectedUser(id, changeTo){

	// Get the player object and save in "conectedUser"
	conectedUser = getPlayerById(id);
	setCenterScoreboard();
	// changeConnected(conectedUser.id,changeTo);
	
	// Append the nickname of the player to "connected" - a logof button
	$("#connected").empty();
	$("#connected").append("<i class='fa fa-sign-out fa-2x ' onclick='location.reload(); '>"+conectedUser.nickname)+"</i>";
	$("#connected").css('cursor','pointer');
	
	// Welcom alert
	showAlert("Welcome",
			conectedUser.firstName + " "+ conectedUser.lastName +" - you are connected now!",
			"success",2000);
	
	// Hides some elements
	document.getElementById("formsStart").style.display = "none";
	document.getElementById("screenSelection").style.display = "inline";
	document.getElementById("lookingForPlayer").style.display = "none";
}

/**
 * Set the page for begining play mode
 */
function startGame(){
	
	$("#canvasGame").clearCanvas();	// Clear canvas
	createBoardGame();
	// Creates board-game
	setScoreboard();
	
	$("#screenSelection").fadeOut(700, "swing", function(){
			$("#canvasGame").fadeIn("slow","swing",function(){
				// document.getElementById("canvasGame").style.display = "inline";
						document.getElementById("lookingForPlayer").style.display = "none";
		// Create board-game and after data the grid on the board 
		drawGrid();
			});
	});
	
	$("#westStart").fadeOut("slow", "swing", function(){
		document.getElementById("westGame").style.display = "inline";
	});
	
	gameCounter =0;
	counterMoves=0;
	winner=null;
	movesArray=[];				// Reset the array of the moves object

	
	if(isOnlineGame){
		changeTurn();
		playOnline();
	}
	else{
		playOffline();
	}
}

/**
 * Back to selection screen
 */
function outOfAGame(){
	
	deleteRowsFromtblMoves();
	setCenterScoreboard();
	$("#canvasGame").fadeOut("slow", "swing", function(){
		document.getElementById("canvasGame").style.display = "none";
		document.getElementById("screenSelection").style.display = "inline";
		document.getElementById("lookingForPlayer").style.display = "none";
	});
	
	$("#westGame").fadeOut("slow", "swing", function(){
		setTopTenTable(true);
		document.getElementById("westStart").style.display = "inline";
	});
	
}

/**
 * Increment score - wins, lose, tie
 */
function incrementScore(playerId, column){
	
	var obj = {};
	obj['id']=playerId;
	obj['column']=column;
	 $.ajax({
		type: 'POST'
		,data: {"incrementScore":JSON.stringify(obj)}
		,url: 'ajax/incrementScore.php'
	   }).success(function(x){
		   //alert(x);
	});
}


/**
 * Play VS. other player
 */
function playOnline(){
	
	while(isFirstPlayer==undefined){}
	if(!isFirstPlayer){
		waitingToMarkingOfOpponent(function(){
			checkWinsAndSet();
			if(winner==null){
				timeResponse =setTimeout(function(){
					showAlert("Too long time response... Game Over.","","info",3000);
					disconnect();
				},30000);
			}
		});	
	}
	else{
		timeResponse =setTimeout(function(){
				showAlert("Too long time response... Game Over.","","info",3000);
				disconnect();
		},30000);
	}
}

/**
 * Play VS. computer
 */
function playOffline(){
	
	// Random: 1 or 2 -> Number of the player that starts the game
	var rand= Math.floor(Math.random()*2);
	if(rand==1){
		isFirstPlayer=true;
	}
	else{
		isFirstPlayer=false;
		changeTurn();
		computerTurn();
	}
	changeTurn();
}

/**
 * Check the field playNow
 * Return true if player is now playing
 */
function checkIfPlayerIsPlaying(){
	
	var tempPlayer = getPlayerById(conectedUser.id);
	if(tempPlayer.playNow==1){
		return true; // Player is now playing
	}
	else{
		return false;
	}
}

/**
 * Play mp3 file from "sounds" library
 */
function playSound(clickOrError){

	var audio = new Audio('sounds/'+clickOrError+'.mp3');
	audio.play();
}

/**
 * Disconnect the user and back to start mode
 */
function  disconnect(){

	 // Disconnect player
	//changeConnected(conectedUser.id,0);
	conectedUser=null;
	
	$("#connected").empty();
	document.getElementById("formsStart").style.display = "block";
	document.getElementById("canvasGame").style.display = "none";
	document.getElementById("screenSelection").style.display = "none";
	document.getElementById("westStart").style.display = "inline";
	document.getElementById("westGame").style.display = "none";
	setTopTenTable(true);
}

/**
 * show alert
 */
function showAlert(title, subTitle, type,timer){
	
	// Types which will show a corresponding icon animation: "warning", "error", "success" and "info". 
	swal({
		title: title,
		text: subTitle,
		timer: timer,
		type: type
	});
}

 
/** 
 * Object: Player
 * constructor: 1- player_name 
 */
function Player(firstName, lastName, email, nickname) {

	this.firstName = firstName;
	this.lastName = lastName;
	this.email = email;
	this.nickname = nickname;
	this.wins = 0;
	this.losses = 0;
	this.tie = 0;
	this.playNow = 0;
}

/** Object: Move 
 * constructor: 1-player_number (0 or 1) ,
 * 2-cell_number (0 to 8) of the game board 
 */
function Move(player,moveTo){
	
	this.player=player;		// Player number (the index in "playersArray"
	this.moveTo=moveTo;		// The number of the cell that marked
}

/**
 * Set the page layout
 */
function setLayout(){
		// Create the OUTER LAYOUT
	myLayout = $("body").layout({
		west__fxName:			"drop"
	,	west__size:				westSize
	});
	
	  $('#demo-form').on('form:validate.parsley', function (evt, formInstance) {

    // if one of these blocks is not failing do not prevent submission
    // we use here group validation with option force (validate even non required fields)
    if (formInstance.isValid('block1', true) || formInstance.isValid('block2', true)) {
      $('.invalid-form-error-message').html('');
      return;
    }
    // else stop form submission
    formInstance.submitEvent.preventDefault();

    // and display a gentle message
    $('.invalid-form-error-message')
      .html("You must correctly fill the fields of at least one of these two blocks!")
      .addClass("filled");
    return;
  });
}

/**
 * Sing-in validation
 */
function formSignInValidation(){

		formValidation(function(flag, player) {
			// Send a anonymous call-back function that perform after formValidation function
			// First run "formValidation" function, and after all run this anonymous function (below)
			if(flag){
				$.post('ajax/insertNewPlayer.php',
				{"player":JSON.stringify(player)},
				function(id){
					if(id.indexOf("Invalid")>=0){
						showAlert("Check the details","","error");
					}
					else{
						setConectedUser(id, 1);
					}
					
				});
			}			
		});
}

/**
 * Form Validation
 */
function formValidation(callBack){  
	
	var firstName = document.registration.firstName;  
	var lastName = document.registration.lastName;  
	var nickname = document.registration.nickname;  
	var email = document.registration.email;  
	var flag=true;
	
	if(!checkName(firstName.value)){	// Check first name
		showAlert("Warning","First name must be in English only and less than 10 chars.","warning");
		firstName.focus();
		flag=false;
	}
	else if(!checkName(lastName.value)){
		showAlert("Warning","Last name must be in English only and less than 10 chars.","warning");
		lastName.focus();
		flag=false;
	}
	else if(!checkNickName(nickname.value)){	// Check nickname
		showAlert("Warning","Nickname must be in English or digits only and less than 20 chars.","warning");
		nickname.focus();
		flag=false;
	}
	else if(checkIfNicknameExist(nickname.value)){	// Check if nickname exist in the system
		showAlert("Warning","Nickname already exists in the system, Select another nickname.","warning");
		nickname.focus();
		flag=false;
	}
	else if(!checkEmail(email.value)){ // Check email
		showAlert("Warning","Incorrect e-mail address.","warning");
		email.focus();
		flag=false;
	}
	
	var player  = new Player (firstName.value, lastName.value, email.value, nickname.value);
	callBack(flag, player);
}

/**
 * Checks name
 */
function checkName(name) { 
	
	// Set a regular expression
	var letters = /^[A-Za-z]+$/; 

	if(!name.match(letters)) {  // Run the regular expression
		return false;  
	}
	else if(name.length>10){	// Check the length
		return false;
	}
	else { 
		return true;  
	}  
}  

/**
 * Checks nickname
 */
function checkNickName(nickname)  {   
	
    var letters = /^[0-9a-zA-Z]+$/;
    //var flag=true;
    
    if(!nickname.match(letters)) {  // Run the regular expression
		return false;  
	}
	else if(nickname.length>20){ // Check the length
		return false;
	}
    
    return true;
 //   // Check if the nickname not exist in the DB
	// if(nickname.match(letters))  {  
	// 	$.ajax({
	// 	    url: "ajax/findNickName.php",
	// 	    type: "POST",
	// 	    async: false, 
	// 	    data: { nickname:nickname}
	// 			}).done(function( e ) {
	// 	    		if(e>-1){	// Exist
	// 		    		flag=false;
	// 	    		}
	// 			});
	// 	return flag;
	// }  
	// else  { 
	// 	return false;  
	// }
} 

/**
 * Check if the nickname not exist in the DB
 */
function checkIfNicknameExist(nickname){
	
	var flag;
	
	$.ajax({
    url: "ajax/findNickName.php",
    type: "POST",
    async: false, 
    data: { nickname:nickname}
		}).done(function( e ) {
    		if(e>-1){	// Exist - return true (by return the id of the user)
	    		flag=e;
    		}
		});
	// Return:
	// "true" - nickname exist (Return user id)
	// "false" - nickname not exist in ther database
	return flag;  
}

/**
 * Checks email
 */
function checkEmail(email)  {   
	
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  
    if(email.match(mailformat))  {  
    	return true;  
    }  

   	return false;  
}  

/**
 * Log-In validation
 */
function formLogInValidation(){
	
	var nickname = document.logIn.nickName_logIn;
	var userId = checkIfNicknameExist(nickname.value); // Can return "true" (id number) or "false" (not exist)
	if(userId){
		setConectedUser(userId,1);
	}
	else{
		showAlert("Unknown nickname","please sign in or try againg.","error");	
	}
	
	// $.ajax({
	//     url: "ajax/findNickName.php",
	//     type: "POST",
	//     async: false, 
	//     data: { nickname:nickname1.value}
	// 		}).done(function(id) {
	// 			if(id>-1) {
	// 				setConectedUser(id,1);
	// 			}
	// 			else{
	// 				showAlert("Unknown nickname","please sign in or try againg.","error");
	// 			}
	// 		});
}

/**
 * Ajax for get player object of player-id
 */
function getPlayerById(id){
	
	var player;
	 $.ajax({
		type: 'POST'
		,data: { id:id}
		,url: 'ajax/getPlayerById.php'
		,async: false
	   }).success(function(response){
		   	player=JSON.parse(response);
	});
	return player;
}

/**
 * Ajax for change playNow in Player table
 */
function changePlayNow(playerId, changeTo){
	
	var obj = {};
	obj['playerId']=playerId;
	obj['changeTo']=changeTo;
	 $.ajax({
		type: 'POST'
		,data: {"changePlayNow":JSON.stringify(obj)}
		,url: 'ajax/changePlayNow.php'
		,async: false
	   }).success(function(x){
		   	// alert("KKKKKK"+x);
	});
}

/**
 * Ajax change game status
 */
function changeGameStatus(gameId, changeTo){
	
	var obj = {};
	obj['gameId']=gameId;
	obj['changeTo']=changeTo;
	// alert(obj['gameId']);
	$.ajax({
		type: 'POST'
		,data: {"changeGameStatus":JSON.stringify(obj)}
		,url: 'ajax/changeGameStatus.php'
		,async: false
	   }).success(function(x){
		   	// alert("KKKKKK"+x);
	});
}

/**
 * Ajax for add a cell to recordGame in Games table
 */
function setRecordGame(cellNum, gameId){
	
	var obj = {};
	obj['cellNum']=cellNum;
	obj['gameId']=gameId;

	 $.ajax({
		type: 'POST'
		,data: {"addRecoredGame":JSON.stringify(obj)}
		,url: 'ajax/addToRecordGame.php'
		,async: false
	   }).success(function(x){
	   		return x;
	});	
}

/**
 * Ajax - Waiting for an opponent
 * Out from the game if its long time
 */
function waitingforAnOpponent(callBack){
	
    var obj = {};
	obj['counter']=0;
	obj['gameId']=currentGameId;

    $.ajax(
        {
            type: 'GET',
            url: 'ajax/checkForNewPlayer.php',
            data: {"data":JSON.stringify(obj)},
            success: function(data){
            	if(data.indexOf("time") > -1){
            		// Not found a player
            		showAlert("Can't find a player!","Try again later", "info",10000);
					outOfAGame(); //
            	}
            	else if(parseInt(data.trim())==conectedUser.id){
            		showAlert("You can't play against yourself!","Create a new user", "info",10000);

					outOfAGame();
            	}
            	else{
	            	opponentPlayer=getPlayerById(data);
					callBack();            		
            	}

            }
        }
    );
}

/**
 * Ajax - Waiting until the cell is marked by an opponent
 */
function waitingToMarkingOfOpponent(callBack){
	
    var obj = {};
	obj['counter']=gameCounter;
	obj['gameId']=currentGameId;
	// alert(gameCounter + "----" + currentGameId);
    $.ajax({
	        type: 'GET',
	        url: 'ajax/server.php',
	        data: {"data":JSON.stringify(obj)},
	        success: function(data){
	        	// Opponenet doesn't respond
	        	if(data.indexOf("time") > -1 && conectedUser!=null 
	        			&& winner==null && currentGameId!=null){
	        				
            		showAlert("The opponenet doesn't respond, you win!", "","info",3000);
            		incrementScore(conectedUser.id,"win");
 					// Exit from the game
					outOfAGame();
            	}
            	// Opponenet respond,  got the cell
            	else if(data.indexOf("time") < 0){
		        	var cell = data.substr(data.length-1);   // Get the cell
			        
			        addToMoves(opponentPlayer,cell);
			        
			        // Draw
		        	if(isFirstPlayer){
		        		drawCircleOnCell(cell, function(){
		        			callBack();
		        		});
		        	}
		        	else{
		        		drawXOnCell(cell,function(){
		        			callBack();	
		        		});	
		        	}
					gameCounter++;
					changeTurn();            		
	        }
        }
    });
}

/**
 * Checks DataBase Connection
 */
function checkDataBaseConnection(){

	 $.ajax({
    	type: 'POST'
    	,url: 'db/RestartDB.php'
   		}).success(function(response){
   			// alert(response);
    	});	
}


/**
 * Add second player or add new game 
 * if "gameId"=NULL -> add new game
 * if "gameId"= number -> add a second player
 */
function addOrUpdateGame(id,gameId){
	
	var obj = {};
	obj['id']=id;
	obj['gameId']=gameId;

	 $.ajax({
		type: 'POST'
		,data: {"addUpdateGame":JSON.stringify(obj)}
		,url: 'ajax/addOrUpdateGame.php'
		,async: false
	   }).success(function(x){
	   		x=x.replace(/(\r\n|\n|\r)/gm,"");
	   		x=x.trim();
		   	if(currentGameId==undefined || currentGameId==null || !isNaN(x)){
		   		currentGameId=x;
		   	}
	});
}


/**  Simple algorithm for select a cell to mark in computer turn */
function nextCellForComputer(callBack){
	
	var associativeArray = {};
	for(var i=0; i<9;i++){
		if(!isCellMarked(i,null)){
			associativeArray[i]=getScore(i);
			// alert(i+" " +associativeArray[i]);
		}
	}
	// alert(callBack(associativeArray));
	return callBack(associativeArray);
}

function getMax(associativeArray){
	var max=null;
	for(var x in associativeArray){
		if(max<associativeArray[x] || max==null){
			max=associativeArray[x];
		}
	}
	for(var y in associativeArray){
		if(max==associativeArray[y]){
			return y;	
		}
	}
}

function getScore(newPosiont){
	
	var array=[];

	for(var i=0;i<9;i++){
		if(i==newPosiont){
			array[i]=1;
			continue;
		}
		if(isCellMarked(i,opponentPlayer)){
			array[i]=1;
		}
		else if(isCellMarked(i,null)){
			array[i]=-1;
		}
		else
			array[i]=0; 
	}
	var positionts=[];
	var sum=0;
	for(i=0;i<9;i++){
		if(i==0){
			positionts=[0,1,2];
			sum=getScoreOfRow(array,positionts);
		}
		else if(i==1){
			positionts=[3,4,5];
			sum+=getScoreOfRow(array,positionts);
		}
		else if(i==2){
			positionts=[6,7,8];
			sum+=getScoreOfRow(array,positionts);
		}
		else if(i==3){
			positionts=[0,3,6];
			sum+=getScoreOfRow(array,positionts);
		}
		else if(i==4){
			positionts=[1,4,7];
			sum+=getScoreOfRow(array,positionts);
		}
		else if(i==5){
			positionts=[2,5,8];
			sum+=getScoreOfRow(array,positionts);
		}
		else if(i==6){
			positionts=[0,4,8];
			sum+=getScoreOfRow(array,positionts);
		}
		else if(i==7){
			positionts=[2,4,6];
			sum+=getScoreOfRow(array,positionts);
		}
	}
	// alert(sum);
	return sum;
}

function getScoreOfRow(array, positions){
	
	var sum=array[positions[0]]+array[positions[1]]+array[positions[2]];
	if(sum==3){
		return 1000;
	}
	else if(sum==2){
		return 100;
	}
	else if(sum==-3){
		return -1000;
	}
	else if(sum==-2){
		return -100;
	}
	else if(sum==0){
		return 0;
	}
	else if(sum==-1){
		if(array[positions[0]]!=0 && array[positions[1]]!=0  && array[positions[0]]!=0){
				return 1;
			}
		else
			return -10;
	}
	else if(sum==1){
		if(array[positions[0]]!=0 && array[positions[1]]!=0  && array[positions[0]]!=0){
				return -1;
			}
		else
			return 10;
	}
}
