<?php

    include "../db/DBCommunication.php";

    // Checks the input
    if (isset($_POST["player"]) && empty($_POST['player'])===false)  {
    
        // Decode our JSON into PHP objects
        $player = json_decode($_POST["player"]);
        
        $regex = "/[A-Za-z]{1,20}/"; // Regular Expression: Only English letters, Up to 20 characters
        // Check if the email is a valid email address
        if (filter_var($player->email, FILTER_VALIDATE_EMAIL) === false) {
          echo "Invalid email";
        }
        elseif(preg_match($regex, $player->firsName, $match)){
            echo "Invalid firstName";
        }

        else{ // Taking Only the string -> Cancel injection
            $dbconncet = new DbComunication();
            $player->firsName =  mysqli_real_escape_string($dbconncet -> db, $player->firsName);
            $player->lastName =  mysqli_real_escape_string($dbconncet -> db, $player->lastName);
            $player->nickname =  mysqli_real_escape_string($dbconncet -> db, $player->nickname);
            
            echo $dbconncet -> insertNewPlayer($player);
        }
    }
   
?>