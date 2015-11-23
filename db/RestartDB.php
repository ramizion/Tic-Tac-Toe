<?php
    include "../db/DBCommunication.php";
     
    $dbconncet = new DbComunication();
    
    echo $dbconncet -> checkConnection(); 
    
    //Creates  a new table (deletes, if exist)
    //echo $dbconncet ->createPlayersTable();
    //echo $dbconncet ->createGamesTable();
    
    
    //להוסיף סיסמא או משהו שמונע מכל אחד לגשת
?>