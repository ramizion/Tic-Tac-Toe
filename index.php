<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
	
	<!-- Icon-->
	<link rel="shortcut icon" href="favicon.ico">

	<!--Keywords-->
	<meta content="tic tac toe, online tic tac toe, Xs and Os, " name="keywords">
	
	<!--Title-->
	<title>Tic Tac Toe</title>
	
	<!-- jQuery  -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	
	<!-- Layout - js Files:  http://layout.jquery-dev.com/index.cfm -->
	<script type="text/javascript" src="js/jquery-latest.js"></script>
	<script type="text/javascript" src="js/jquery.layout-latest.js"></script>
	
	<!-- my JavaScript file  -->
	<script type='text/javascript' src='js/myScript.js'></script>
	
	<!-- DataTables: http://www.sitepoint.com/working-jquery-datatables/--> 
	<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/r/dt/dt-1.10.9/datatables.min.css"/>

	<!-- js for DataTables  -->
	<script type="text/javascript" src="https://cdn.datatables.net/r/dt/dt-1.10.9/datatables.min.js"></script>
	
	<!-- jCanvs -->
	<script src="https://cdn.rawgit.com/caleb531/jcanvas/master/jcanvas.min.js"></script>

	<!-- animate: http://daneden.github.io/animate.css/ -->
	<link href="css/animate.css" rel="stylesheet">

	<!-- MyStyle - css File -->
	<link href="css/myStyle.css" rel="stylesheet">
	
	<link href="css/selectionGameBth.css" rel="stylesheet">
	
	<!-- CSS file for form style  Copied from http://www.sanwebe.com/2014/08/css-html-forms-designs #1--> 
	<link href="css/formStyle.css" rel="stylesheet">
	
	<!-- Sweet Alert  -->
	<script src="Extensions/sweetalert.min.js"></script>
	<!-- CSS Sweet Alert  -->
	<link rel="stylesheet" type="text/css" href="Extensions/sweetalert.css">
	<!-- Font Awesome - css File: https://fortawesome.github.io/Font-Awesome/-->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
	

</head>
<body>
	
<!-- ***\\Center//***
	 including:  board-game and Registration-form-->
	 
<div class="ui-layout-center">
	<div class="ui-layout-content" id="boardGame">
		
		<!-- Canvas of the game board by  jCanvs-->
		<canvas id="canvasGame" width=350 height=250 onclick="javascript: clickHandler(event);"></canvas>
		
		<div id="lookingForPlayer">
			Looking for a player... <br>
			<i class="fa fa-spinner fa-pulse fa-5x"></i>
		</div>	
		
		<!-- Screen selection the game  -->
		<div id="screenSelection">
			<!-- Button: "Play Online" -->
			<button type="button" class="btn firstBtn" id="btnPlayOnline">
				<i class="fa fa-user fa-fw"></i> PLAY ONLINE<br>   (2 PLAYERS)
				<!--<i class="fa fa-user fa-fw"></i> -->
			</button>
			<!-- Button: "computer vs. player" -->
			<button type="button" class="btn btn-lg" id="btnAgainsCom">
				<i class="fa fa-laptop fa-fw"></i> COMPUTER <br> VS.<br>PLAYER
			</button>
			<!-- Scorecard of connected Player -->
			<div class="headerCenter">
				<!-- Table title-->
				<i class="fa fa-trophy fa-spin"></i> <U>MY SCOREBOARD</U> <i class="fa fa-trophy fa-spin"> </i>
			</div>
			<br>
			<table id="ScoreboardCenter"  align="center" class="display compact cell-border hover" cellspacing="0" width="50%">
				<thead>
					<tr>
						<th class="tblCol  tblColWins dt-body-center">   WINS   </th>
						<th class="tblCol  tblColWins dt-body-center">   TIE   </th>
						<th class="tblCol  tblColWins dt-body-center">   LOSSES   </th>
					</tr>
				</thead>
			</table>
		</div>
			
		<!-- Refistration and logIn forms -->
		<div id="formsStart" class="button-container">
			<!-- Registration form designed by form style css -->
			<form name='registration' action="" method="post">  
				<div class="form-style-1">  
					<div> <h1 class="formTitle"> <u> Sign In </u> </h1></div>
				    <li> <!-- Full name - First and last name on the same line are divided to 2 text-field -->
				    	<label>Full Name <span class="required">*</span></label>
				    	<input type="text" name="firstName" class="field-divided" placeholder="First" />&nbsp;
				    	<input type="text" name="lastName" class="field-divided" placeholder="Last" />
					</li>
					<li> <!-- Nick name -->
       					<label>Nickname <span class="required">*</span></label>
        				<input type="text" name="nickname" class="field-long" placeholder="your nickname" />
    				</li>
 
					<li> <!-- Email -->
       					<label>Email <span class="required">*</span></label>
        				<input type="email" name="email" class="field-long" placeholder="your email" />
    				</li>
				    <li> <!-- Submit by formValidation JS function -->
				        <input onClick="formSignInValidation();" type="button" value="Sing In"  />
				    </li>
				</div>	
			</form>
			
			<!-- logIn from designed by form style css -->
			<form name='logIn'  action="" method="post"onsubmit="return false" >
				<div class="form-style-1" > 
					<div> <h1 class="formTitle"><u> Log In</u></h1></div>
					<li> <!-- Nick name -->
	   					<label>Nickname <span class="required">*</span></label>
	    				<input type="text" name="nickName_logIn" class="field-select" placeholder="your nickname" />
	    			</li>
				    <li> <!-- Submit by formValidation JS function -->
				        <input type="button" value="Log In" onClick="formLogInValidation();"/>
				    </li>
				</div>
			</form>
		</div>
	</div>
</div>

<!-- ***\\West//*** 
	including: top10-table -->
	
<div class="ui-layout-west">
	<div class="ui-layout-content">
		
		<!-- top10-Table -->
		<div id="westStart">
			<!-- Table title-->
			<div class="header">
				<i class="fa fa-trophy fa-0.5x"></i>  TOP 10 <i class="fa fa-trophy fa-0.5x"> </i>
			</div>
			<!-- Table -->
			<table id="tblTopTen" class="display compact cell-border hover" cellspacing="0" width="100%">
				<thead>
					<tr>
						<th class="tblCol  tblColPlayer"> PLAYER </th>
						<th class="tblCol  tblColWins" >   WINS   </th>
						<th class="tblCol  tblColWins">   TIE   </th>
						<th class="tblCol  tblColWins">   LOSSES   </th>
					</tr>
				</thead>
			</table>
		</div>
		
		<!-- West when game start -->
		<div id="westGame">
			
			<!-- Field "current turn"-->
			<div id="turn"><i class='fa fa-arrow-circle-o-right'></i></div><hr><hr>
			
			<!-- Scorecard of connected Player -->
			<div class="header">
				<!-- Table title-->
				<i class="fa fa-trophy"></i>  SCOREBOARD <i class="fa fa-trophy"> </i>
			</div>
			<table id="Scoreboard" class="display compact cell-border hover" cellspacing="0" width="90%">
				<thead>
					<tr>
						<th class="tblCol  tblColPlayer"> PLAYER </th>
						<th class="tblCol  tblColWins">   WINS   </th>
						<th class="tblCol  tblColTie">   TIE   </th>
						<th class="tblCol  tblColLossess">   LOSSES   </th>
					</tr>
				</thead>
			</table>
			
			<!-- Log table -->
			<table id="tblGameLog" class="display compact cell-border order-column hover" cellspacing="0" width="100%">
				<div class="header"><hr><hr>
					<i class="fa fa-list-alt"></i> Game log
				</div>
				<thead>
					<tr>
						<th class="tblCol tblindex">   INDEX   </th>
						<th class="tblCol tblLogColPlayer"> PLAYER </th>
						<th class="tblCol tblLogMove">   MOVE   </th>
					</tr>
				</thead>
			</table>
		</div>
	</div>
</div>

<!-- ***\\North//***
	 including: header -->
	 
<div class="ui-layout-north">
	<p class="headerAnimation animated bounceInLeft headerStart">Tic-Tac-Toe.</p>
	<small id="connected"></small>
</div>

<!-- South, including: footer -->
<div class="ui-layout-south">
Copyright ©	Rami Zion
</div>


</body>
</html>