
<?php
    include "../db/DBCommunication.php";
        
if (isset($_POST['addRecoredGame'])==true && empty($_POST['addRecoredGame'])===false) {
        
    // Decode our JSON into PHP objects
    $recoredGame = json_decode($_POST["addRecoredGame"]);
    
    $dbconncet = new DbComunication();
    
    // Add the cell to record game
    echo $dbconncet -> addCellToRecordGame($recoredGame->cellNum, $recoredGame->gameId);        
}
