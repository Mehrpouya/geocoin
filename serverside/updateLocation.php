<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
$ini = parse_ini_file("dbconfig.ini");
$username = $ini['username'];
$password = $ini['password'];
$database = $ini['database'];
$host = $ini['host'];
$db = new mysqli($host, $username, $password, $database);

/*
remember whenever updating a new user as part of the process first move their location to the archived location and always keep the last location in the table. but in the beginning just inset user locaitons. 
*/

//function generating uniqye id

/*
Generate a unique 24 characters userid
add it to the users database
return the value to the user as php response
the user then will save this in localstorage and uset it.
*/
if(isset($_GET['uniqueId'],$_GET['longitude'],$_GET['latitude'],$_GET['accuracy'],$_GET['timeReceived'],$_GET['accuracy'])){
    if ($db->connect_errno > 0) {
        die('Unable to connect to database [' . $db->connect_error . ']');
    } else {
        // $uniqueId = uniqid('', true);
        // $sth = $db->prepare("INSERT INTO `users` (`uniqueId`) VALUES (?) ");
        // $sth->bind_param('s'
        //         , ($uniqueId));
        // $OK = $sth->execute();
        // // return if successful or display error
        // if ($OK) {
        //     $response = array(
        //         "status"=>"sucess",
        //         "uniqueId"=>$uniqueId);
        // } else {
            $response = array(
                "status"=>"failed");
        // }
        echo json_encode($response);
        $sth->close();
    }
}
?>