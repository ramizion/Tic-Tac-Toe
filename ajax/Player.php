<?php
    class Player {
        
        public $firstName;
        public $lastName;
        public $email;
        public $nickname;
        public $wins;
        public $losses;
        public $tie;
        public $playNow;
        
        function __construct($id,$firstName, $lastName, $email,$nickname, $wins, $losses ,$tie, $playNow) {
           
            $this -> id = $id;
            $this -> firstName = $firstName;
            $this -> lastName = $lastName;
            $this -> email = $email;
            $this -> nickname = $nickname;
            $this -> wins = $wins;
            $this -> losses = $losses;
            $this -> tie = $tie;
            $this -> playNow = $playNow;
        }  
    }
?>