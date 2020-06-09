-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 09-06-2020 a las 13:20:16
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `hometome`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudad`
--

CREATE TABLE `ciudad` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ciudad`
--

INSERT INTO `ciudad` (`id`, `nombre`) VALUES
(1, 'Madrid');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `foto`
--

CREATE TABLE `foto` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `foto`
--

INSERT INTO `foto` (`id`, `nombre`) VALUES
(1, 'img1-1.webp'),
(2, 'img2-2.jpeg'),
(3, 'img3-3.jpeg'),
(4, 'img4-4.jpeg'),
(5, 'img5-5.jpeg'),
(6, 'img6-6.webp'),
(7, 'img7-7.jpeg'),
(8, 'img8-8.jpeg'),
(9, 'img9-9.jpeg'),
(10, 'img10-10.jpeg'),
(11, 'img11-11.jpeg'),
(12, 'img7-12.jpeg'),
(13, 'img7-13.jpeg'),
(16, 'img13-16.jpeg'),
(18, 'img13-18.jpeg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes`
--

CREATE TABLE `mensajes` (
  `id` int(11) NOT NULL,
  `sender_name_id` int(11) NOT NULL,
  `reciever_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `mensajes`
--

INSERT INTO `mensajes` (`id`, `sender_name_id`, `reciever_name`, `message`, `status`, `date`) VALUES
(1, 11, '2', 'Hola!', 1, '2020-06-04 11:21:18'),
(2, 11, '2', 'Que pasa chato, estoy buscando piso', 1, '2020-06-04 11:21:30'),
(3, 11, '3', 'Hola guapa', 1, '2020-06-04 11:22:25'),
(4, 11, '3', 'nos conocemos???', 1, '2020-06-04 11:22:34'),
(5, 11, '5', 'Holiiii', 1, '2020-06-04 12:00:22'),
(6, 11, '9', 'Que pasaaaaaa', 1, '2020-06-04 12:00:39'),
(7, 11, '6', 'EYYYYYYYYYY', 1, '2020-06-04 12:00:50'),
(8, 11, '7', 'HOLIIIIIII', 1, '2020-06-04 12:01:19'),
(9, 11, '4', 'EEEEEEEEEEEEEEEEE', 1, '2020-06-04 12:01:48'),
(10, 7, '2', 'que pachaa', 1, '2020-06-04 18:32:46'),
(11, 7, '2', 'eyyyyy', 1, '2020-06-04 19:05:57'),
(12, 1, '2', 'hola!', 1, '2020-06-04 19:09:37'),
(13, 7, '11', 'chacho', 1, '2020-06-04 19:15:43'),
(14, 7, '11', 'que pasa', 1, '2020-06-04 19:17:59'),
(15, 7, '11', 'Que pasa guapo', 1, '2020-06-04 19:32:42'),
(16, 7, '11', 'y que me cuentas', 1, '2020-06-04 19:33:00'),
(17, 7, '11', 'pues nada', 1, '2020-06-04 19:33:05'),
(18, 7, '11', 'aqui', 1, '2020-06-04 19:33:06'),
(19, 7, '11', 'Chacho', 1, '2020-06-04 19:34:35'),
(20, 7, '11', 'que diseee', 1, '2020-06-04 19:34:40'),
(21, 2, '11', 'Guapa', 1, '2020-06-05 09:59:58'),
(22, 2, '11', 'que te rone', 1, '2020-06-05 10:00:04'),
(23, 1, '2', 'holii', 1, '2020-06-05 11:47:26'),
(24, 1, '2', 'que pasaa', 1, '2020-06-05 11:52:35'),
(25, 1, '2', 'eY QUE PASA', 1, '2020-06-05 12:07:30'),
(31, 13, '9', 'Hola Lucia!', 1, '2020-06-08 13:29:06'),
(32, 13, '9', 'Yo tambien me se la cancion de digimon entera :)', 1, '2020-06-08 13:29:18'),
(33, 9, '13', 'Hola!', 1, '2020-06-08 13:31:11'),
(34, 9, '13', 'Yo busco piso por la zona de Vallekas', 1, '2020-06-08 13:31:20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preferencias`
--

CREATE TABLE `preferencias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `preferencias`
--

INSERT INTO `preferencias` (`id`, `nombre`) VALUES
(1, 'No-Fumador'),
(2, 'Fumador'),
(3, 'Mascotas'),
(4, 'Anti-Mascotas'),
(5, 'Tranquilo'),
(6, 'Fiestero'),
(7, 'Maniático'),
(8, 'Independiente'),
(9, 'Vida en común'),
(10, 'Casero'),
(11, 'Nocturno'),
(12, 'Madrugador'),
(13, 'Trabajador'),
(14, 'Estudiante'),
(15, 'Vive y deja vivir'),
(16, 'Friki'),
(17, 'Deportista'),
(18, 'Seriéfilo'),
(19, 'Manta y sofá'),
(20, 'Caos'),
(21, 'Hablador'),
(22, 'Tímido'),
(23, 'Extrovertido');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `ciudad_id` int(11) NOT NULL,
  `username` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`roles`)),
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellidos` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_nac` date NOT NULL,
  `num_room_mates` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `precio_max` int(11) DEFAULT NULL,
  `precio_min` int(11) DEFAULT NULL,
  `genero` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `ciudad_id`, `username`, `roles`, `password`, `nombre`, `apellidos`, `fecha_nac`, `num_room_mates`, `precio_max`, `precio_min`, `genero`, `descripcion`) VALUES
(1, 1, 'admin', '[\"ROLE_ADMIN\"]', '$argon2id$v=19$m=65536,t=4,p=1$dxA14FIY1JV4/DzsgTtvBw$NGI/tqbu8W7ezff4uO6Q5m/QlJ9iwleXgMkz8Z4ek18', 'Vitas', 'Best Singer', '1989-06-08', '1', NULL, NULL, 'H', 'Me gusta hacer soniditos con la boca.'),
(2, 1, 'antonio', '[]', '$argon2id$v=19$m=65536,t=4,p=1$dxA14FIY1JV4/DzsgTtvBw$NGI/tqbu8W7ezff4uO6Q5m/QlJ9iwleXgMkz8Z4ek18', 'Antonio', 'Martín Aracil', '2010-05-10', '1', 800, 400, 'H', 'La unica tilde que pongo (casi)siempre es la de mi primer apellido.'),
(3, 1, 'cristina', '[]', '$argon2id$v=19$m=65536,t=4,p=1$dxA14FIY1JV4/DzsgTtvBw$NGI/tqbu8W7ezff4uO6Q5m/QlJ9iwleXgMkz8Z4ek18', 'Cristina', 'Lorenzo López', '2020-06-02', '1', 900, 350, 'M', 'Me gusta repetir frases de Los Simposons y comer kebab los viernes.'),
(4, 1, 'juan', '[]', '$argon2id$v=19$m=65536,t=4,p=1$dxA14FIY1JV4/DzsgTtvBw$NGI/tqbu8W7ezff4uO6Q5m/QlJ9iwleXgMkz8Z4ek18', 'Juan', 'Rodríguez  Torreznos', '1991-04-06', '2', 700, 200, 'H', 'Me encanta Taburete. 🇪🇸'),
(5, 1, 'berta', '[]', '$argon2id$v=19$m=65536,t=4,p=1$dxA14FIY1JV4/DzsgTtvBw$NGI/tqbu8W7ezff4uO6Q5m/QlJ9iwleXgMkz8Z4ek18', 'Berta', 'Tejero Gomez', '1976-07-05', '1', 800, 100, 'M', 'Soy fotógrafa, mira que trípode.'),
(6, 1, 'cecilia', '[]', '$argon2id$v=19$m=65536,t=4,p=1$dxA14FIY1JV4/DzsgTtvBw$NGI/tqbu8W7ezff4uO6Q5m/QlJ9iwleXgMkz8Z4ek18', 'Cecilia', 'Sanchez Jimeno', '1987-11-04', '1', 700, 400, 'M', 'Trabajo en una planta de tratatamiento de residuos nucleares pero no tengo superpoderes. ☢️😭☢️'),
(7, 1, 'alberto', '[]', '$argon2id$v=19$m=65536,t=4,p=1$dxA14FIY1JV4/DzsgTtvBw$NGI/tqbu8W7ezff4uO6Q5m/QlJ9iwleXgMkz8Z4ek18', 'Alberto', 'García Tomelloso', '1986-03-14', '2', 1000, 0, 'H', 'Cosmopolita en busca de nuevas experiencias. Tengo un barco😎'),
(8, 1, 'laura', '[]', '$argon2id$v=19$m=65536,t=4,p=1$dxA14FIY1JV4/DzsgTtvBw$NGI/tqbu8W7ezff4uO6Q5m/QlJ9iwleXgMkz8Z4ek18', 'Laura', 'Velázquez Figueroa', '2020-01-01', '1', 900, 200, 'M', 'Me gustan las croquetas. 🏴‍☠️ Busco piso en la zona de Vallekas'),
(9, 1, 'lucia', '[]', '$argon2id$v=19$m=65536,t=4,p=1$dxA14FIY1JV4/DzsgTtvBw$NGI/tqbu8W7ezff4uO6Q5m/QlJ9iwleXgMkz8Z4ek18', 'Lucia', 'Bermejo López', '1997-01-10', '1', 800, 300, 'M', 'Me sé la canción de Digimon entera.'),
(11, 1, 'benancio', '[]', '$argon2id$v=19$m=65536,t=4,p=1$dxA14FIY1JV4/DzsgTtvBw$NGI/tqbu8W7ezff4uO6Q5m/QlJ9iwleXgMkz8Z4ek18', 'Benancio', 'Castillos Segovia', '1977-07-11', '1', NULL, NULL, 'H', 'Me gusta perseguir mujeres en aparcamientos públicos.'),
(13, 1, 'capi', '[]', '$argon2id$v=19$m=65536,t=4,p=1$dxA14FIY1JV4/DzsgTtvBw$NGI/tqbu8W7ezff4uO6Q5m/QlJ9iwleXgMkz8Z4ek18', 'Chris', 'Evans', '1988-01-16', '1', 800, 400, 'H', 'Americano y orgulloso.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_foto`
--

CREATE TABLE `user_foto` (
  `user_id` int(11) NOT NULL,
  `foto_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user_foto`
--

INSERT INTO `user_foto` (`user_id`, `foto_id`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(7, 12),
(7, 13),
(8, 8),
(9, 9),
(11, 11),
(13, 16),
(13, 18);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_preferencias`
--

CREATE TABLE `user_preferencias` (
  `user_id` int(11) NOT NULL,
  `preferencias_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user_preferencias`
--

INSERT INTO `user_preferencias` (`user_id`, `preferencias_id`) VALUES
(2, 1),
(2, 3),
(2, 5),
(2, 7),
(2, 9),
(2, 10),
(2, 12),
(2, 14),
(2, 16),
(3, 1),
(3, 3),
(3, 5),
(3, 8),
(3, 9),
(3, 10),
(3, 14),
(3, 18),
(3, 19),
(4, 4),
(4, 6),
(4, 17),
(4, 20),
(4, 21),
(5, 3),
(5, 10),
(5, 11),
(5, 16),
(5, 18),
(5, 19),
(6, 2),
(6, 9),
(6, 11),
(6, 12),
(6, 15),
(6, 22),
(6, 23),
(7, 1),
(7, 2),
(7, 3),
(7, 4),
(7, 5),
(7, 6),
(7, 7),
(7, 8),
(7, 9),
(7, 10),
(7, 11),
(7, 12),
(7, 13),
(7, 14),
(7, 15),
(7, 16),
(7, 17),
(7, 18),
(7, 19),
(7, 20),
(7, 21),
(7, 22),
(7, 23),
(8, 4),
(8, 6),
(8, 18),
(8, 20),
(9, 8),
(9, 9),
(9, 10),
(9, 13),
(9, 15),
(9, 16),
(11, 1),
(11, 3),
(11, 8),
(11, 10),
(13, 1),
(13, 6),
(13, 13),
(13, 15),
(13, 17);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ciudad`
--
ALTER TABLE `ciudad`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `foto`
--
ALTER TABLE `foto`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_6C929C80FCE15A1D` (`sender_name_id`);

--
-- Indices de la tabla `preferencias`
--
ALTER TABLE `preferencias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_8D93D649F85E0677` (`username`),
  ADD KEY `IDX_8D93D649E8608214` (`ciudad_id`);

--
-- Indices de la tabla `user_foto`
--
ALTER TABLE `user_foto`
  ADD PRIMARY KEY (`user_id`,`foto_id`),
  ADD KEY `IDX_905D772CA76ED395` (`user_id`),
  ADD KEY `IDX_905D772C7ABFA656` (`foto_id`);

--
-- Indices de la tabla `user_preferencias`
--
ALTER TABLE `user_preferencias`
  ADD PRIMARY KEY (`user_id`,`preferencias_id`),
  ADD KEY `IDX_27120D8BA76ED395` (`user_id`),
  ADD KEY `IDX_27120D8BDFEA52FC` (`preferencias_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ciudad`
--
ALTER TABLE `ciudad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `foto`
--
ALTER TABLE `foto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `preferencias`
--
ALTER TABLE `preferencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD CONSTRAINT `FK_6C929C80FCE15A1D` FOREIGN KEY (`sender_name_id`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_8D93D649E8608214` FOREIGN KEY (`ciudad_id`) REFERENCES `ciudad` (`id`);

--
-- Filtros para la tabla `user_foto`
--
ALTER TABLE `user_foto`
  ADD CONSTRAINT `FK_905D772C7ABFA656` FOREIGN KEY (`foto_id`) REFERENCES `foto` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_905D772CA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_preferencias`
--
ALTER TABLE `user_preferencias`
  ADD CONSTRAINT `FK_27120D8BA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_27120D8BDFEA52FC` FOREIGN KEY (`preferencias_id`) REFERENCES `preferencias` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
