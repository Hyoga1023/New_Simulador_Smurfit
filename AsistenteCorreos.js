// ==========================================================================
// ASISTENTE DE CORREOS
// --------------------------------------------------------------------------
// Genera plantillas de respuesta a correos automáticas a partir de los
// resultados YA calculados por Simulacion.js (window.SimulacionResultados).
//
// IMPORTANTE: este archivo NO recalcula ni reinterpreta ninguna cifra.
// Únicamente lee los valores numéricos crudos que Simulacion.js expone y
// los redacta en texto. Así evitamos el riesgo de que una plantilla de
// correo muestre un dato distinto al que el cliente ve en pantalla o en
// el PDF.
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {

    // ============================
    // FORMATO DE MONEDA
    // ============================
    // Mismo formato usado en Simulacion.js, para que el texto del correo
    // luzca igual a las cifras que el cliente ve en el simulador.
    const formatCurrency = (value) =>
        (Number(value) || 0).toLocaleString("es-CO", { style: "currency", currency: "COP" });

    // ============================
    // DATOS DE APOYO
    // ============================
    function obtenerSaludoHora() {
        const hora = new Date().getHours();
        return hora < 12 ? "Buenos días" : "Buenas tardes";
    }

    function obtenerNombreCliente() {
        const inputNombre = document.getElementById("nombre");
        const nombre = inputNombre && inputNombre.value.trim();
        return nombre || "[Nombre del afiliado]";
    }

    // Verifica que ya se haya procesado una simulación antes de generar
    // cualquier plantilla. Si no, avisa al usuario en vez de mostrar un
    // correo con datos vacíos o en $0.
    function obtenerDatosSimulacion() {
        if (!window.SimulacionResultados) {
            alert("Primero debes hacer clic en \"Procesar Simulación\" antes de generar la plantilla de correo.");
            return null;
        }
        return window.SimulacionResultados;
    }

    // ==========================================================================
    // PLANTILLAS
    // --------------------------------------------------------------------------
    // Cada plantilla es una función que retorna el texto final del correo,
    // o null si no hay datos disponibles todavía.
    // Para agregar una nueva plantilla en el futuro, basta con:
    //   1. Escribir la función plantillaX() siguiendo el mismo patrón.
    //   2. Agregarla al objeto "plantillas" al final de esta sección.
    //   3. El botón correspondiente se crea solo (ver crearBotonesUI()).
    // ==========================================================================

    // ---- RETIRO PARCIAL ----
    function plantillaRetiroParcial() {
        const datos = obtenerDatosSimulacion();
        if (!datos) return null;

        const saludo = obtenerSaludoHora();
        const nombre = obtenerNombreCliente();
        const saldoTotalParcial = datos.avaoAvaeApaeAcae2; // "Total Parcial Disponible"
        const saldoExento = datos.avaoExento;               // Ordinarios - Saldo Exento
        const saldoConRetencion = saldoTotalParcial - saldoExento;

        return `${saludo} Señor(a) ${nombre}, espero se encuentre bien.

Adjunto envío la simulación donde podemos evidenciar lo siguiente:

* Para retiro parcial, actualmente tiene un saldo de ${formatCurrency(saldoTotalParcial)}, de los cuales están exentos hasta ${formatCurrency(saldoExento)}. Para el resto, es decir ${formatCurrency(saldoConRetencion)}, aplican las retenciones correspondientes según el tipo de aporte.

Recuerda que:
* El saldo ordinario exento lo puede retirar una sola vez por año calendario.
* El saldo extraordinario lo puede retirar una vez por semestre.
* Realizar un retiro parcial no afecta su permanencia en el fondo.

Si desea realizar un retiro parcial, por favor confirme su decisión indicando el valor a retirar y le enviaré el formato con el cual se solicita la autorización a la empresa.

Quedo atento(a) a cualquier duda que tenga al respecto.

Cordial saludo.`;
    }

    // ---- RETIRO TOTAL ----
    function plantillaRetiroTotal() {
        const datos = obtenerDatosSimulacion();
        if (!datos) return null;

        const saludo = obtenerSaludoHora();
        const nombre = obtenerNombreCliente();
        const saldoTotalParcial = datos.avaoAvaeApaeAcae2; // "Total Parcial Disponible"
        const saldoExento = datos.avaoExento;               // Ordinarios - Saldo Exento
        const saldoConRetencion = saldoTotalParcial - saldoExento;
        const saldoTotal = datos.totalAvaoAvaeApaeAcae;     // "Saldo con Retención y Penalidad"

        return `${saludo} Señor(a) ${nombre}, espero se encuentre bien.

Adjunto envío la simulación donde podemos evidenciar lo siguiente:

* Para retiro parcial, actualmente tiene un saldo de ${formatCurrency(saldoTotalParcial)}, de los cuales están exentos hasta ${formatCurrency(saldoExento)}. Para el resto, es decir ${formatCurrency(saldoConRetencion)}, aplican las retenciones correspondientes según el tipo de aporte.

* Para retiro total, actualmente tiene un saldo de ${formatCurrency(saldoTotal)}, valor que incluye la retención y penalidad aplicables descritos a continuación:

* Quedará penalizado(a) por 1 año, durante el cual no podrá ahorrar en el Fondo.
* Si lleva menos de 10 años ahorrando en el Fondo, perderá los aportes no consolidados que la empresa ha realizado en su nombre.
* El saldo consolidado a nombre de la empresa es con fines pensionales y solo se puede retirar al momento de pensionarte.
* El valor correspondiente a acciones solo se puede retirar una vez finalice tu relación laboral con la compañía, si la empresa lo autoriza.

Si desea realizar retiro parcial o total, por favor confirme su decisión (Para retiro parcial requiero el valor a retirar) y le enviaré el formato con el cual se solicita la autorización a la empresa.

Quedo atento(a) a cualquier duda que tenga al respecto.

Cordial saludo.`;
    }

    // Registro central de plantillas disponibles. Agregar nuevas aquí.
    const plantillas = {
        parcial: { etiqueta: "Correo Retiro Parcial", generar: plantillaRetiroParcial },
        total: { etiqueta: "Correo Retiro Total", generar: plantillaRetiroTotal }
    };

    // ==========================================================================
    // INTERFAZ (botones + modal de vista previa / copiar)
    // ==========================================================================

    function inyectarEstilos() {
        const style = document.createElement("style");
        style.textContent = `
            .correos-seccion {
                max-width: 1200px;
                margin: 24px auto 0;
                padding: 0 clamp(20px, 5vw, 64px);
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
                justify-content: flex-end;
            }
            .correos-boton {
                font-family: var(--font-body, Arial, sans-serif);
                font-weight: 600;
                font-size: 0.92rem;
                background-color: var(--primary, #14487D);
                color: #fff;
                border-radius: 8px;
                padding: 13px 26px;
                border: 1px solid var(--primary, #14487D);
                cursor: pointer;
                transition: background-color 0.15s ease;
            }
            .correos-boton:hover {
                background-color: var(--primary-dark, #0B2E52);
            }
            .correos-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(11, 46, 82, 0.55);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                padding: 20px;
            }
            .correos-modal {
                background: #fff;
                border-radius: 10px;
                width: 100%;
                max-width: 640px;
                max-height: 85vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 10px 40px rgba(0,0,0,0.25);
            }
            .correos-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 18px 22px;
                border-bottom: 1px solid #d7dbdf;
            }
            .correos-modal-header h3 {
                font-family: var(--font-body, Arial, sans-serif);
                font-size: 1.05rem;
                color: #111213;
            }
            .correos-modal-cerrar {
                background: none;
                border: none;
                font-size: 1.3rem;
                line-height: 1;
                cursor: pointer;
                color: #48515a;
            }
            .correos-modal-body {
                padding: 18px 22px;
                overflow-y: auto;
            }
            .correos-modal-textarea {
                width: 100%;
                min-height: 320px;
                font-family: var(--font-body, Arial, sans-serif);
                font-size: 0.92rem;
                line-height: 1.6;
                color: #111213;
                border: 1px solid #d7dbdf;
                border-radius: 8px;
                padding: 14px;
                resize: vertical;
            }
            .correos-modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                padding: 14px 22px 20px;
            }
            .correos-copiado {
                font-size: 0.8rem;
                color: #14487D;
                margin-right: auto;
                align-self: center;
                opacity: 0;
                transition: opacity 0.2s ease;
            }
            .correos-copiado.visible {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    function copiarAlPortapapeles(texto, indicador) {
        const marcarCopiado = () => {
            if (!indicador) return;
            indicador.classList.add("visible");
            setTimeout(() => indicador.classList.remove("visible"), 1800);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(texto).then(marcarCopiado).catch(() => {
                copiarConTextareaTemporal(texto);
                marcarCopiado();
            });
        } else {
            copiarConTextareaTemporal(texto);
            marcarCopiado();
        }
    }

    function copiarConTextareaTemporal(texto) {
        const temp = document.createElement("textarea");
        temp.value = texto;
        temp.style.position = "fixed";
        temp.style.left = "-9999px";
        document.body.appendChild(temp);
        temp.select();
        try {
            document.execCommand("copy");
        } catch (err) {
            console.error("No se pudo copiar el texto:", err);
        }
        document.body.removeChild(temp);
    }

    function mostrarModalCorreo(titulo, texto) {
        const overlay = document.createElement("div");
        overlay.className = "correos-modal-overlay";

        overlay.innerHTML = `
            <div class="correos-modal" role="dialog" aria-modal="true">
                <div class="correos-modal-header">
                    <h3>${titulo}</h3>
                    <button type="button" class="correos-modal-cerrar" aria-label="Cerrar">&times;</button>
                </div>
                <div class="correos-modal-body">
                    <textarea class="correos-modal-textarea"></textarea>
                </div>
                <div class="correos-modal-footer">
                    <span class="correos-copiado">Copiado ✓</span>
                    <button type="button" class="boton correos-modal-cerrar-btn">Cerrar</button>
                    <button type="button" class="boton correos-modal-copiar">Copiar texto</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const textarea = overlay.querySelector(".correos-modal-textarea");
        textarea.value = texto;

        const indicadorCopiado = overlay.querySelector(".correos-copiado");
        const cerrar = () => document.body.removeChild(overlay);

        overlay.querySelector(".correos-modal-cerrar").addEventListener("click", cerrar);
        overlay.querySelector(".correos-modal-cerrar-btn").addEventListener("click", cerrar);
        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) cerrar();
        });
        overlay.querySelector(".correos-modal-copiar").addEventListener("click", () => {
            copiarAlPortapapeles(textarea.value, indicadorCopiado);
        });
    }

    function crearBotonesUI() {
        const seccionReferencia = document.querySelector(".pdf");
        if (!seccionReferencia) return;

        const seccion = document.createElement("section");
        seccion.className = "correos-seccion";

        Object.entries(plantillas).forEach(([clave, plantilla]) => {
            const boton = document.createElement("button");
            boton.type = "button";
            boton.className = "correos-boton";
            boton.textContent = plantilla.etiqueta;
            boton.addEventListener("click", () => {
                const texto = plantilla.generar();
                if (texto) {
                    mostrarModalCorreo(plantilla.etiqueta, texto);
                }
            });
            seccion.appendChild(boton);
        });

        seccionReferencia.insertAdjacentElement("afterend", seccion);
    }

    // ============================
    // INICIALIZACIÓN
    // ============================
    inyectarEstilos();
    crearBotonesUI();

});