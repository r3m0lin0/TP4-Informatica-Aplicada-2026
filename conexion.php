<?php
// Datos de conexión a la base de datos (MAMP PRO).
// Si da "Access denied", probá cambiar $password a "" (vacío).
$servername = "localhost";
$username   = "root";
$password   = "root";
$dbname     = "tp4_puntajes";

$conn = mysqli_connect($servername, $username, $password, $dbname);
if (!$conn) {
    die("Error de conexión: " . mysqli_connect_error());
}
mysqli_set_charset($conn, "utf8mb4");
