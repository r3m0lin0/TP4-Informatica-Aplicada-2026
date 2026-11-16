# El Gran Leñador

Juego hecho con p5.js. Cortá troncos con el hacha sin que las ramas te aplasten y competí por el mejor puntaje. Los puntajes se guardan en una base de datos MySQL (con PHP) y se muestran en un ranking.

## Cómo se juega

1. En la pantalla de inicio, apretá **Enter** para abrir el formulario.
2. Elegí tu **apodo**, tu **país** y tu **herramienta** (hacha, motosierra, hacha doble o sierra).
3. Usá las **flechas ← y →** para cortar el tronco desde cada lado. Cada corte suma un punto y recarga la barra de tiempo.
4. Esquivá las ramas: si te tocan, perdés. Si se acaba el tiempo, también.
5. Al terminar, tu puntaje se guarda solo. Podés ver el ranking desde el botón de la pantalla final o desde el inicio (**VER RANKING**).

Otras teclas: **F** activa o desactiva la pantalla completa.

## Qué necesitás

Un servidor local con **Apache, PHP y MySQL**. Cualquiera de estos sirve:

- **MAMP** o **MAMP PRO** (Mac / Windows)
- **XAMPP** (Windows / Mac / Linux)

> No alcanza con abrir `index.html` haciendo doble clic: sin servidor, los archivos PHP no se ejecutan y los puntajes no se guardan.

## Instalación paso a paso

### 1. Copiar la carpeta del juego

Copiá la carpeta completa `VersionMicaTP` dentro de la carpeta pública de tu servidor:

| Programa | Carpeta |
|---|---|
| MAMP / MAMP PRO (Mac) | `/Applications/MAMP/htdocs/` o la que figure como *Site folder* en MAMP PRO (por ejemplo `~/Sites/localhost/`) |
| XAMPP (Windows) | `C:\xampp\htdocs\` |
| XAMPP (Mac) | `/Applications/XAMPP/htdocs/` |

### 2. Prender los servidores

Abrí MAMP o XAMPP y prendé **Apache** y **MySQL**.

- En **MAMP PRO**, apretá el botón de arriba a la derecha: si dice **Stop**, ya está prendido.
- En **XAMPP**, apretá **Start** en Apache y en MySQL.

### 3. Crear la base de datos

1. Abrí **phpMyAdmin** en el navegador (`http://localhost/phpmyadmin`, o desde la pestaña *Databases* de MAMP PRO).
2. Entrá a la pestaña **SQL**, pegá este código y apretá **Continuar**:

```sql
CREATE DATABASE IF NOT EXISTS tp4_puntajes CHARACTER SET utf8mb4;
USE tp4_puntajes;

CREATE TABLE IF NOT EXISTS puntajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_jugador VARCHAR(100) NOT NULL,
  pais VARCHAR(100) NOT NULL,
  color VARCHAR(30) NOT NULL DEFAULT 'hacha',
  puntaje INT NOT NULL DEFAULT 0,
  nivel INT NOT NULL DEFAULT 1,
  tiempo_seg INT NOT NULL DEFAULT 0,
  fecha DATETIME NOT NULL
);
```

A la izquierda tiene que aparecer la base `tp4_puntajes` con la tabla `puntajes`.

### 4. Revisar la conexión

Abrí `conexion.php` con un editor de texto y fijate que los datos coincidan con tu servidor:

```php
$servername = "localhost";
$username   = "root";
$password   = "root";   // MAMP: "root"   |   XAMPP: "" (vacío)
$dbname     = "tp4_puntajes";
```

La contraseña es lo que más suele cambiar entre computadoras. Si ves el mensaje *Access denied*, probá con la otra opción.

### 5. Abrir el juego

En el navegador, entrá a:

```
http://localhost/VersionMicaTP/index.html
```

Si tu servidor usa un puerto distinto (MAMP suele usar el 8888), agregalo:

```
http://localhost:8888/VersionMicaTP/index.html
```

## Archivos del proyecto

| Archivo | Qué hace |
|---|---|
| `index.html` | Pantalla de inicio |
| `juego.html` | Pantalla del juego |
| `sketch.js` | Lógica del juego (p5.js) |
| `formulario.js` | Formulario de jugador y envío del puntaje |
| `conexion.php` | Datos de conexión a la base de datos |
| `guardar_alta.php` | Recibe el puntaje y lo guarda (conserva el mejor puntaje y el menor tiempo de cada jugador) |
| `ranking.php` | Muestra el ranking leído desde la base y permite borrar el historial |
| `css/`, `img/`, `sonido/` | Estilos, imágenes y sonidos |
| `ranking.html`, `ranking.js` | Versión anterior del ranking (usaba `localStorage`); ya no se usa |

## Problemas frecuentes

- **El juego abre pero el ranking sale vacío o da error**: revisá que Apache y MySQL estén prendidos y que la base `tp4_puntajes` exista.
- **"Error de conexión" o "Access denied"**: revisá usuario y contraseña en `conexion.php`.
- **404 (Not Found)**: la carpeta no está en la ubicación correcta o tiene otro nombre. Revisá que la dirección coincida con el nombre de la carpeta (sin espacios).
- **Los puntajes no aparecen en el ranking**: abrí la consola del navegador (clic derecho → Inspeccionar → Consola) y fijate si, al terminar una partida, aparece `guardar_alta.php: OK`.
- **No se escucha el sonido**: el navegador necesita un clic previo en la página para habilitar el audio.
