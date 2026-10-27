document.addEventListener('DOMContentLoaded', function () {
    // Elementos de entrada de datos del cliente
    const clientInputs = {
        cedula: document.getElementById('cedula'),
        nombre: document.getElementById('nombre'),
        fecha: document.getElementById('fecha'),
        fecha_antiguedad: document.getElementById('fecha_antiguedad')
    };

    // Elementos para mostrar datos del cliente
    const clientDisplays = {
        cedula: document.getElementById('cedula-mostrar'),
        nombre: document.getElementById('nombre-mostrar'),
        fecha: document.getElementById('fecha-mostrar'),
        fecha_antiguedad: document.getElementById('fecha_antiguedad-mostrar')
    };

    // Inputs de valores
    const valueInputs = {
        avaoExento: document.getElementById('span-avao_exento'),
        avaoConRetencion: document.getElementById('span-avao_con_retencion'),
        avaoSinRetencion: document.getElementById('span-avao_sin_retencion'),
        avaeExento: document.getElementById('span-avae_exento'),
        avaeConRetencion: document.getElementById('span-avae_con_retención'),
        avaeSinRetencion: document.getElementById('span-avae_sin_retención'),
        aveo: document.getElementById('span-aveo'),
        avee: document.getElementById('span-avee'),
        apae: document.getElementById('span-apae'),
        acae: document.getElementById('span-acae'),
        acao: document.getElementById('span-acao')
    };

    // Spans para mostrar resultados (APAE eliminado)
    const resultSpans = {
        avaoExento: document.getElementById('avao_exento'),
        avaeExento: document.getElementById('avae_exento'),
        avaeConRetencion: document.getElementById('avae_con_retención'),
        avaeSinRetencion: document.getElementById('avae_sin_retención'),
        totalAvaoAvaeApaeAcae: document.getElementById('total_avao_avae_apae_acae'),
        sumaAvaoAvae: document.getElementById('suma_avao_avae'),
        totalAvao: document.getElementById('total_avao'),
        totalAvae: document.getElementById('total_avae'),
        sumaAcaoAveo: document.getElementById('suma_acao_aveo'),
        acao: document.getElementById('acao'),
        aveo: document.getElementById('aveo'),
        avee: document.getElementById('avee'),
        // Opcional: si algún día agregas <span id="acae"></span> en el HTML,
        // se pinta solo. Si no existe, se ignora sin generar errores.
        acae: document.getElementById('acae'),
        sumaTotal: document.getElementById('suma_total'),
        avaoAvaeApaeAcae2: document.getElementById('avao_avae_apae_acae')
    };

    const botonProcesar = document.getElementById('procesar-simulacion');

    const formatCurrency = (value) =>
        value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

    // Tolera inputs que no existan (null) sin reventar
    const parseInputValue = (input) => (input ? parseFloat(input.value) || 0 : 0);

    // Eventos para completar datos del cliente
    Object.keys(clientInputs).forEach(key => {
        if (!clientInputs[key] || !clientDisplays[key]) return;
        clientInputs[key].addEventListener('change', function () {
            clientDisplays[key].textContent = this.value;
        });
    });

    botonProcesar.addEventListener('click', function () {
        // Conversión de valores
        const values = {
            avaoExento: parseInputValue(valueInputs.avaoExento),
            avaoConRetencion: parseInputValue(valueInputs.avaoConRetencion),
            avaoSinRetencion: parseInputValue(valueInputs.avaoSinRetencion),
            avaeExento: parseInputValue(valueInputs.avaeExento),
            avaeConRetencion: parseInputValue(valueInputs.avaeConRetencion),
            avaeSinRetencion: parseInputValue(valueInputs.avaeSinRetencion),
            aveo: parseInputValue(valueInputs.aveo),
            avee: parseInputValue(valueInputs.avee),
            apae: parseInputValue(valueInputs.apae),
            acae: parseInputValue(valueInputs.acae),
            acao: parseInputValue(valueInputs.acao)
        };

        // Cálculos
        // APAE no se muestra por separado: se suma internamente al ACAE
        // y de aquí en adelante TODO usa "acaeGlobal".
        // OJO: el ACAE (con el APAE) es disponible en retiro parcial, por lo
        // tanto NO se mezcla con el AVEE (acciones), que solo se puede retirar
        // al terminar la relación laboral.
        const acaeGlobal = values.acae + values.apae;

        const totalAvao = values.avaoExento + values.avaoConRetencion + values.avaoSinRetencion;
        const totalAvae = values.avaeExento + values.avaeConRetencion + values.avaeSinRetencion;
        const sumaAvaoAvae = totalAvao + totalAvae;
        const sumaAcaoAveo = values.acao + values.aveo;
        const avaoAvaeApaeAcae2 = values.avaoExento + totalAvae + acaeGlobal;
        const totalAvaoAvaeApaeAcae = sumaAvaoAvae + acaeGlobal;
        const sumaTotal = sumaAvaoAvae + sumaAcaoAveo + acaeGlobal + values.avee;

        // Asignación de valores a los spans
        Object.entries({
            avaoExento: values.avaoExento,
            avaeExento: values.avaeExento,
            avaeConRetencion: values.avaeConRetencion,
            avaeSinRetencion: values.avaeSinRetencion,
            totalAvaoAvaeApaeAcae,
            sumaAvaoAvae,
            totalAvao,
            totalAvae,
            sumaAcaoAveo,
            acao: values.acao,
            aveo: values.aveo,
            avee: values.avee,
            acae: acaeGlobal,
            sumaTotal,
            avaoAvaeApaeAcae2
        }).forEach(([key, value]) => {
            if (resultSpans[key]) {
                resultSpans[key].textContent = formatCurrency(value);
            }
        });

        // Resultados crudos para AsistenteCorreos.js
        window.SimulacionResultados = {
            avaoExento: values.avaoExento,
            avaeExento: values.avaeExento,
            avaeConRetencion: values.avaeConRetencion,
            avaeSinRetencion: values.avaeSinRetencion,
            totalAvao,
            totalAvae,
            sumaAvaoAvae,
            sumaAcaoAveo,
            acao: values.acao,
            aveo: values.aveo,
            avee: values.avee,
            acae: acaeGlobal,
            sumaTotal,
            avaoAvaeApaeAcae2,
            totalAvaoAvaeApaeAcae
        };
    });
});