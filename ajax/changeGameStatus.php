<?php
    
    include "../db/DBCommunication.php";
    
    // Change gameStatus in Games Table
    
    if (isset($_POST['changeGameStatus'])==true && empty($_POST['changeGameStatus'])===false) {
        
        // Decode our JSON into PHP objects
        $changeGameStatus = json_decode($_POST["changeGameStatus"]);
        
        $dbconncet = new DbComunication();
        
        
       // GameStatus -> wait=(-1), start=0, end=1
        if($changeGameStatus -> changeTo<=1 && $changeGameStatus -> changeTo>=-1){
            
            $returnValue = $dbconncet -> setGameStatus($changeGameStatus -> gameId , $changeGameStatus -> changeTo);
            echo $returnValue;   
        }
        else{
            echo "Error"; 
        }
    }
?>