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
if(isset($_POST['uniqueId'],$_POST['longitude'],$_POST['latitude'],
         $_POST['accuracy'],$_POST['timeReceived'])){
  if ($db->connect_errno > 0) {
    die('Unable to connect to database [' . $db->connect_error . ']');
  } else {
    if (!($stmt = $db->prepare("call updateLocation (?,?,?,?,?)"))) {
      echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
    }
    $uniqueId = ($_POST['uniqueId']);
    $longitude = ($_POST['longitude']);
    $latitude = ($_POST['latitude']);
    $accuracy = ($_POST['accuracy']);
    $timeReceived = ($_POST['timeReceived']);

    $stmt->bind_param('sddii', $uniqueId, $latitude, $longitude , $accuracy,$timeReceived);

    echo $stmt->fullQuery;


    if (!$stmt->execute()) {
      echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
    }
    $stmt->close();
  }
}
  ?>
