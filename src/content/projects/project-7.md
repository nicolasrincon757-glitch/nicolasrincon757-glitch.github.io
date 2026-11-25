---
title: "7. Taller de Normalización de Bases de Datos (1FN, 2FN, 3FN y BCNF)"
description: "Análisis de formas normales, identificación de dependencias funcionales y descomposición paso a paso hasta 3FN y BCNF en cinco casos prácticos."
publishDate: 2026-11-07
isFeatured: true
---

# 7. Taller de Normalización de Bases de Datos

Este documento recoge la resolución de **5 casos prácticos de normalización relacional**, abarcando la detección de anomalías y grupos multivaluados, diagramas de dependencias funcionales y la descomposición formal hasta **Tercera Forma Normal (3FN)** y **Forma Normal de Boyce-Codd (BCNF)**.

---

## 1. Asignación de Proyectos y Empleados (Tabla No. 1)

### Diagnóstico inicial
La tabla original **no cumple 1FN (0FN)** debido a celdas vacías en atributos de la clave primaria compuesta `(cod_proyecto, cod_empleado)` e inconsistencias de escritura (`Yamyle` / `Yamile` / `Llamile`; `Ingeniero` / `ingeniero`).

### Dependencias funcionales
- $(\text{cod\_proyecto}, \text{cod\_empleado}) \rightarrow \text{hrs\_asignadas}$ *(completa)*
- $\text{cod\_proyecto} \rightarrow \text{nom\_proyecto}$ *(parcial)*
- $\text{cod\_empleado} \rightarrow \text{nom\_empleado}, \text{profesion}, \text{vlr\_hora}$ *(parcial)*
- $\text{profesion} \rightarrow \text{vlr\_hora}$ *(transitiva)*

### Esquema resultante en 3FN
1. `PROYECTO(cod_proyecto [PK], nom_proyecto)`
2. `PROFESION(profesion [PK], vlr_hora)`
3. `EMPLEADO(cod_empleado [PK], nom_empleado, profesion [FK -> PROFESION.profesion])`
4. `PROYECTO_EMPLEADO(cod_proyecto [PK, FK -> PROYECTO.cod_proyecto], cod_empleado [PK, FK -> EMPLEADO.cod_empleado], hrs_asignadas)`

---

## 2. Tabla de Estudiantes (1FN)

### Diagnóstico inicial
La tabla **no está en 1FN** porque viola la atomicidad de los atributos: las columnas `Courses` y `GradePoints` almacenan listas separadas por comas (`NN204, SI204, IT221` y `2,3,3`) con correspondencia posicional implícita.

### Esquema resultante en 1FN
1. `Estudiante(Cod [PK], Name, Email)`
2. `Estudiante_Curso(Cod [PK, FK -> Estudiante.Cod], Course [PK], GradePoint)`

---

## 3. Restaurante Nocturno — `Member_Dinner` (Tabla No. 3)

### Diagnóstico inicial
Existen **grupos repetitivos multivaluados** de platos (`FOOD_CODE`, `FOOD_DESCRIPTION`) por cada asistencia de un miembro a una cena `(MEMBER_NUM, DINNER_NUM)`. Al incorporar `FOOD_CODE` a la clave primaria y completar todas las filas, se obtiene la relación en **1FN**:

`Member_Dinner(MEMBER_NUM [PK], DINNER_NUM [PK], FOOD_CODE [PK], MEMBER_NAME, MEMBER_ADDRESS, DINNER_DATE, VENUE_CODE, VENUE_DESCRIPTION, FOOD_DESCRIPTION)`

### Dependencias funcionales
- **Parciales:** `MEMBER_NUM -> MEMBER_NAME, MEMBER_ADDRESS`; `DINNER_NUM -> DINNER_DATE, VENUE_CODE, VENUE_DESCRIPTION`; `FOOD_CODE -> FOOD_DESCRIPTION`
- **Transitiva:** `DINNER_NUM -> VENUE_CODE -> VENUE_DESCRIPTION`

### Esquema resultante en 3FN
1. `Member(MEMBER_NUM [PK], MEMBER_NAME, MEMBER_ADDRESS)`
2. `Venue(VENUE_CODE [PK], VENUE_DESCRIPTION)`
3. `Dinner(DINNER_NUM [PK], DINNER_DATE, VENUE_CODE [FK -> Venue.VENUE_CODE])`
4. `Food(FOOD_CODE [PK], FOOD_DESCRIPTION)`
5. `Member_Dinner_Food(MEMBER_NUM [PK, FK -> Member.MEMBER_NUM], DINNER_NUM [PK, FK -> Dinner.DINNER_NUM], FOOD_CODE [PK, FK -> Food.FOOD_CODE])`

---

## 4. Visitas Médicas (Tabla No. 2)

### Diagnóstico inicial
La tabla está en **1FN** con clave primaria compuesta `(VisitaNo, ProvNo)`, pero **no cumple 2FN ni 3FN** debido a dependencias parciales y transitivas.

### Dependencias funcionales
- $(\text{VisitaNo}, \text{ProvNo}) \rightarrow \text{Diagnostico}$ *(completa)*
- $\text{VisitaNo} \rightarrow \text{DiaVisita}, \text{PacNo}$ *(parcial)*
- $\text{ProvNo} \rightarrow \text{ProvEspecialidad}$ *(parcial)*
- $\text{PacNo} \rightarrow \text{PacEdad}, \text{PacCiudad}$ *(transitiva desde `VisitaNo`)*

### Esquema resultante en 3FN
1. `PACIENTE(PacNo [PK], PacEdad, PacCiudad)`
2. `PROVEEDOR(ProvNo [PK], ProvEspecialidad)`
3. `VISITA(VisitaNo [PK], DiaVisita, PacNo [FK -> PACIENTE.PacNo])`
4. `ATENCION_DIAGNOSTICO(VisitaNo [PK, FK -> VISITA.VisitaNo], ProvNo [PK, FK -> PROVEEDOR.ProvNo], Diagnostico)`

---

## 5. Alquileres de DVD — `Rentals` (Tabla No. 4)

### Evaluación de dependencias funcionales
- `RentalID -> CustomerID`: **Verdadera** (cada pedido de alquiler pertenece a un único cliente).
- `Director -> Title`: **Falsa** (un mismo director puede dirigir múltiples películas distintas; la dependencia real es `Title -> Director`).

### Dependencias funcionales en 1FN
- **PK:** `(RentalID, Title)`
- **Parciales:** `RentalID -> CustomerID, MailedOutDate`; `Title -> Director, MovieCategory, Price`
- **Transitiva:** `Title -> MovieCategory -> Price`

### Esquema resultante en 3FN y BCNF
1. `Rental(RentalID [PK], CustomerID, MailedOutDate)`
2. `Category_Price(MovieCategory [PK], Price)`
3. `Movie(Title [PK], Director, MovieCategory [FK -> Category_Price.MovieCategory])`
4. `Rental_Detail(RentalID [PK, FK -> Rental.RentalID], Title [PK, FK -> Movie.Title])`

> **Equivalencia 3FN / BCNF:** La descomposición no cambia al exigir **BCNF**, ya que en las cuatro tablas resultantes todos los determinantes de dependencias funcionales no triviales (`RentalID`, `MovieCategory`, `Title` y `(RentalID, Title)`) son llaves candidatas.