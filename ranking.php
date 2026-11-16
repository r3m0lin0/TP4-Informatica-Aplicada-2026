<?php
// Ranking leído desde la base de datos (reemplaza a ranking.html + ranking.js)
require "conexion.php";

// Botón "Borrar Historial": vacía la tabla y recarga la página
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['borrar_todo'])) {
    mysqli_query($conn, "TRUNCATE TABLE puntajes");
    header("Location: ranking.php");
    exit;
}

// Mejores puntajes primero; si empatan, gana el que tardó menos
$result = mysqli_query($conn, "SELECT nombre_jugador, pais, color, puntaje, tiempo_seg, fecha
                               FROM puntajes
                               ORDER BY puntaje DESC, tiempo_seg ASC
                               LIMIT 50");
$cantidad = mysqli_num_rows($result);

// Mismos colores que usaba ranking.js
$colorTexto = ['verde' => '#2ecc71', 'amarillo' => '#f1c40f', 'rojo' => '#e74c3c', 'azul' => '#3498db'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Ranking - Leñador</title>
    <link rel="stylesheet" href="css/estilos.css">
</head>
<body>
    <div id="contenedor">
        <header>
            <h1>¡Quien es el mejor leñador?</h1>
            <nav>
                <ul>
                    <li><a href="index.html">Inicio</a></li>
                    <li><a href="juego.html">Volver al Juego</a></li>
                </ul>
            </nav>
        </header>
        <main class="columnas5">
            <div id="rankingLeñador">
            <?php if ($cantidad === 0): ?>
                <p style="text-align:center; font-style:italic; color:#666;">No hay puntajes registrados aún. ¡Juega para aparecer aquí!</p>
            <?php else: ?>
                <table>
                    <thead>
                        <tr>
                            <th>Pos</th><th>Apodo</th><th>País</th><th>Color</th><th>Puntos</th><th>Tiempo (s)</th><th>Fecha</th><th>Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php
                    $pos = 1;
                    while ($fila = mysqli_fetch_assoc($result)):
                        $color = strtolower($fila['color']);
                        $hex = $colorTexto[$color] ?? '#e74c3c';
                        $momento = strtotime($fila['fecha']);
                    ?>
                        <tr>
                            <td><?php echo $pos; ?></td>
                            <td><?php echo htmlspecialchars($fila['nombre_jugador']); ?></td>
                            <td><?php echo htmlspecialchars($fila['pais']); ?></td>
                            <td style="color:<?php echo $hex; ?>; font-weight:700;"><?php echo htmlspecialchars($fila['color']); ?></td>
                            <td><?php echo (int)$fila['puntaje']; ?></td>
                            <td><?php echo (int)$fila['tiempo_seg']; ?></td>
                            <td><?php echo date('d/m/Y', $momento); ?></td>
                            <td><?php echo date('H:i:s', $momento); ?></td>
                        </tr>
                    <?php $pos++; endwhile; ?>
                    </tbody>
                </table>
            <?php endif; ?>
            </div>
            <br>
            <form method="POST" onsubmit="return confirm('¿Estás seguro de que quieres borrar todo el historial de puntajes?');">
                <button type="submit" name="borrar_todo" class="btn-borrar">Borrar Historial</button>
            </form>
        </main>
    </div>
</body>
</html>
<?php mysqli_close($conn); ?>
