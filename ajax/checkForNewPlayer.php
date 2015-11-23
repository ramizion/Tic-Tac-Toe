<?php

include "../db/DBCommunication.php";
$dbconncet = new DbComunication();

 $data = json_decode($_GET["data"]);
 
 $gameId = $data->gameId;
 $counter = $data->counter;

$timeStart= time();

while (true) { // Infinite loop until break 

    $answer=$dbconncet-> waitingForOpponent($gameId);
    if (intval(trim($answer,"\n"))>0){
     // Found an opponent
        echo $answer;
        break;
    } 
    elseif(time()-$timeStart>30){
        // Too long time
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
