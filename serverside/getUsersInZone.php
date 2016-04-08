<?php
/*
Copyright (C) 2016 Hadi Mehrpouya <http://www.hadi.link>
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.


Author: Hadi Mehrpouya
Research Project title: After Money, University of Edinburgh in collaboration with New Economic Foundation (NEF) and Royal Bank of Scotland (RBS)

*/
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
      echo "Prepare failed: (" . $db->errno . ") " . $db->error;
    }
    $uniqueId = ($_POST['uniqueId']);
    $longitude = ($_POST['longitude']);
    $latitude = ($_POST['latitude']);
    $accuracy = ($_POST['accuracy']);
    $timeReceived = ($_POST['timeReceived']);
    $stmt->bind_param('sddii', $uniqueId, $latitude, $longitude , $accuracy,$timeReceived);
    if (!$stmt->execute()) {
      echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
    }
    $stmt->close();
  }
}
  ?>
