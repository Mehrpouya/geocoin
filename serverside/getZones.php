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
//if user passes long and lat and radius then we will return zones in this proximity otherwise return all zones.
if(isset($_GET['longitude'],$_GET['latitude'],$_GET['radius'])){
  if ($db->connect_errno > 0) {
    die('Unable to connect to database [' . $db->connect_error . ']');
  } else {
  }
}
else{
  if ($db->connect_errno > 0) {
    die('Unable to connect to database [' . $db->connect_error . ']');
  } else {
    $returned_array = array();
    $sql = "select * from point_zones where status='on'";
    if (!$result = $db->query($sql)) {
      die('There was an error running the query [' . $db->error . ']');
    }
    while ($row = $result->fetch_assoc()) {
      $returned_array[] = $row;
    }
    echo json_encode($returned_array);
  }
}
?>
