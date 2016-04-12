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
updating point_zones. This php file, will update zones as enabling and disabling them, also deleting them.
*/
if ($db->connect_errno > 0) {
  die('Unable to connect to database [' . $db->connect_error . ']');
} else {
  if(isset($_POST['type'])){
    if($_POST['type']=="money"){
      if(isset($_POST['zoneId'],$_POST['userId'])){
        if ($db->connect_errno > 0) {
          die('Unable to connect to database [' . $db->connect_error . ']');
        } else {
          if (!($stmt = $db->prepare("call userInMoneyZone (?,?)"))) {
            echo "Prepare failed: (" . $db->errno . ") " . $db->error;
          }
          $zoneId = $_POST['zoneId'];
          $userId = $_POST['userId'];
          $stmt->bind_param('si', $userId, $zoneId);
          if (!$stmt->execute()) {
            echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
          }
          $stmt->close();

        }
      }
    }
    else if($_POST['type']=="negativeZone"){
      if(isset($_POST['zoneId'],$_POST['userId'])){
        if ($db->connect_errno > 0) {
          die('Unable to connect to database [' . $db->connect_error . ']');
        } else {
          if (!($stmt = $db->prepare("call userInNegativeZone (?,?)"))) {
            echo "Prepare failed: (" . $db->errno . ") " . $db->error;
          }
          $zoneId = $_POST['zoneId'];
          $userId = $_POST['userId'];
          $stmt->bind_param('si', $userId, $zoneId);
          if (!$stmt->execute()) {
            echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
          }
          $stmt->close();

        }
      }
    }
    else if($_POST['type']=="positiveZone"){
      if(isset($_POST['zoneId'],$_POST['userId'])){
        if ($db->connect_errno > 0) {
          die('Unable to connect to database [' . $db->connect_error . ']');
        } else {
          if (!($stmt = $db->prepare("call userInPositiveZone (?,?)"))) {
            echo "Prepare failed: (" . $db->errno . ") " . $db->error;
          }
          $zoneId = $_POST['zoneId'];
          $userId = $_POST['userId'];
          $stmt->bind_param('si', $userId, $zoneId);
          if (!$stmt->execute()) {
            echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
          }
          $stmt->close();

        }
      }
    }
  }
}
?>
