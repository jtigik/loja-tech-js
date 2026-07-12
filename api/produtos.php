<?php
header('Content-Type: application/json');
// require_once '../backend/connect.php';
$stmt = $pdo->query("SELECT * FROM produtos;");
echo json_encode($stmt->fetchAll());
?>