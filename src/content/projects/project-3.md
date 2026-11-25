---
title: "3. Gestión de Usuarios y Privilegios (DCL)"
description: "Configuración de roles de acceso en MySQL bajo el principio de mínimo privilegio para la base de datos ConduCar."
publishDate: 2026-11-03
isFeatured: true
---

# 3. Seguridad y Control de Acceso (`ConduCar`)

Este script (DCL) implementa el esquema de seguridad de la base de datos mediante cuentas con distintos niveles de autorización según el rol operativo.

## ¿Cómo funciona?

1. **Limpieza idempotente:** Ejecuta `DROP USER IF EXISTS` para eliminar versiones previas de los usuarios y permitir reejecutar el script sin conflictos.
2. **Definición de 4 perfiles de acceso sobre `conducar.*`:**
   - **`admin`:** Control total (`ALL PRIVILEGES`) para administración del servidor y mantenimiento estructural.
   - **`proyecto`:** Control total (`ALL PRIVILEGES`) destinado al equipo de desarrollo e integración de la aplicación.
   - **`gestionador`:** Permisos operativos CRUD (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) sobre los datos, sin facultad para alterar o eliminar la estructura de tablas (`DROP`/`ALTER`).
   - **`consultor`:** Acceso estrictamente de solo lectura (`SELECT`) para auditoría, reportes y analítica sin riesgo de modificar información.
3. **Verificación:** Finaliza ejecutando `SHOW GRANTS FOR 'consultor'` para confirmar en consola que las restricciones se aplicaron correctamente.

## Código SQL

```sql
DROP USER IF EXISTS 'admin', 'proyecto', 'gestionador', 'consultor';

CREATE USER 'admin' IDENTIFIED BY 'Admin_2026';
GRANT ALL PRIVILEGES ON conducar.* TO 'admin';

CREATE USER 'proyecto' IDENTIFIED BY 'Proyecto_2026';
GRANT ALL PRIVILEGES ON conducar.* TO 'proyecto';

CREATE USER 'gestionador' IDENTIFIED BY 'Gestion_2026';
GRANT SELECT, INSERT, UPDATE, DELETE ON conducar.* TO 'gestionador';

CREATE USER 'consultor' IDENTIFIED BY 'Consultor_2026';
GRANT SELECT ON conducar.* TO 'consultor';

SHOW GRANTS FOR 'consultor';
```