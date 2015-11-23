
    <?php
    include "../db/DBCommunication.php";
    $dbconncet = new DbComunication();
    
    $dbconncet -> setGameStatus(454,1);
    //  echo $dbconncet -> addCellToRecordGame(7, 19);    
     
    //  $timeStart= time();
    //  while (true) {

    // $answer=$dbconncet-> waitingForOpponent(277);
    // if (intval(trim($answer,"\n"))>0){
    //  // echo "==". $gameId. " - " .$counterOfrecordGame . "-- " . $recordGame;
    //     echo $answer;
    //     break;
    // } 
    // elseif(time()-$timeStart>5){
    //     echo $dbconncet-> deleteGame(277);
    //     echo "timeOut";
    //     break;
    // }
    // else {
    //     // wait for 1 sec 
    //     sleep( 1 );
    //     continue;
    // }
    // }

     
    //   $returnValue =$dbconncet -> getidOfGameWithOnePlayer();
     
    // echo json_encode($returnValue);
    
    
    // $counter=1;
    
    // $recordGame=$dbconncet-> getRecordGameOfGame(26);
    // if ((empty($recordGame) && $recordGame!=0) || is_null($recordGame)){
    //     $counterOfrecordGame=0;
    // }
    // else{
    //     $counterOfrecordGame = (strlen($recordGame)+1)/2;
    // }
    
    // echo $counterOfrecordGame . " " . $counter  ;
    
    // if($counterOfrecordGame > $counter) {
        
    //  // echo "==". $gameId. " - " .$counterOfrecordGame . "-- " . $recordGame;
    //     echo "<br>" . $recordGame;
    // }
    // else{
    //     echo "stam";
    // }
     
    //  echo $answer = $dbconncet -> waitingForOpponent(12);
     
    //   if (intval(trim($answer,"\n"))==1){
    //       echo "rami";
    //   }