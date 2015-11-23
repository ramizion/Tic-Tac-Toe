<?php

    include "../db/DBCommunication.php";

    $dbconncet = new DbComunication();
    
    if (isset($_POST['playerId'])==true && empty($_POST['playerId'])===false) {
        
        $returnValue =$dbconncet -> checkPlayerInGamesTable($_POST['playerId']);
        if($returnValue==true){
            $returnValue =$dbconncet -> getidOfGameWithOnePlayer();
            // Return the id of a Game with one player 
            echo json_encode($returnValue);
        }
        else{
            echo "user_already_play";
        }
    }
    

?>