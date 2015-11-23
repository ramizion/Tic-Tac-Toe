<?php

    include "../db/DBCommunication.php";

    if(isset($_POST['id'])==true && empty($_POST['id'])===false){
    
        $dbconncet = new DbComunication();
        
        $returnValue =$dbconncet -> getPlayerbyId($_POST['id']);
        // Return the Player object of the player id
        echo json_encode($returnValue);
    }

?>