# Guía Completa de Importación de Miembros

**Sistema**: Khesed-Tek Church Management System  
**Módulo**: Gestión de Miembros → Importar Miembros  
**Última actualización**: Mayo 2026  

---

## ¿Dónde Está el Botón de Importación?

1. Ir al menú lateral → **Miembros**
2. En la esquina superior derecha de la lista, buscar el botón:
   ```
   ⬆ Importar Miembros
   ```
3. **Roles que pueden importar**: SUPER_ADMIN, PASTOR, ADMIN_IGLESIA  
   _(LIDER y MIEMBRO no ven el botón)_

---

## Formatos de Archivo Soportados

| Formato | Extensión | Notas |
|---------|-----------|-------|
| Excel moderno | `.xlsx` | Recomendado |
| Excel clásico | `.xls` | Compatible |
| CSV | `.csv` | Texto plano, separado por comas |

**Límite de tamaño**: 10 MB  
**Límite de filas**: 1,000 registros por importación

---

## Estructura del Archivo CSV / Excel

### Encabezados de Columna (primera fila)

El sistema reconoce los siguientes nombres de columna **en inglés o con variantes comunes**:

| Nombre de columna | Descripción | Obligatorio |
|-------------------|-------------|-------------|
| `firstName` | Nombre(s) | **SÍ** |
| `lastName` | Apellido(s) | **SÍ** |
| `email` | Correo electrónico | No |
| `phone` | Teléfono / celular | No |
| `address` | Dirección / calle | No |
| `city` | Ciudad | No |
| `state` | Departamento / estado / provincia | No |
| `zipCode` | Código postal | No |
| `birthDate` | Fecha de nacimiento | No |
| `membershipDate` | Fecha de ingreso a la iglesia | No |
| `baptismDate` | Fecha de bautismo | No |
| `gender` | Género | No |
| `maritalStatus` | Estado civil | No |
| `occupation` | Ocupación / profesión | No |
| `notes` | Notas / observaciones | No |

### Variantes de Nombres de Columna Aceptadas

El sistema mapea automáticamente estas variaciones a los campos canónicos:

| Si tu archivo tiene... | Se mapea a |
|------------------------|-----------|
| `first name`, `firstname`, `first_name` | `firstName` |
| `last name`, `lastname`, `last_name` | `lastName` |
| `name`, `full name` | `firstName` (el apellido se extrae automáticamente) |
| `email address`, `e-mail` | `email` |
| `phone number`, `mobile`, `cell`, `telephone` | `phone` |
| `street address`, `street` | `address` |
| `zip`, `zip code`, `zipcode`, `postal code` | `zipCode` |
| `birth date`, `birthdate`, `date of birth`, `dob` | `birthDate` |
| `membership date`, `join date` | `membershipDate` |
| `baptism date`, `baptized` | `baptismDate` |
| `sex` | `gender` |
| `marital status` | `maritalStatus` |
| `job` | `occupation` |
| `comments` | `notes` |

---

## Formato de los Valores

### Fechas
Dos formatos son aceptados:

| Formato | Ejemplo | Notas |
|---------|---------|-------|
| `YYYY-MM-DD` | `1985-05-15` | **Recomendado** — estándar internacional |
| `DD/MM/YYYY` | `15/05/1985` | También aceptado |

> ⚠️ **Evitar**: formatos como `May 15, 1985` o `15-Mayo-1985` — no serán reconocidos.

### Género
El sistema normaliza automáticamente:

| Valor en el archivo | Se almacena como |
|---------------------|-----------------|
| `Masculino`, `M`, `H`, `m`, `h`, `male`, `hombre` | `Masculino` |
| `Femenino`, `F`, `W`, `f`, `w`, `female`, `mujer` | `Femenino` |

### Estado Civil
Valores reconocidos:

| Valor | Descripción |
|-------|-------------|
| `soltero` / `soltera` | Soltero(a) |
| `casado` / `casada` | Casado(a) |
| `divorciado` / `divorciada` | Divorciado(a) |
| `viudo` / `viuda` | Viudo(a) |
| `union-libre` | Unión Libre |

---

## Plantilla Oficial CSV

Al abrir el diálogo de importación, hacer clic en **"Descargar Plantilla CSV"** para obtener:

```csv
firstName,lastName,email,phone,address,city,state,zipCode,birthDate,membershipDate,baptismDate,gender,maritalStatus,occupation,notes
Juan,Pérez,juan@email.com,555-0123,"Calle 123, #45",Bogotá,Cundinamarca,110111,1985-05-15,2020-01-15,2020-02-20,Masculino,Casado,Ingeniero,Líder de jóvenes
María,García,maria@email.com,555-0124,"Carrera 67, #89",Medellín,Antioquia,050001,1990-08-20,2021-03-10,2021-04-15,Femenino,Soltera,Doctora,Ministerio de niños
```

---

## Paso a Paso: Cómo Importar

**1 — Preparar el archivo**
- Abrir Excel o Google Sheets
- La **primera fila** debe tener los encabezados (ver tabla arriba)
- A partir de la **segunda fila**: un miembro por fila
- Verificar que `firstName` y `lastName` estén presentes en cada fila
- Guardar como `.xlsx` (Excel) o `.csv`

**2 — Abrir el diálogo de importación**
- Menú lateral → **Miembros**
- Botón **"⬆ Importar Miembros"** (esquina superior derecha)

**3 — Cargar el archivo**
- Hacer clic en el área de carga o arrastrar el archivo
- El sistema valida el formato y tamaño automáticamente

**4 — Configurar opciones**
- **"Actualizar registros existentes"**: 
  - ✅ Activado: si un miembro con el mismo email ya existe, se actualizan sus datos
  - ❌ Desactivado (predeterminado): los duplicados se omiten sin errores

**5 — Ejecutar la importación**
- Hacer clic en **"Importar"**
- Esperar la barra de progreso (puede tomar hasta 30 segundos para 1,000 registros)

**6 — Revisar resultados**
El sistema muestra un resumen:
```
Importación completada:
  ✅ 245 nuevos miembros importados
  🔄 12 miembros actualizados
  ❌ 3 filas fallaron (ver detalles)
```

Las filas con error muestran: número de fila, campo problemático y razón del error.

**7 — Cerrar y verificar**
- Hacer clic en **"Completar"**
- La lista de miembros se actualiza automáticamente

---

## Preparación del CSV en Google Sheets (Para Prueba de Estrés)

Para preparar una lista grande de miembros:

1. Archivo → Google Sheets → hoja nueva
2. Fila 1: pegar los encabezados:
   ```
   firstName	lastName	email	phone	address	city	state	zipCode	birthDate	membershipDate	gender	maritalStatus
   ```
3. Completar filas 2 en adelante con los miembros
4. Archivo → **Descargar → Valores separados por comas (.csv)**
5. El archivo descargado estará listo para importar

---

## Ejemplo de Archivo CSV Completo

```csv
firstName,lastName,email,phone,address,city,state,zipCode,birthDate,membershipDate,baptismDate,gender,maritalStatus,occupation,notes
Carlos,Rodríguez,carlos.rodriguez@email.com,+57-300-111-2222,"Calle 45 #12-34",Bogotá,Cundinamarca,110111,1978-03-22,2018-06-01,2018-07-15,Masculino,Casado,Contador,Equipo de alabanza
Ana,Martínez,ana.martinez@email.com,+57-315-555-6666,"Carrera 80 #45-67",Medellín,Antioquia,050022,1992-11-10,2022-01-20,,Femenino,Soltera,Diseñadora,Ministerio de jóvenes
Luis,Hernández,,+57-321-777-8888,,Cali,Valle del Cauca,,1965-07-04,2015-03-12,2015-04-05,Masculino,Casado,Pastor Asociado,Liderazgo
Diana,López,diana.lopez@email.com,,,Barranquilla,Atlántico,,1988-09-30,2023-08-15,,Femenino,Divorciada,Enfermera,
```

**Notas del ejemplo anterior:**
- `Luis`: sin email ni dirección (campos opcionales — válido)
- `Diana`: sin fecha de nacimiento ni bautismo — también válido
- Los campos vacíos entre comas consecutivas `,,,` son correctos en CSV

---

## Validación y Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `Nombre es requerido` | La columna `firstName` está vacía | Llenar el nombre en esa fila |
| `Apellido es requerido` | La columna `lastName` está vacía | Llenar el apellido o usar "—" |
| `Email inválido` | El email no tiene formato correcto | Revisar formato: `usuario@dominio.com` |
| `Teléfono inválido` | El teléfono contiene letras | Solo números, espacios, `+`, `-`, `(`, `)` |
| `Tipo de archivo no válido` | El archivo no es .xlsx, .xls o .csv | Convertir a formato soportado |
| `El archivo debe ser menor a 10MB` | Archivo muy grande | Dividir en múltiples archivos de ≤1,000 filas |

---

## Recomendaciones para Prueba de Estrés

Para cargar una lista grande eficientemente:

1. **Dividir en lotes** de máximo 1,000 filas por importación
2. **Activar "Actualizar registros existentes"** para poder re-importar sin duplicados
3. **Asegurar emails únicos** — el email es la clave de deduplicación
4. Miembros **sin email** se crean siempre como nuevos (sin deduplicación)
5. Hacer **una importación de prueba** con 5-10 filas primero para verificar el mapeo

---

## Permisos Requeridos

| Rol | Puede Importar |
|-----|---------------|
| SUPER_ADMIN | ✅ Sí |
| PASTOR | ✅ Sí |
| ADMIN_IGLESIA | ✅ Sí |
| LIDER | ❌ No |
| MIEMBRO | ❌ No |

---

*Documento generado para el stress test — Mayo 2026*
