<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
$ini = parse_ini_file("dbconfig.ini");
$username = $ini['username'];
$password = $ini['password'];
$database = $ini['database'];
$host = $ini['host'];
$db = new mysqli($host, $username, $password, $database);



//function generating uniqye id

/*
Generate a unique 24 characters userid
add it to the users database
return the value to the user as php response
the user then will save this in localstorage and uset it.
*/
  if(isset($_POST['userId'])){
    if ($db->connect_errno > 0) {
      die('Unable to connect to database [' . $db->connect_error . ']');
    } else {
      if (!($stmt = $db->prepare("call divorce (?)"))) {
        echo "Prepare failed: (" . $db->errno . ") " . $db->error;
      }
      $userId = ($_POST['userId']);
      $stmt->bind_param('i', $userId);
      if (!$stmt->execute()) {
        $response = array(
          "status"=>"failed",
          "errno"=>$stmt->errno,
          "error"=> $stmt->error);
        }
        else{
          $response = array(

            "status"=>"sucess",
            "errno"=>$stmt->errno,
            "error"=> $stmt->error
          );
        }
        $stmt->close();
      }
      echo json_encode($response);
    }
  ?>
