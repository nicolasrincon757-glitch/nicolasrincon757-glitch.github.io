---
title: "4. Consultas SQL y Reportes de Negocio (DQL)"
description: "Batería de 62 consultas SQL que cubren filtros, combinaciones, operaciones de conjuntos, división relacional, agregaciones y subconsultas."
order: 4
---

# 4. Consultas Operativas y Analíticas (`ConduCar`)

Este script reúne **62 consultas SQL** diseñadas para explotar la información académica, financiera y operativa de la escuela de conducción.

## ¿Cómo funciona?

Las consultas están estructuradas progresivamente según su complejidad relacional:

1. **Selección y filtrado básico (`WHERE`, `DISTINCT`):** Consulta vehículos disponibles o automáticos, categorías de servicio público, clases programadas, pagos altos por transferencia, puntajes bajos y licencias próximas a vencer.
2. **Combinaciones internas y múltiples (`JOIN`, `NATURAL JOIN`):** Cruza información de vehículos con categorías, planes de estudio por categoría, cronograma de clases con módulos e instructores, pagos por alumno activo y certificados expedidos.
3. **Autocombinaciones (`Self-JOIN`):** Compara filas dentro de una misma tabla para identificar pares de instructores habilitados en la misma categoría, vehículos de la misma marca, evolución entre exámenes CRC de un alumno o alumnos que mejoraron su puntaje práctico frente al teórico.
4. **Operaciones de conjuntos (`UNION`, `INTERSECT`, `EXCEPT`):** Unifica directorios de alumnos e instructores, encuentra instructores habilitados simultáneamente en `A2` y `B1`, detecta categorías sin matrículas o matrículas finalizadas sin examen práctico registrado.
5. **División relacional (`GROUP BY` + `HAVING COUNT`):** Identifica instructores habilitados en *todas* las categorías activas, módulos comunes a todos los cursos, alumnos que completaron todos los módulos de `B1` o alumnos que han usado todos los medios de pago.
6. **Agregaciones y métricas (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `EXTRACT`):** Calcula matrículas por categoría, carga horaria total, promedios de calificación, recaudos por medio de pago, saldos pendientes por matrícula activa y edad del alumno al matricularse.
7. **Combinaciones externas y subconsultas (`LEFT JOIN`, `IN`, `>= ALL`, tablas derivadas):** Incluye entidades sin registros asociados (categorías sin alumnos, vehículos sin clases), identifica al instructor con más horas dictadas, compara el avance de horas dictadas frente al plan de estudios y valida inconsistencias entre instructores, vehículos y matrículas.

## Código SQL

```sql
USE conducar;

SELECT placa, marca, linea, modelo_anio FROM vehiculo WHERE estado = 'DISPONIBLE';

SELECT placa, codigo_categoria, marca, linea FROM vehiculo WHERE transmision = 'AUTOMATICA';

SELECT codigo_categoria, descripcion, edad_minima FROM categoria_licencia WHERE tipo_servicio = 'PUBLICO';

SELECT codigo_categoria, valor_curso FROM categoria_licencia WHERE valor_curso IS NOT NULL;

SELECT id_modulo, nombre FROM modulo WHERE tipo = 'PRACTICA';

SELECT id_clase, fecha, hora_inicio, id_instructor FROM clase WHERE estado = 'PROGRAMADA';

SELECT id_pago, id_matricula, fecha_pago, valor FROM pago WHERE valor > 500000 AND medio_pago = 'TRANSFERENCIA';

SELECT id_examen, id_matricula, tipo, puntaje FROM examen WHERE puntaje < 80;

SELECT id_instructor, nombres, apellidos, fecha_venc_licencia FROM instructor WHERE fecha_venc_licencia < '2027-01-01';

SELECT id_alumno, nombres, apellidos, tipo_documento FROM alumno WHERE tipo_documento = 'TI' OR tipo_documento = 'CE';

SELECT DISTINCT tipo_vehiculo FROM vehiculo;

SELECT V.placa, V.marca, V.codigo_categoria, C.descripcion FROM vehiculo V, categoria_licencia C
WHERE V.codigo_categoria = C.codigo_categoria;

SELECT V.placa, V.marca, V.codigo_categoria, C.descripcion FROM vehiculo V
JOIN categoria_licencia C ON V.codigo_categoria = C.codigo_categoria;

SELECT id_matricula, nombres, apellidos, codigo_categoria FROM matricula NATURAL JOIN alumno;

SELECT M.nombre, M.tipo, P.horas FROM plan_curso P JOIN modulo M ON P.id_modulo = M.id_modulo
WHERE P.codigo_categoria = 'B1';

SELECT I.nombres, I.apellidos, H.fecha_habilitacion FROM instructor_categoria H
JOIN instructor I ON H.id_instructor = I.id_instructor WHERE H.codigo_categoria = 'C1';

SELECT C.id_clase, C.fecha, C.hora_inicio, M.nombre AS modulo, I.nombres, I.apellidos FROM clase C
JOIN modulo M ON C.id_modulo = M.id_modulo
JOIN instructor I ON C.id_instructor = I.id_instructor
WHERE C.estado = 'PROGRAMADA';

SELECT A.nombres, A.apellidos, P.fecha_pago, P.valor, P.medio_pago FROM pago P
JOIN matricula M ON P.id_matricula = M.id_matricula
JOIN alumno A ON M.id_alumno = A.id_alumno
WHERE M.estado = 'ACTIVA';

SELECT E.id_examen, E.fecha, E.puntaje, I.nombres, I.apellidos FROM examen E
JOIN instructor I ON E.id_instructor = I.id_instructor WHERE E.tipo = 'PRACTICO';

SELECT C.id_clase, C.fecha, V.placa, V.marca, V.linea FROM clase C
JOIN vehiculo V ON C.placa = V.placa
WHERE C.estado = 'DICTADA' AND C.fecha BETWEEN '2026-10-01' AND '2026-10-31';

SELECT CA.numero_certificado, CA.fecha_expedicion, A.nombres, A.apellidos, M.codigo_categoria
FROM certificado_aptitud CA
JOIN matricula M ON CA.id_matricula = M.id_matricula
JOIN alumno A ON M.id_alumno = A.id_alumno;

SELECT H1.codigo_categoria, H1.id_instructor AS instructor_1, H2.id_instructor AS instructor_2
FROM instructor_categoria H1 JOIN instructor_categoria H2
ON H1.codigo_categoria = H2.codigo_categoria AND H1.id_instructor < H2.id_instructor;

SELECT V1.marca, V1.placa AS placa_1, V2.placa AS placa_2 FROM vehiculo V1
JOIN vehiculo V2 ON V1.marca = V2.marca AND V1.placa < V2.placa;

SELECT C1.id_alumno, C1.fecha_examen AS primer_examen, C1.resultado AS primer_resultado,
C2.fecha_examen AS segundo_examen, C2.resultado AS segundo_resultado
FROM certificado_crc C1 JOIN certificado_crc C2
ON C1.id_alumno = C2.id_alumno AND C1.fecha_examen < C2.fecha_examen;

SELECT T.id_matricula, T.puntaje AS teorico, P.puntaje AS practico FROM examen T
JOIN examen P ON T.id_matricula = P.id_matricula
WHERE T.tipo = 'TEORICO' AND P.tipo = 'PRACTICO' AND P.puntaje > T.puntaje;

SELECT T.id_matricula, T.id_instructor AS instructor_teorico, P.id_instructor AS instructor_practico
FROM examen T JOIN examen P ON T.id_matricula = P.id_matricula
WHERE T.tipo = 'TEORICO' AND P.tipo = 'PRACTICO' AND T.id_instructor <> P.id_instructor;

SELECT numero_documento, nombres, apellidos, telefono FROM alumno
UNION
SELECT numero_documento, nombres, apellidos, telefono FROM instructor;

SELECT fecha FROM clase
UNION
SELECT fecha FROM examen;

SELECT id_instructor FROM instructor_categoria WHERE codigo_categoria = 'A2'
INTERSECT
SELECT id_instructor FROM instructor_categoria WHERE codigo_categoria = 'B1';

SELECT M.id_alumno FROM pago P JOIN matricula M ON P.id_matricula = M.id_matricula WHERE P.medio_pago = 'EFECTIVO'
INTERSECT
SELECT M.id_alumno FROM pago P JOIN matricula M ON P.id_matricula = M.id_matricula WHERE P.medio_pago = 'TARJETA';

SELECT id_instructor FROM instructor_categoria WHERE codigo_categoria = 'B1'
EXCEPT
SELECT id_instructor FROM instructor_categoria WHERE codigo_categoria = 'C1';

SELECT codigo_categoria FROM categoria_licencia
EXCEPT
SELECT codigo_categoria FROM matricula;

SELECT id_matricula FROM matricula WHERE estado = 'FINALIZADA'
EXCEPT
SELECT id_matricula FROM examen WHERE tipo = 'PRACTICO';

SELECT id_instructor FROM instructor
EXCEPT
SELECT id_instructor FROM examen;

SELECT id_instructor FROM instructor_categoria
WHERE codigo_categoria IN (SELECT codigo_categoria FROM categoria_licencia WHERE valor_curso IS NOT NULL)
GROUP BY id_instructor
HAVING COUNT(*) = (SELECT COUNT(*) FROM categoria_licencia WHERE valor_curso IS NOT NULL);

SELECT id_modulo FROM plan_curso
WHERE codigo_categoria IN (SELECT codigo_categoria FROM categoria_licencia WHERE valor_curso IS NOT NULL)
GROUP BY id_modulo
HAVING COUNT(*) = (SELECT COUNT(*) FROM categoria_licencia WHERE valor_curso IS NOT NULL);

SELECT C.id_matricula FROM clase C JOIN matricula M ON C.id_matricula = M.id_matricula
WHERE C.estado = 'DICTADA' AND M.codigo_categoria = 'B1'
GROUP BY C.id_matricula
HAVING COUNT(DISTINCT C.id_modulo) = (SELECT COUNT(*) FROM plan_curso WHERE codigo_categoria = 'B1');

SELECT id_instructor FROM clase
WHERE estado = 'DICTADA' AND id_modulo IN (SELECT id_modulo FROM modulo WHERE tipo = 'PRACTICA')
GROUP BY id_instructor
HAVING COUNT(DISTINCT id_modulo) = (SELECT COUNT(*) FROM modulo WHERE tipo = 'PRACTICA');

SELECT id_instructor FROM clase
WHERE placa IN (SELECT placa FROM vehiculo WHERE tipo_vehiculo = 'MOTOCICLETA')
GROUP BY id_instructor
HAVING COUNT(DISTINCT placa) = (SELECT COUNT(*) FROM vehiculo WHERE tipo_vehiculo = 'MOTOCICLETA');

SELECT M.id_alumno FROM pago P JOIN matricula M ON P.id_matricula = M.id_matricula
GROUP BY M.id_alumno
HAVING COUNT(DISTINCT P.medio_pago) = (SELECT COUNT(DISTINCT medio_pago) FROM pago);

SELECT codigo_categoria, COUNT(id_matricula) AS matriculas FROM matricula GROUP BY codigo_categoria;

SELECT codigo_categoria, SUM(horas) AS total_horas FROM plan_curso GROUP BY codigo_categoria;

SELECT M.tipo, SUM(P.horas) AS horas FROM plan_curso P JOIN modulo M ON P.id_modulo = M.id_modulo
WHERE P.codigo_categoria = 'B1' GROUP BY M.tipo;

SELECT tipo, ROUND(AVG(puntaje), 2) AS promedio, MAX(puntaje) AS maximo, MIN(puntaje) AS minimo
FROM examen GROUP BY tipo;

SELECT medio_pago, SUM(valor) AS total, COUNT(id_pago) AS pagos FROM pago GROUP BY medio_pago;

SELECT I.nombres, I.apellidos, SUM(C.horas) AS horas_dictadas FROM clase C
JOIN instructor I ON C.id_instructor = I.id_instructor
WHERE C.estado = 'DICTADA'
GROUP BY I.id_instructor, I.nombres, I.apellidos;

SELECT id_instructor, SUM(horas) AS horas_dictadas FROM clase WHERE estado = 'DICTADA'
GROUP BY id_instructor HAVING SUM(horas) > 200;

SELECT M.id_matricula, M.valor_pactado, SUM(P.valor) AS pagado, M.valor_pactado - SUM(P.valor) AS saldo
FROM matricula M JOIN pago P ON M.id_matricula = P.id_matricula
WHERE M.estado = 'ACTIVA'
GROUP BY M.id_matricula, M.valor_pactado
HAVING M.valor_pactado - SUM(P.valor) > 0;

SELECT EXTRACT(MONTH FROM fecha) AS mes, COUNT(id_clase) AS canceladas FROM clase
WHERE estado = 'CANCELADA' GROUP BY EXTRACT(MONTH FROM fecha) ORDER BY mes;

SELECT M.id_matricula, A.nombres, EXTRACT(YEAR FROM M.fecha_matricula) - EXTRACT(YEAR FROM A.fecha_nacimiento) AS edad
FROM matricula M JOIN alumno A ON M.id_alumno = A.id_alumno;

SELECT C.codigo_categoria, COUNT(M.id_matricula) AS matriculas FROM categoria_licencia C
LEFT JOIN matricula M ON C.codigo_categoria = M.codigo_categoria
GROUP BY C.codigo_categoria ORDER BY C.codigo_categoria;

SELECT V.placa, COUNT(C.id_clase) AS clases FROM vehiculo V
LEFT JOIN clase C ON V.placa = C.placa AND C.estado = 'DICTADA'
GROUP BY V.placa ORDER BY V.placa;

SELECT M.id_matricula, M.estado, CA.numero_certificado FROM matricula M
LEFT JOIN certificado_aptitud CA ON M.id_matricula = CA.id_matricula ORDER BY M.id_matricula;

SELECT I.id_instructor, I.nombres, COUNT(E.id_examen) AS examenes FROM instructor I
LEFT JOIN examen E ON I.id_instructor = E.id_instructor
GROUP BY I.id_instructor, I.nombres ORDER BY I.id_instructor;

SELECT placa, marca, fecha_venc_soat, fecha_venc_rtm FROM vehiculo
WHERE fecha_venc_soat < '2027-01-01' OR fecha_venc_rtm < '2027-01-01';

SELECT id_matricula FROM examen WHERE tipo = 'TEORICO' AND puntaje >= 80
AND id_matricula IN (SELECT id_matricula FROM examen WHERE tipo = 'PRACTICO' AND puntaje >= 80);

SELECT id_instructor, SUM(horas) AS horas FROM clase WHERE estado = 'DICTADA'
GROUP BY id_instructor
HAVING SUM(horas) >= ALL (SELECT SUM(horas) FROM clase WHERE estado = 'DICTADA' GROUP BY id_instructor);

SELECT id_examen, id_matricula, puntaje FROM examen
WHERE tipo = 'TEORICO' AND puntaje > (SELECT AVG(puntaje) FROM examen WHERE tipo = 'TEORICO');

SELECT M.id_matricula, M.codigo_categoria, HD.horas_dictadas, HP.horas_plan FROM matricula M
JOIN (SELECT id_matricula, SUM(horas) AS horas_dictadas FROM clase WHERE estado = 'DICTADA' GROUP BY id_matricula) HD
  ON M.id_matricula = HD.id_matricula
JOIN (SELECT codigo_categoria, SUM(horas) AS horas_plan FROM plan_curso GROUP BY codigo_categoria) HP
  ON M.codigo_categoria = HP.codigo_categoria
WHERE M.estado = 'ACTIVA';

SELECT A.nombres, A.apellidos, C.nombre_crc, C.fecha_examen FROM matricula M
JOIN alumno A ON M.id_alumno = A.id_alumno
JOIN certificado_crc C ON A.id_alumno = C.id_alumno
WHERE M.estado = 'ACTIVA' AND C.resultado = 'APTO';

SELECT C.id_clase, C.id_instructor, M.codigo_categoria FROM clase C
JOIN matricula M ON C.id_matricula = M.id_matricula WHERE C.estado = 'PROGRAMADA'
EXCEPT
SELECT C.id_clase, C.id_instructor, M.codigo_categoria FROM clase C
JOIN matricula M ON C.id_matricula = M.id_matricula
JOIN instructor_categoria H ON C.id_instructor = H.id_instructor AND M.codigo_categoria = H.codigo_categoria
WHERE C.estado = 'PROGRAMADA';

SELECT C.id_clase, V.placa, V.codigo_categoria AS categoria_vehiculo, M.codigo_categoria AS categoria_matricula FROM clase C
JOIN vehiculo V ON C.placa = V.placa
JOIN matricula M ON C.id_matricula = M.id_matricula
WHERE V.codigo_categoria <> M.codigo_categoria;
```