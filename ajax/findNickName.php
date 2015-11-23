<?php

    include "../db/DBCommunication.php";

    if(isset($_POST['nickname'])==true && empty($_POST['nickname'])===false){
        
        $dbconncet = new DbComunication();
        
        // kepp only the string of the nickname
        $nickname=mysqli_real_escape_string($dbconncet -> db, $_POST['nickname']);
        $returnValue = $dbconncet -> getIdOfPlayerNic($nickname);
        
        // Return the id of a nickname
        echo $returnValue;
    }
   
?>