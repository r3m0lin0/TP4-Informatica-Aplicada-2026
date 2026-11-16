<?php
// Recibe el puntaje desde el juego y lo guarda en la base de datos.
require "conexion.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre  = mysqli_real_escape_string($conn, $_POST['nombre_jugador'] ?? 'Anónimo');
    $pais    = mysqli_real_escape_string($conn, $_POST['pais'] ?? 'Desconocido');
    $color   = mysqli_real_escape_string($conn, $_POST['color'] ?? 'hacha');
    $puntaje = (int)($_POST['puntaje'] ?? 0);
    $nivel   = (int)($_POST['nivel'] ?? 1);
    $tiempo  = (int)($_POST['tiempo_seg'] ?? 0);

    // Si el jugador ya existe (mismo nombre y país), se queda con el mejor puntaje y el menor tiempo.
    $check = mysqli_query($conn, "SELECT id FROM puntajes WHERE nombre_jugador='$nombre' AND pais='$pais'");
    if (mysqli_num_rows($check) > 0) {
        $sql = "UPDATE puntajes
                SET puntaje=GREATEST(puntaje, $puntaje),
                    tiempo_seg=IF(tiempo_seg=0, $tiempo, LEAST(tiempo_seg, $tiempo)),
                    color='$color', fecha=NOW()
                WHERE nombre_jugador='$nombre' AND pais='$pais'";
    } else {
        $sql = "INSERT INTO puntajes (nombre_jugador, pais, color, puntaje, nivel, tiempo_seg, fecha)
                VALUES ('$nombre', '$pais', '$color', $puntaje, $nivel, $tiempo, NOW())";
    }

    if (mysqli_query($conn, $sql)) echo "OK"; else echo "ERROR: " . mysqli_error($conn);
}
mysqli_close($conn);
