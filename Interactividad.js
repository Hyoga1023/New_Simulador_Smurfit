// Espera a que el documento esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {

 // ============================
// GENERAR PDF (OPTIMIZADO)
// ============================
const generarPdfBtn = document.getElementById("generar_pdf");

if (generarPdfBtn) {

    generarPdfBtn.addEventListener("click", generarPDF);

}

async function generarPDF() {
    try {
        await Promise.all([
            document.fonts.load('600 0.8rem "IBM Plex Mono"'),
            document.fonts.load('700 1.25rem "IBM Plex Mono"'),
            document.fonts.load('500 0.9rem "IBM Plex Mono"'),
            document.fonts.load('600 1.15rem "Inter"'),
            document.fonts.load('500 0.9rem "Inter"'),
        ]);
        await document.fonts.ready;

        window.scrollTo(0, 0);

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: "landscape", unit: "px", compress: true });
        const PDF_WIDTH = 1200;

        const tempContainer = document.createElement("div");
        tempContainer.style.position = "fixed";
        tempContainer.style.left = "-99999px";
        tempContainer.style.top = "0";
        tempContainer.style.background = getComputedStyle(document.body).backgroundColor;
        tempContainer.style.width = PDF_WIDTH + "px";
        tempContainer.style.paddingBottom = "150px";
        tempContainer.style.boxSizing = "border-box";
        tempContainer.classList.add("pdf-render-mode");

        const pdfOverrideStyles = document.createElement("style");
        pdfOverrideStyles.textContent = `
            .pdf-render-mode .bloque_superior,
            .pdf-render-mode .bloque_inferior,
            .pdf-render-mode .contenedor_general,
            .pdf-render-mode .valores_inferior {
                padding-left: 64px !important;
                padding-right: 64px !important;
            }

            /* Blindaje de títulos: le damos "aire" para que la fuente
               mono no choque contra el borde inferior */
            .pdf-render-mode .titulos_columnas {
                line-height: 1.4 !important;
                padding: 6px 10px 10px !important;
                align-items: baseline !important;
            }

            



            /*-------------------------------------------*/
            
            /* Blindaje contra el bug de html2canvas con align-items:baseline
               en flexbox: pasamos a "center" y quitamos el padding-top
               "trampa" que usábamos para alinear valores con etiquetas
               (ya no hace falta con center). Evita que la línea punteada
               (border-bottom de .conjunto) colapse encima del texto. */
            .pdf-render-mode .conjunto {
                align-items: center !important;
                min-height: 24px !important;
            }
            .pdf-render-mode .conjunto .valores_calculos {
                padding-top: 0 !important;
            }

            /* Mismo blindaje para la franja de aportes de abajo: aire
               explícito entre el monto y la línea divisoria
               (.agrupación2 border-top) para que no se monten cuando
               html2canvas mide mal la altura del bloque. */
            .pdf-render-mode .aportes {
                margin-bottom: 10px !important;
            }
            .pdf-render-mode .aportes #suma_avao_avae,
            .pdf-render-mode .aportes #suma_acao_aveo {
                margin-top: 6px !important;
                margin-bottom: 4px !important;
            }
            .pdf-render-mode .agrupación2 {
                margin-top: 8px !important;
            }
        `;
        tempContainer.appendChild(pdfOverrideStyles);

        const mainClone = document.querySelector("main").cloneNode(true);
        mainClone.querySelectorAll("h1,h2,h3,h4,h5,h6,span").forEach(el => {
            el.style.position = "static";
            el.style.transform = "none";
            el.style.top = "auto";
            el.style.left = "auto";
        });

        tempContainer.appendChild(mainClone);
        document.body.appendChild(tempContainer);

        // Le damos dos frames al navegador para que "asiente" el layout
        // antes de capturar (evita capturar a mitad de un repaint)
        await new Promise(resolve =>
            requestAnimationFrame(() => requestAnimationFrame(resolve))
        );

        const canvas = await html2canvas(tempContainer, {
            scale: 2,
            useCORS: true,
            backgroundColor: null,
            logging: false,
            imageTimeout: 0,
            windowWidth: PDF_WIDTH,
            windowHeight: tempContainer.scrollHeight,
            scrollX: 0,
            scrollY: 0,
            x: 0,
            y: 0,
            letterRendering: true
        });

        document.body.removeChild(tempContainer);

        const imgData = canvas.toDataURL("image/jpeg", 0.90);
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = (canvas.height * pageWidth) / canvas.width;
        pdf.internal.pageSize.height = pageHeight;
        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
        pdf.save("simulacion_plan_Smurfit.pdf");

    } catch (error) {
        console.error("Error al generar el PDF:", error);
    }
}

    // ============================
    // VALIDACIÓN DE CAMPOS
    // ============================
    const inputs = document.querySelectorAll(".tipo_aportes input");

    if (inputs.length > 0) {

        inputs.forEach((input) => {

            input.addEventListener("input", (event) => {

                const value = event.target.value;

                if (/[^0-9]/.test(value)) {

                    alert("Por favor, ingresa solo números sin puntos, comas ni caracteres especiales.");

                    event.target.value = value.replace(/[^0-9]/g, "");

                }

            });

        });

    }

    // ============================
    // PROCESAR SIMULACIÓN
    // ============================
    function procesarSimulacion() {

        let camposValidos = true;

        inputs.forEach((input) => {

            if (input.value.trim() === "") {

                camposValidos = false;

                alert(`El campo ${input.placeholder} no puede estar vacío.`);

            }

        });

        if (!camposValidos) {
            console.log("Por favor, completa todos los campos antes de continuar.");
            return;
        }

        // Desplazarse suavemente al inicio
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        console.log("Todos los campos son válidos. Procesando simulación...");

        // Aquí continúa el resto de la simulación
    }

    // ============================
    // BOTÓN PROCESAR SIMULACIÓN
    // ============================
    const botonSimulacion = document.getElementById("procesar-simulacion");

    if (botonSimulacion) {

        botonSimulacion.addEventListener("click", procesarSimulacion);

    } else {

        console.warn("El botón de simulación no se encontró en el DOM");

    }

});
// ============================
    // BOTÓN VOLVER ARRIBA
    // ============================
    const btnVolverArriba = document.getElementById("btn-volver-arriba");

    if (btnVolverArriba) {
        // Muestra u oculta el botón dependiendo de cuánto se desplaza la página
        window.addEventListener("scroll", function () {
            if (window.scrollY > 300) {
                btnVolverArriba.classList.add("visible");
            } else {
                btnVolverArriba.classList.remove("visible");
            }
        });

        // Al hacer clic, desplaza la pantalla suavemente hasta arriba
        btnVolverArriba.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }