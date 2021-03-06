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

/*
php to mysql, for adding zones.
*/
if ($db->connect_errno > 0) {
  die('Unable to connect to database [' . $db->connect_error . ']');
} else {
  if(isset($_GET['longitude'],$_GET['latitude'],
  $_GET['radius'],$_GET['zoneType'],$_GET['forWho'])){
    if ($db->connect_errno > 0) {
      die('Unable to connect to database [' . $db->connect_error . ']');
    } else {
      if (!($stmt = $db->prepare("INSERT INTO `point_zones`(`latitude`, `longitude`, `radius`, `zoneType`,`value`,`status`,`forWho`) values (?,?,?,?,?,?,?)"))) {
        echo "Prepare failed: (" . $db->errno . ") " . $db->error;
      }
      $longitude = ($_GET['longitude']);
      $latitude = ($_GET['latitude']);
      $radius = ($_GET['radius']);
      $zoneType = ($_GET['zoneType']);
      $value = ($_GET['value']);
      $status = ($_GET['status']);
      $forWho = ($_GET['forWho']);
      $stmt->bind_param('ddisdss', $latitude, $longitude , $radius,$zoneType,$value,$status,$forWho);
      if (!$stmt->execute()) {
        $response = array(
          "status"=>"failed",
          "errno"=>$stmt->errno,
          "error"=> $stmt->error);
        }
        else{
          $response = array(
            "status"=>"sucess");
          }
          $stmt->close();
        }
        echo json_encode($response);
      }
    }
    ?>
