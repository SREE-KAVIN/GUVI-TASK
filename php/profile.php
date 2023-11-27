<?php

$mongodb_link = "mongodb+srv://mithun:mithun@cluster0.gyeyuvq.mongodb.net/?retryWrites=true&w=majority";
$mongodb_database = "guvi";
$mongodb_collection = "guvi";
$redis = new Redis();
$redis->connect('127.0.0.1', 6379);

$mongo = new MongoDB\Driver\Manager($mongodb_link);

$redisId = $_GET['redisID'];
$username = $redis->get("session:$redisId");

$filter = ['username' => $username];
$options = [];
$query = new MongoDB\Driver\Query($filter, $options);

$cursor = $mongo->executeQuery("$mongodb_database.$mongodb_collection", $query);

$document = current($cursor->toArray());
$response = array(
    'status' => true,
    'newUser' => false,
    'userDetails' => $document,
    'username' => $username,
);

if ($document) {
    sendResponse(200, $response);
} else {
    sendResponse(200, array(
        'status' => false,
        'message' => 'No documentation',
    ));
}

function sendResponse($statusCode, $response) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
?>
