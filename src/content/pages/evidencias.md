---
title: 'ConduCar: Sistema de Información para un CEA'
description: Diseño e implementación de base de datos relacional en Tercera Forma Normal (MySQL 8), 62 ejercicios de álgebra relacional y aplicación web MVC en Java (JDBC puro) y Angular.
publishDate: 'Nov 13 2026'
isFeatured: true
seo:
  title: ConduCar - Proyecto Bases de Datos 1
  description: Caso de estudio completo de ingeniería de datos y desarrollo web con MySQL 8, JDBC y Angular para un Centro de Enseñanza Automovilística.
---

**ConduCar** es un sistema de información diseñado e implementado para resolver la gestión académica, operativa y financiera de un Centro de Enseñanza Automovilística (CEA) en Bogotá D.C., alineado con la normativa del Ministerio de Transporte (**Resoluciones 1500 de 2005, 3245 de 2009 y 20223040009425 de 2022**).

## Problema y Solución

En los CEA tradicionales, llevar matrículas, abonos, habilitaciones de instructores y vencimientos de flota (SOAT y revisión técnico-mecánica) en hojas de cálculo genera duplicidad de datos, saldos inconsistentes y errores de programación. ConduCar centraliza toda la operación en un esquema relacional normalizado en **3FN** con reglas de integridad estrictas y una interfaz web de consulta en tiempo real.

## Arquitectura Técnica

- **Modelado y Normalización:** 25 supuestos documentados, 16 reglas de negocio, MER Peter Chen, MER extendido (con agregación en `MATRICULA`), modelo relacional en **Oracle SQL Data Modeler** y normalización desde una planilla de 37 atributos (`0FN`) hasta **13 tablas en 3FN**.
- **Base de Datos (MySQL 8.0.46):** 16 llaves foráneas, 18 restricciones `CHECK`, control de acceso por roles (`admin`, `proyecto`, `gestionador`, `consultor`) y **62 consultas de álgebra relacional** verificadas en SQL.
- **Backend (Java + JDBC Puro):** Arquitectura por capas (**Router → Controller → Service → Repository → Model**) sin frameworks externos, usando `DriverManager`, `PreparedStatement` y `ResultSet` en modo de solo lectura.
- **Frontend (Angular):** Panel de indicadores, alertas tempranas de vencimiento documental, agenda de clases, control de saldos por matrícula y consola de consultas SQL.
- **Infraestructura:** Servidor virtualizado en **Oracle VirtualBox 7.2** sobre **Oracle Linux 9.8** (`conducar-db`).

## Mi Rol en el Equipo

Como **diseñador y administrador de la base de datos**, estuve a cargo de levantar los supuestos y reglas de negocio, construir los modelos conceptual y relacional, ejecutar la normalización hasta 3FN, elaborar el diccionario de datos, desarrollar los scripts DDL/DML/DCL en MySQL y configurar el servidor de base de datos sobre Oracle Linux 9.

- **Código fuente y scripts:** [github.com/PROYECTOUEB/conducar](https://github.com/PROYECTOUEB/conducar)