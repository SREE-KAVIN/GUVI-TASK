<?php
$servername = "sql12.freesqldatabase.com";
$username = "sql12606419";
$password = "wCimSR1VNb";
$database = "sql12606419";
$redis = new Redis();

$redis->connect('redis-17424.c15.us-east-1-2.ec2.cloud.redislabs.com', 17424);
$conn = mysqli_connect($servername, $username, $password, $database);

if (mysqli_connect_errno()) {
    $response = array(
        'status' => false,
        'message' => 'Failed to connect to the database',
    );
    sendResponse(200, $response);
}

$username = $_POST['username'];
$verifyPassword = $_POST['password'];
ini_set('session.save_handler', 'redis');
ini_set('session.save_path', 'tcp://127.0.0.1:6379');

$loginSql = "SELECT username, password, mongoDbId FROM users WHERE username = ?";
$loginStmt = mysqli_stmt_init($conn);

if (!mysqli_stmt_prepare($loginStmt, $loginSql)) {
    $response = array(
        'status' => false,
        'message' => 'Statement preparation failed',
    );
    sendResponse(200, $response);
}

mysqli_stmt_bind_param($loginStmt, "s", $username);
mysqli_stmt_execute($loginStmt);
mysqli_stmt_bind_result($loginStmt, $fetchedUsername, $fetchedPassword, $mongoDbId);
$value = mysqli_stmt_fetch($loginStmt);

if (!$value) {
    $response = array(
        'status' => false,
        'message' => 'Invalid User',
    );
    sendResponse(200, $response);
}

if (password_verify($verifyPassword, $fetchedPassword)) {
    $session_id = uniqid();
    $redis->set("session:$session_id", $fetchedUsername);
    $redis->expire("session:$session_id", 1000 * 60);

    $response = array(
        'status' => true,
        'message' => 'Success',
        'session_id' => $session_id,
        'data' => array(
            'username' => $fetchedUsername,
            'mongoDbId' => $mongoDbId,
        ),
    );

    sendResponse(200, $response);
} else {
    $response = array(
        'status' => false,
        'message' => 'Invalid Password',
    );
    sendResponse(200, $response);
}

mysqli_stmt_close($loginStmt);
mysqli_close($conn);

function sendResponse($statusCode, $response) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
?>
