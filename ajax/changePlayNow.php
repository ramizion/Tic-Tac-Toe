<?php
    
    include "../db/DBCommunication.php";
    
    // Change the connected field in Players table
    
    if (isset($_POST['changePlayNow'])==true && empty($_POST['changePlayNow'])===false) {
        
        // Decode our JSON into PHP objects
        $changePlayNow = json_decode($_POST["changePlayNow"]);
        
        $dbconncet = new DbComunication();

        $returnValue = $dbconncet -> changePlayNowTo($changePlayNow -> playerId , $changePlayNow -> changeTo);
        echo $returnValue;  
    }
?>