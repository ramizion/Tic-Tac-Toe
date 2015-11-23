
<?php
    include "../db/DBCommunication.php";
        
    if (isset($_POST['addUpdateGame'])==true && empty($_POST['addUpdateGame'])===false) {
        
        // Decode our JSON into PHP objects
        $addUpdateGame = json_decode($_POST["addUpdateGame"]);
        
        $dbconncet = new DbComunication();

       if(empty($addUpdateGame->gameId)){
         // Adds a new game to Games id
         echo $dbconncet ->  newGame($addUpdateGame->id);
       }
       else{
          // Adds to game id a second player
          echo $dbconncet ->addSecondPlayerToGame($addUpdateGame->id, $addUpdateGame->gameId); 
       }
    }
