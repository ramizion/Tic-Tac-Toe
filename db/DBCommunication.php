<?php

    include "../ajax/Player.php";
    //  Class for communication with the DataBase
    class DbComunication{
    
        private $password;
        private $database;
        private $dbport;
        private $playersTableName;
        private $servername;
        private $username;
        //private $playNow;
        
        public $db;
        /** Opens a connection the database */
        
        function __construct() {
           
            $this-> password ="";
            $this-> database = "c9";
            $this-> dbport = 3306;
            $this-> playersTableName = "Players";
            $this-> gamesTableName="Games";
            $this-> servername = getenv('IP');
            $this-> username = getenv('C9_USER');
    
           // Create connection
            $this->  openConnection();
        }
        
        /**
         * Open connection to DB
         * Saved the connection in "db" 
         */
        public function openConnection(){
            
            $this -> db = new mysqli($this->servername, $this->username,
                $this->password, $this->database, $this->dbport);
        }
        
        /**
         * Close connection to DB
         */
        public function closeConnection(){
            
            $this-> db -> close();
        }
    
        /**
         * Check connection to DB
         * Return "Sucessfully" or "failed"
         */
        public  function checkConnection(){

            // 
            if ($db->connect_error) {
                return "Connection failed: " . $db->connect_error;
            } 
            
            return "Connected successfully (".$db->host_info.")";
        }
        
        /**
         * Create players table
         * (delete if exists)
         */
        public  function createPlayersTable(){
         
            $this -> db-> query("DROP TABLE IF EXISTS " . $this -> playersTableName);
            $sql = "CREATE TABLE " . $this -> playersTableName . " (
                    id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
                    firstName VARCHAR(20) NOT NULL,
                    lastName VARCHAR(20) NOT NULL,
                    email VARCHAR(50)NOT NULL,
                    nickname VARCHAR(20) NOT NULL,
                    wins INT(10) NOT NULL,  
                    losses INT(10) NOT NULL,
                    tie INT(10) NOT NULL,
                    playNow INT(1) NOT NULL
            )";
            
            if( $this -> db-> query($sql) == TRUE) { // Create the table
                return "Table created successfully!";
            }
            else {
                return "Error creating players table: " . $this -> db->error;
            }
        }
        
        /**
         * Create games table 
         * (delete if exists)
         */
        public  function createGamesTable(){
            
            $this -> db-> query("DROP TABLE IF EXISTS " . $this -> gamesTableName);
            $sql = "CREATE TABLE " . $this -> gamesTableName . " (
                    id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
                    playerX_id INT(9) NOT NULL,
                    playerO_id INT(9),
                    recordGame VARCHAR(17),
                    gameStatus INT(1) 
            )";
            // GameStatus -> wait=(-1), start=0, end=1
            
            if( $this -> db-> query($sql) == TRUE) { // Create the table
                return "GamesTable created successfully!";
            }
            else {
                return "Error creating games table: " .  $this -> db->error;
            }   
        }
        
        /**
         * Insert new player to the database
         * Table: Players 
         */
        public  function insertNewPlayer($player){
        
            $sql = "INSERT INTO " . $this -> playersTableName . " 
                    (firstName, lastName, email, nickname, wins, losses, tie, playNow)
                    VALUES ('" . $player->firstName . "', '" . $player->lastName . "', '"
                            . $player->email . "', '" . $player->nickname . "', " 
                            . $player->wins . ", "  . $player->losses . ", "
                            . $player->tie . ", 0)";
            
            if ($this -> db-> query($sql) === TRUE) {
                // New player created successfully
                // Return the Id of the new player (last insert)
                $last_id = $this -> db->insert_id;
                return  $last_id;
            } else {
                return "Error: " . $sql . "<br>" . $conn->error;
            }
        }
        
        /**
         * Insert new game to the database
         * Table: Players 
         */
        public  function insertNewGame($firstPlayer){
        
            $sql = "INSERT INTO " . $this -> gamesTableName . " 
                    (playerX_id)
                    VALUES (" . $firstPlayer . ")";
            
            if ($this -> db-> query($sql) === TRUE) {
                // New game created successfully
                // Return the Id of the new game (last insert)
                $last_id = $this -> db->insert_id;
                return  $last_id;
            } else {
                return "Error: " . $sql . "<br>" . $conn->error;
            }
        }
        
        /**
         * Get the id of the player nickname
         * Returns id number if nickname exists or "-1" if not
         */
        public  function getIdOfPlayerNic($nickname){
            
            $sql = "SELECT id FROM " . $this -> playersTableName . "
                    WHERE nickname = '" . $nickname . "'";
            $result = $this -> db->query($sql);
            
            $row = $result->fetch_assoc();
            
            if ($result->num_rows !=0) {
                return $row['id'];
            } 
            else {
                return -1;
            }
        }
        
        /**
         * Get the player object of a id player
         * Returns player-object  if id exists in DB or "-1" if not
         */
        public  function getPlayerbyId($userId){
            
            $sql = "SELECT * FROM " . $this -> playersTableName . "
                    WHERE id = '" . $userId . "'";
            $result = $this -> db->query($sql);
            
            $row = $result->fetch_assoc();
            
            if ($result->num_rows !=0) {
                
                $player = new Player($row['id'], $row['firstName'],
                    $row['lastName'], $row['email'], $row['nickname'], $row['wins'], $row['losses'],
                    $row['tie'], $row['playNow']);
                return $player;
            } 
            else {
                return -1;
            }
        }
        
        /**
         * Incrementt the score of a player in DB
         * Allows update the fields: wins, losses, tie
         */
        public function incrementScore($column, $playerId){
           
            $sql="UPDATE " . $this -> playersTableName . " SET ";
        
            if(strtolower($column)=="wins") {
               $sql .= "wins = wins+1 WHERE id=" . $playerId ; //  Appends 
            }
            else if(strtolower($column)=="lose") {
               $sql .= "losses= losses+1 WHERE id=" . $playerId ;
            }
            else{
               $sql .= "tie=tie+1 WHERE id=" . $playerId;
            }
           
            if ($this -> db-> query($sql) === TRUE) {
                return "Record updated successfully";
            } else {
                return $sql . " Error updating record: " . $conn->error;
            }
        }

        
        /**
         * Runs a calculation query for weighting the top 10
         * Return player-object array of the top 10
         */
        public function getTopTen2(){
           
            $sql = "SELECT nickname, wins, tie, losses, 
                    (wins+tie-losses) AS weighting  FROM " . $this -> playersTableName .
                        " ORDER BY weighting  DESC limit 10";
            $topTen = array();

            $result = $this -> db->query($sql);
            
            if ($result->num_rows > 0) {
                // output data of each row
                while($row = $result->fetch_assoc()) {
                    array_push($topTen, $row );
                }
                return $topTen;
            } else {
                echo "0 results";
            }
        }
        
        /**
         * Change playNow filed 
         * From 0(false - not playing) to 1(true - playing) 
         * Return the value
         */
        public function changePlayNowTo ($id, $changeTo){
           
            $sql = "UPDATE " . $this -> playersTableName . " SET playNow =" . $changeTo . 
                    " WHERE id=". $id;  
                    //echo $sql;
            $this -> db->query($sql);
            
            echo $changeTo;
        }
        
        /**
         * Return the playNow field of player (by id)
         */
        public function getPlayNowOfId($id){
            
            $sql = "SELECT playNow FROM " . $this -> playersTableName .
                        " WHERE id=". $id;
            $result = $this -> db->query($sql);
            
            $row = $result->fetch_assoc();
            
            echo $row['playNow'];
        }
        
        /**
         * Inser new game to the Games table 
         * return game id
         */
        public function newGame($playerId){
            
           // setGameStatus($playerId,-1); // Set wait status
            $sql = "INSERT INTO " . $this -> gamesTableName . " 
                        (playerX_id) VALUES ( ". $playerId ." )";

            if ($this -> db-> query($sql) === TRUE) {
                // New game created successfully
                // Return the Id of the new game (last insert)
                $last_id = $this -> db->insert_id;
                $this -> setGameStatus($last_id,-1); // Set wait status
                return  $last_id;
            } else {
                return "Error: " . $sql . "<br>" . $conn->error;
            }  
        }
        
        /**
         * Return the id of the game with one player only 
         * return game id
         */
        public function getidOfGameWithOnePlayer(){
        
            $sql = "SELECT id, playerX_id  FROM " . $this -> gamesTableName .
                    " WHERE playerO_id is NULL and recordGame is NULL";

            $result = $this -> db->query($sql);
            
            if ($result->num_rows > 0) {
                
                $row = $result->fetch_assoc();
                $returnFun= array("gameId" => $row['id'], "playerId" => $row['playerX_id']);
                return $returnFun;
            } else {
                return -1;
            }
        } 
        
        /**
         * Add second player to open game 
         * Open game = game with only one player
         */
        public function addSecondPlayerToGame($playerId, $gameId){
        
            
            $sql = "UPDATE " . $this -> gamesTableName . 
                    " SET  playerO_id= " . $playerId . " WHERE id= " . $gameId;
            
            if ($this -> db-> query($sql) === TRUE) {
                $this -> setGameStatus($gameId,0); // Set start
                return   "Record updated successfully";
            } else {
                return $sql . "Error updating record: " . $conn->error;
            }
            
        }
        
        /**
         * Delete a game from Games table, by id
         */
        public function deleteGame($gameId){
            
            $sql = "DELETE from " . $this -> gamesTableName . " WHERE id= " . $gameId;
            
            if ($this -> db-> query($sql) === TRUE) {
                return   "delete successfully";
            } else {
                return $sql . $gameId ."Error updating record: " . $conn->error;
            }
        }
        
        /**
         *  Return the recordGame field of a game id
         * 
         */
        public function getRecordGameOfGame($gameId) {
        
            $sql = "SELECT recordGame  FROM " . $this -> gamesTableName .
                    " WHERE id=" . $gameId ;

            $result = $this -> db->query($sql);
            
            if ($result->num_rows > 0) {
                
                $row = $result->fetch_assoc();
                return $row['recordGame'];
            } else {
                return -1;
            }
        }
        
        /**
         * Add the game id to the player 
         * This field indicates that the player is now playing (num>=0)
         * "-1-" ---> indicates that the player isn't now playing (but maybe he is conncted)
         */
        public function setGameIdToPlayer($playerId, $gameId){
            
            $sql = "UPDATE " . $this -> playersTableName . " SET " .
                    " gameId= " . $gameId . " WHERE id= " . $playerId;
            
            if ($this -> db-> query($sql) === TRUE) {
                return "Record updated successfully";
            } else {
                return "Error updating record: " . $conn->error;
            }
        }
        
        /**
         * Add the cell to record-game field
         * 
         */
        public function addCellToRecordGame($cellNum, $gameId){
            
            // =CONCAT(recordGame,',1')
            
            $sql = "UPDATE " . $this -> gamesTableName . " SET ";
            if(($this-> getRecordGameOfGame($gameId)=="" || empty($this->getRecordGameOfGame($gameId)))&&
                        $this-> getRecordGameOfGame($gameId)!="0"){
                $sql.=" recordGame= '" . $cellNum . "' WHERE id=" . $gameId ;
            }

            else{
                $sql.=" recordGame=CONCAT(recordGame,'," . $cellNum . "')  WHERE id=" . $gameId ;
            }

            if ($this -> db-> query($sql) === TRUE) {

                return $sql . 1;
            } else {
                return $sql . -1;
            }
        }
        
        /**
         * Checks if the field player-O is exist
         * 
         */
        public function waitingForOpponent($gameId){
            
            $sql = "SELECT playerO_id FROM " . $this -> gamesTableName . " WHERE id=" . $gameId;

            $result = $this -> db->query($sql);
            
            if ($result->num_rows > 0) {
                
                $row = $result->fetch_assoc();
                $answer = $row['playerO_id'];
                
                if(!is_null($answer)){
                    return $answer;
                }
                else{
                    return -1;
                }
            } else {
                return -1;
            }
        }

        /**
         * Set the game status
         * 
         */
        public function setGameStatus($gameId, $status){
            
           // GameStatus -> wait=(-1), start=0, end=1
            $sql="UPDATE " . $this -> gamesTableName . " SET gameStatus=" . $status . " WHERE id=" . $gameId ;
            // echo $sql;
           
            if ($this -> db-> query($sql) === TRUE) {
                return "Record updated successfully";
            } else {
                return $sql . " Error updating record: ". $gameId;
            } 
        }
        
        /**
         * Set the game status
         * 
         */
        public function checkPlayerInGamesTable($playerId){
            
        //   select * from Games where gameStatus<1 and (playerX_id=1 OR playerO_id=1);
            $sql="SELECT * FROM " . $this -> gamesTableName . " WHERE gameStatus<1 and " . 
                " (playerX_id=" . $playerId . " OR playerO_id=" . $playerId . ")";
            $result = $this -> db->query($sql);
            
            $row = $result->fetch_assoc();
            
            if ($result->num_rows ==0) {
                return true;
            } 
            else {
                return false;
            }
        }
    }

?> 