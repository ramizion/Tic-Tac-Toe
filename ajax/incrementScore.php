<!-- increment the score-->
<?php
    include "../db/DBCommunication.php";

    // Checks the input
    if(isset($_POST['incrementScore'])==true && empty($_POST['incrementScore'])===false){
    
        $incrementScore = json_decode($_POST["incrementScore"]);
        $dbconncet = new DbComunication();
        
        if($incrementScore->column == "win"){
            // Increment to "wins"
           $returnValue= $dbconncet -> incrementScore("wins",$incrementScore->id);
        }
        else if($incrementScore->column =="lose"){
           $returnValue= $dbconncet -> incrementScore("lose",$incrementScore->id);
        }
        else if($incrementScore->column=="tie"){
           $returnValue= $dbconncet -> incrementScore("tie",$incrementScore->id);
        }
        else{
           $returnValue = $incrementScore->column . " Error"; 
        }

        echo $returnValue;
    }
