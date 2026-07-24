# Simulador de Retiro Plan Institucional Smurfit

![Estado](https://img.shields.io/badge/Estado-Activo-success)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![HTML5](https://img.shields.io/badge/HTML5-orange)
![CSS3](https://img.shields.io/badge/CSS3-blue)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green)

## Descripción

Aplicación web desarrollada para apoyar la asesoría a los afiliados del **Plan Institucional Smurfit** administrado por **Protección S.A.**

El sistema permite calcular automáticamente los diferentes escenarios de retiro del fondo, visualizar los saldos disponibles, generar un informe profesional en PDF y crear respuestas de correo electrónico listas para enviar al afiliado.

Todo el procesamiento se realiza del lado del cliente (Frontend), por lo que no requiere servidor ni base de datos.

---

# Características

- Cálculo automático de saldos para retiro parcial.
- Cálculo automático de saldos para retiro total.
- Cálculo de valores exentos y gravados.
- Cálculo de retenciones y penalidades.
- Consolidación de aportes del afiliado y del empleador.
- Visualización clara mediante un dashboard.
- Generación automática de PDF optimizado.
- Plantillas automáticas de correo.
- Copia directa del correo al portapapeles.
- Validación de todos los campos numéricos.
- Diseño responsive.
- Uso de tipografías corporativas.

---

# Vista General

> Aquí puedes agregar posteriormente algunas capturas del sistema.

```
img/
    captura1.png
    captura2.png
```

---

# Información calculada

El simulador calcula automáticamente:

- Disponible para retiro parcial
- Disponible para retiro total
- Aportes Ordinarios
- Aportes Extraordinarios
- Aportes Consolidados
- Aportes No Consolidados
- Acciones
- Perseverancia
- Total en Cuenta
- Penalidades
- Retenciones

---

# Generación de PDF

El sistema genera un PDF profesional que contiene:

- Información del afiliado
- Fecha de generación
- Antigüedad de la cuenta
- Resumen financiero
- Condiciones para retiro parcial
- Condiciones para retiro total
- Beneficios extraordinarios
- Totales consolidados

El PDF se genera completamente en el navegador utilizando:

- html2canvas
- jsPDF

---

# Asistente de Correos

El sistema incluye un generador automático de respuestas para el asesor.

Actualmente soporta:

- Correo Retiro Parcial
- Correo Retiro Total
- Correo Afiliado Menos de 10 años

Las plantillas utilizan los mismos valores calculados por el simulador para evitar inconsistencias.

---

# Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript ES6
- jsPDF
- html2canvas
- Google Fonts
- IBM Plex Mono
- Inter
- Diodrum

---

# Estructura del proyecto

```
Simulador-Smurfit
│
├── index.html
├── styles.css
├── reset.css
│
├── Simulacion.js
├── Interactividad.js
├── AsistenteCorreos.js
├── Live2DEasterEgg.js
│
├── img/
├── font/
└── README.md
```

---

# Cómo ejecutar

No requiere instalación.

1. Abrir el archivo

```
index.html
```

en cualquier navegador moderno.

---

# Objetivo

Reducir el tiempo de atención del asesor, disminuir errores manuales y estandarizar la información entregada a los afiliados mediante una herramienta rápida, clara y confiable.

---

# Autor

**César Augusto Martínez Arce**

Asesor Inhouse • Protección S.A.

Desarrollador Front-End

GitHub:

https://github.com/Hyoga1023

---

# Licencia

Este proyecto fue desarrollado con fines de apoyo operativo y educativos.

Licencia MIT.
