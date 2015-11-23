<?php
    include "../db/DBCommunication.php";

    if(isset($_POST['setGameId'])==true && empty($_POST['setGameId'])===false){
    
        $setGameId = json_decode($_POST["setGameId"]);
        $dbconncet = new DbComunication();
        
        // Set the game id in the Player table
        echo $dbconncet -> setGameIdToPlayer($setGameId->playerId,$setGameId->gameId);
    }