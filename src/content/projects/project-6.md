---
title: "6. Taller de Álgebra Relacional"
description: "Diseño de 8 expresiones formales en álgebra relacional sobre un esquema universitario utilizando selección, proyección, reuniones, diferencia de conjuntos y división relacional."
publishDate: 2026-11-06
isFeatured: true
---

# 6. Taller de Álgebra Relacional

Este documento presenta el diseño formal de **8 consultas en álgebra relacional** aplicadas sobre un modelo de gestión de empleados universitarios, abordando filtros compuestos, reuniones naturales, productos cartesianos, diferencia de conjuntos y división relacional.

## Esquema Relacional Base

- `empleado(cod_emp, nombre-empleado, calle, ciudad)`
- `trabaja(cod_emp, cod_uni, sueldo_mensual)`
- `Universidad(cod_uni, nombre_uni, cuidad)`
- `jefe(cod_jefe, nombre_jefe, calle, ciudad)`

## Soluciones

### 1. Empleados que trabajan para la Universidad Central
Combina `empleado`, `trabaja` y `Universidad` mediante reunión natural ($\bowtie$), filtra por el nombre de la institución y proyecta el nombre del empleado:

$$\pi_{\text{nombre-empleado}}\Big(\sigma_{\text{nombre\_uni} = \text{'Universidad Central'}}(\text{empleado} \bowtie \text{trabaja} \bowtie \text{Universidad})\Big)$$

### 2. Nombre y ciudad de residencia de empleados de la Universidad de Los Andes
Filtra las asignaciones laborales correspondientes a `Universidad de Los Andes` y proyecta los datos de identificación y residencia desde `empleado`:

$$\pi_{\text{nombre-empleado},\, \text{ciudad}}\Big(\sigma_{\text{nombre\_uni} = \text{'Universidad de Los Andes'}}(\text{empleado} \bowtie \text{trabaja} \bowtie \text{Universidad})\Big)$$

### 3. Empleados de la Universidad Central con salario anual superior a $25'000.000$
Convierte el atributo `sueldo_mensual` a ingreso anual ($\text{sueldo\_mensual} \times 12 > 25000000$) dentro del predicado de selección:

$$\pi_{\text{nombre-empleado},\, \text{calle},\, \text{ciudad}}\Big(\sigma_{\text{nombre\_uni} = \text{'Universidad Central'} \,\land\, (\text{sueldo\_mensual} \times 12 > 25000000)}(\text{empleado} \bowtie \text{trabaja} \bowtie \text{Universidad})\Big)$$

### 4. Empleados que viven en la misma ciudad que la universidad donde trabajan
Compara la ciudad de residencia del empleado (`empleado.ciudad`) con la ubicación de la universidad (`Universidad.cuidad`):

$$\pi_{\text{nombre-empleado}}\Big(\sigma_{\text{empleado.ciudad} = \text{Universidad.cuidad}}(\text{empleado} \bowtie \text{trabaja} \bowtie \text{Universidad})\Big)$$

### 5. Empleados que viven en la misma ciudad y calle que sus jefes
Empareja las relaciones `empleado` y `jefe` verificando igualdad simultánea en los atributos `ciudad` y `calle`:

$$\pi_{\text{nombre-empleado}}\Big(\sigma_{\text{empleado.ciudad} = \text{jefe.ciudad} \,\land\, \text{empleado.calle} = \text{jefe.calle}}(\text{empleado} \times \text{jefe})\Big)$$

### 6. Empleados que no trabajan para la Universidad Central
Utiliza **diferencia de conjuntos ($-$)** sobre la llave primaria `cod_emp` para garantizar que no se incluyan empleados con múltiples contratos ni se pierdan empleados sin asignación o con nombres homónimos:

$$\pi_{\text{nombre-empleado}}\Bigg(\text{empleado} \bowtie \Big(\pi_{\text{cod\_emp}}(\text{empleado}) - \pi_{\text{cod\_emp}}\big(\sigma_{\text{nombre\_uni} = \text{'Universidad Central'}}(\text{trabaja} \bowtie \text{Universidad})\big)\Big)\Bigg)$$

### 7. Empleados que ganan más que cualquier empleado de la Universidad de Los Andes
Expresa el cuantificador universal ("más que todos") mediante diferencia de conjuntos, descartando a todo trabajador cuyo salario sea menor o igual ($\le$) al de algún empleado de la Universidad de Los Andes:

$$\pi_{\text{nombre-empleado}}\Bigg(\text{empleado} \bowtie \Big(\pi_{\text{cod\_emp}}(\text{trabaja}) - \pi_{\text{trabaja.cod\_emp}}\big(\sigma_{\text{trabaja.sueldo\_mensual} \le \text{sueldo\_andes}}(\text{trabaja} \times \rho_{\text{S}(\text{sueldo\_andes})}(\pi_{\text{sueldo\_mensual}}(\sigma_{\text{nombre\_uni} = \text{'Universidad de Los Andes'}}(\text{trabaja} \bowtie \text{Universidad}))))\big)\Big)\Bigg)$$

### 8. Universidades instaladas en cada ciudad donde opera la Universidad Nacional de Colombia
Aplica **división relacional ($\div$)** entre los pares `(nombre_uni, cuidad)` y el conjunto de sedes de la Universidad Nacional de Colombia:

$$\pi_{\text{nombre\_uni},\, \text{cuidad}}(\text{Universidad}) \div \pi_{\text{cuidad}}\Big(\sigma_{\text{nombre\_uni} = \text{'Universidad Nacional de Colombia'}}(\text{Universidad})\Big)$$