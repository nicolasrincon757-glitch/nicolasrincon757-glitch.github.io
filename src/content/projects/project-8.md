---
title: "8. Taller Avanzado de Normalización hasta 3FN"
description: "Descomposición formal hasta Tercera Forma Normal (3FN) de dos sistemas complejos con grupos repetitivos anidados y múltiples dependencias transitivas."
publishDate: 2026-11-08
isFeatured: true
---

# 8. Taller Avanzado de Normalización hasta 3FN

Este documento presenta la resolución paso a paso ($0\text{FN} \rightarrow 1\text{FN} \rightarrow 2\text{FN} \rightarrow 3\text{FN}$) de dos casos empresariales complejos con grupos repetitivos anidados, llaves compuestas y cadenas de dependencias transitivas.

---

## Caso 1: Sistema de Envío Internacional de Mercancía (`LOGISTIC SYSTEMS S.A.S.`)

### Llave primaria y candidatas del esquema inicial
- **Llave primaria compuesta (PK):** `(num_guia, cod_paquete, cod_evento)` — necesaria porque cada guía ampara varios paquetes y cada paquete registra múltiples eventos de rastreo.
- **Llaves candidatas:** `(cod_pago, cod_paquete, cod_evento)` (por relación 1:1 entre guía y pago) y `(cod_paquete, cod_evento)` (dado que `cod_paquete -> num_guia`).

### Diagnóstico de anomalías (0FN $\rightarrow$ 3FN)
- **Incumple 1FN:** Grupos repetitivos anidados de paquetes por guía y eventos por paquete.
- **Incumple 2FN (Dependencias parciales):** Atributos de cabecera de guía dependen solo de `num_guia`, y atributos descriptivos del paquete dependen solo de `cod_paquete`.
- **Incumple 3FN (Dependencias transitivas):** Cadenas de dependencia vía `orgn_nit`, `dest_id -> dest_cod_ciudad -> cod_zona`, `cod_empleado`, `placa_vehiculo` y `cod_pago`.

### Esquema Relacional Final en 3FN (10 tablas)
1. `REMITENTE(orgn_nit [PK], orgn_nombre, orgn_actividad, orgn_ciudad, orgn_pais, orgn_direccion, orgn_telefono, orgn_celular)`
2. `ZONA(cod_zona [PK], nombre_zona, tarifa_base_zona)`
3. `CIUDAD_DESTINO(dest_cod_ciudad [PK], dest_ciudad, dest_pais, dest_km_desde_origen, cod_zona [FK -> ZONA.cod_zona])`
4. `DESTINATARIO(dest_id [PK], dest_nombre, dest_direccion, dest_telefono, dest_cod_ciudad [FK -> CIUDAD_DESTINO.dest_cod_ciudad])`
5. `EMPLEADO(cod_empleado [PK], nombre_empleado, licencia_empleado)`
6. `VEHICULO(placa_vehiculo [PK], tipo_vehiculo, capacidad_vehiculo)`
7. `PAGO(cod_pago [PK], metodo_pago, valor_pagado)`
8. `GUIA(num_guia [PK], fecha_guia, hora_guia, orgn_nit [FK -> REMITENTE.orgn_nit], dest_id [FK -> DESTINATARIO.dest_id], cod_empleado [FK -> EMPLEADO.cod_empleado], placa_vehiculo [FK -> VEHICULO.placa_vehiculo], cod_pago [FK -> PAGO.cod_pago])`
9. `PAQUETE(cod_paquete [PK], num_guia [FK -> GUIA.num_guia], tipo_paquete, nombre_paquete, descripcion_paquete, peso_paquete, valor_declarado, cant_unidades, valor_flete_paquete)`
10. `EVENTO_RASTREO(num_guia [PK, FK -> GUIA.num_guia], cod_paquete [PK, FK -> PAQUETE.cod_paquete], cod_evento [PK], fecha_evento, estado_evento, descripcion_evento)`

---

## Caso 2: Sistema Integral de Video Club (`STREAM&GO`)

### Grupos repetidos, valores multivaluados y llave primaria
- **Grupos repetidos / multivaluados:** Casetes alquilados por transacción, múltiples categorías por película y múltiples actores por película.
- **Llave primaria compuesta mínima (PK):** `(cod_alquiler, cod_cassette, cod_actor, cod_categoria)`. Ningún subconjunto de 3 atributos garantiza unicidad porque una película dentro de un mismo casete y alquiler puede tener simultáneamente varias categorías y varios actores.

### Transición $1\text{FN} \rightarrow 2\text{FN} \rightarrow 3\text{FN}$
- **1FN:** Aplanamiento de grupos repetitivos con atributos atómicos bajo la PK compuesta de 4 atributos.
- **2FN:** Extracción de dependencias parciales hacia tablas intermedias (`ALQUILER_2FN`, `CASSETTE_2FN`, `ACTOR`, `CATEGORIA`, `DETALLE_ALQUILER_2FN`, `CASSETTE_ACTOR_2FN`, `CASSETTE_CATEGORIA_2FN` y `MORA_ALQUILER_2FN`).
- **3FN:** Eliminación de transitividades (`num_membresia -> cod_cliente`, `num_membresia -> cod_plan`, `cod_sucursal`, `cod_cassette -> cod_pelicula -> cod_director` y `(dias_retraso, recargo_categoria) -> recargo_mora`).

### Esquema Relacional Final en 3FN (14 tablas)
1. `CLIENTE(cod_cliente [PK], nom_cliente, dir_cliente, tel_cliente, email_cliente)`
2. `PLAN(cod_plan [PK], nombre_plan, tarifa_dia_plan, dias_prestamo_max)`
3. `MEMBRESIA(num_membresia [PK], cod_cliente [FK -> CLIENTE.cod_cliente, UNIQUE], cod_plan [FK -> PLAN.cod_plan])`
4. `SUCURSAL(cod_sucursal [PK], nombre_sucursal, direccion_sucursal, ciudad_sucursal)`
5. `ALQUILER(cod_alquiler [PK], fecha_alquiler, num_membresia [FK -> MEMBRESIA.num_membresia], cod_sucursal [FK -> SUCURSAL.cod_sucursal])`
6. `DIRECTOR(cod_director [PK], nombre_director, nacionalidad_director)`
7. `PELICULA(cod_pelicula [PK], titulo_pelicula, anio_pelicula, cod_director [FK -> DIRECTOR.cod_director])`
8. `CASSETTE(cod_cassette [PK], formato_cassette, estado_cassette, cod_pelicula [FK -> PELICULA.cod_pelicula])`
9. `ACTOR(cod_actor [PK], nombre_actor, fecha_nac_actor)`
10. `PELICULA_ACTOR(cod_pelicula [PK, FK -> PELICULA.cod_pelicula], cod_actor [PK, FK -> ACTOR.cod_actor], rol_en_pelicula)`
11. `CATEGORIA(cod_categoria [PK], nombre_categoria, recargo_categoria)`
12. `PELICULA_CATEGORIA(cod_pelicula [PK, FK -> PELICULA.cod_pelicula], cod_categoria [PK, FK -> CATEGORIA.cod_categoria])`
13. `DETALLE_ALQUILER(cod_alquiler [PK, FK -> ALQUILER.cod_alquiler], cod_cassette [PK, FK -> CASSETTE.cod_cassette], fecha_prog_dev, fecha_real_dev, dias_retraso)`
14. `TARIFA_MORA(dias_retraso [PK], recargo_categoria [PK], recargo_mora)`