<?php
$servername = "sql12.freesqldatabase.com";
$username = "sql12606419";
$password = "wCimSR1VNb";
$database = "sql12606419";
$redis = new Redis();
$redis->connect('127.0.0.1', 6379);
$conn = mysqli_connect($servername, $username, $password, $database);

if (mysqli_connect_errno()) {
    die("Failed to connect to the database: " . mysqli_connect_error());
}

echo "Server connected";

// PREPARING STATEMENT
$insertSql = "INSERT INTO users (username, password, mongoDbId) VALUES (?, ?, ?)";
$insertStmt = mysqli_stmt_init($conn);

if (!mysqli_stmt_prepare($insertStmt, $insertSql)) {
    die("SQL error: " . mysqli_stmt_error($insertStmt));
}

// DATA FROM POST REQUEST
$username = $_POST['username'];
$password = $_POST['password'];
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$mongoDbId = NULL;

mysqli_stmt_bind_param($insertStmt, "sss", $username, $hashedPassword, $mongoDbId);

// Execute the statement
if (!mysqli_stmt_execute($insertStmt)) {
    die("Execution failed: " . mysqli_stmt_error($insertStmt));
} else {
    $session_id = uniqid();
    $redis->set("session:$session_id", $username);
    $redis->expire("session:$session_id", 1000 * 60);
    
    $response = array(
        'status' => true,
        'message' => 'Success',
        'session_id' => $session_id,
        'data' => array(
            'username' => $username,
            'password' => $password, // Consider if you really want to include the password in the response
            'mongoDbId' => $mongoDbId,
        ),
    );
    echo json_encode($response); // Output the response as JSON
}

// Close the statement and connection
mysqli_stmt_close($insertStmt);
mysqli_close($conn);
?>
