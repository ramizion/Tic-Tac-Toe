<?php

include "../db/DBCommunication.php";
$dbconncet = new DbComunication();

$data = json_decode($_GET["data"]);
 
$gameId = $data->gameId;
$counter = $data->counter;

$timeStart= time();

while (true) {  // Infinite loop until break  

    $recordGame=$dbconncet-> getRecordGameOfGame($gameId);
    
    // Get the length of the recordGame from the table
    if ((empty($recordGame) && $recordGame!=0) || is_null($recordGame)){
        $counterOfrecordGame=0;
    }
    else{
        $counterOfrecordGame = (strlen($recordGame)+1)/2;
    }

    if($counterOfrecordGame > $counter) {
        // Return recordGame
        echo $recordGame;
        break;
    } 
    elseif(time()-$timeStart>30){       // Check id the time has passed
        // Return time-out
        $dbconncet-> deleteGame($gameId);
        echo "timeOut";
        break;
    }
    else {  
        // wait for 1 sec
        sleep( 1 );
        continue;
    }
    
}

