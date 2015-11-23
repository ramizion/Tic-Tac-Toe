

<?php
    // A simple PHP script demonstrating how to connect to MySQL.
    // Press the 'Run' button on the top to start the web server,
    // then click the URL that is emitted to the Output tab of the console.

    $servername = getenv('IP');
    $username = getenv('C9_USER');
    $password = "";
    $database = "c9";
    $dbport = 3306;
    $tableName= "Playes";
      
    // Create connection
    $db = new mysqli($servername, $username, $password, $database, $dbport);

    // Check connection
    if ($db->connect_error) {
        die("Connection failed: " . $db->connect_error);
    } 
    echo "Connected successfully (".$db->host_info.")";
    
    // ctrate table
  
    // $sql = "CREATE TABLE " . $tableName . " (
    //         id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    //         firstName VARCHAR(20) NOT NULL,
    //         lastName VARCHAR(30) NOT NULL,
    //         email VARCHAR(50),
    //         registrationDate TIMESTAMP
    // )";
    
    // if( $db-> query($sql) == TRUE) {
    //     echo "Table created successfully!";
    // }
    // else {
    //     echo "Error creating table: " . $db->error;
    // }
    

    date_default_timezone_set('Asia/Jerusalem'); 
    
     $sql = "INSERT INTO " . $tableName . " (firstName, lastName, email)
            VALUES ('John', 'Doe', 'john@example.com')";
    
    if ($db->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    
    $sql = "SELECT id, firstName, lastName, email, registrationDate FROM " . $tableName;
    $result = $db->query($sql);
    
    if ($result->num_rows > 0) {
    // output data of each row
        print "<br>";
        while($row = $result->fetch_assoc()) {
            echo "id: " . $row["id"]. " - Name: " . $row["firstName"]. " " 
            . $row["lastName"]. " email: " . $row["email"] . " registrationDate: " . $row["registrationDate"] .  "<br>";
        }
    } else {
        echo "0 results";
    }
    $db->close();
?>

