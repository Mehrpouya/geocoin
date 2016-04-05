<?php
header('Content-Type: application/json');
$ini = parse_ini_file("dbconfig.ini");
$username = $ini['username'];
$password = $ini['password'];
$database = $ini['database'];
$host = $ini['host'];
$db = new mysqli($host, $username, $password, $database);

/*
remember whenever updating a new user as part of the process first move their location to the archived location and always keep the last location in the table. but in the beginning just inset user locaitons. 
*/
/*if (isset($_POST['who']) && isset($_POST['containsThis']) && isset($_POST['containsThat']) && isset($_POST['thenTweet'])) {
    $_POST = array_map("strip_tags", $_POST);
    $_POST = array_map("trim", $_POST);
    if ($db->connect_errno > 0) {
        die('Unable to connect to database [' . $db->connect_error . ']');
    } else {
        $sth = $db->prepare("INSERT INTO `tweetRules` (`who`,`ruleName`, `containsThis`, `containsThat`,`notThis`, `thenTweet`,`catName`) VALUES (?,?,?,?,?,?,?) ");
        $sth->bind_param('sssssss'
                , ($_POST['who'])
                , ($_POST['ruleName'])
                , ($_POST['containsThis'])
                , ($_POST['containsThat'])
                , ($_POST['notThis'])
                , ($_POST['thenTweet'])
                , ($_POST['catName']));
        $OK = $sth->execute();
        // return if successful or display error
        if ($OK) {
            $response = "Success";
        } else {
            $response = "Something went wrong.";
        }
        echo $response;
        $sth->close();
    }
}*/

?>