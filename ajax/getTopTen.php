<?php

    include "../db/DBCommunication.php";
     
    $dbconncet = new DbComunication();
    
    // Return json of top-10 list
    $send = $dbconncet -> getTopTen2();
    echo json_encode($send);

?>