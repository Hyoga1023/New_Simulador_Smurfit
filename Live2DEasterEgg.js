document.addEventListener("DOMContentLoaded", () => {

    const codigo = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight"
    ];

    let posicion = 0;
    let activado = false;

    document.addEventListener("keydown", (e) => {

        if (activado) return;

        if (e.key === codigo[posicion]) {

            posicion++;

            if (posicion === codigo.length) {

                activado = true;

                L2Dwidget.init({

                    model: {
                        jsonPath: "./live2d-proyecto/node_modules/live2d-widget-model-ni-j/assets/ni-j.model.json"
                    },

                    display: {
                    position: "right",
                    width: 250,
                    height: 440,
                    hOffset: 30,
                    vOffset: -30
                },

                    mobile: {
                        show: true
                    },

                    react: {
                        opacityDefault: 1,
                        opacityOnHover: 1
                    }

                });
                setTimeout(() => {
                mostrarMensajeLive2D();
            }, 800);
            }

        } else {

            posicion = 0;

        }

    });

});

function mostrarMensajeLive2D() {

    const mensaje = document.createElement("div");

    mensaje.id = "live2d-bocadillo";
    const frases = [

    "¡Me encontraste! 😊",

    "Vaya... alguien conoce los códigos secretos.",

    "Pensé que nadie descubriría esto.",

    "Acceso oculto desbloqueado.",

    "¿Cómo llegaste hasta aquí?",

    "Prometo no contarle a nadie. 🤫",

    "Buen trabajo... acabas de desbloquear un secreto.",

    "No muchos llegan hasta aquí.",

    "Interesante... parece que te gusta explorar.",

    "Bienvenido al club de los curiosos.",

    "Has encontrado mi escondite.",

    "Ya que me encontraste... tendré que acompañarte un rato.",

    "Este simulador guarda más secretos de los que imaginas.",

    "Has desbloqueado el modo desarrollador... bueno, casi. 😄",

    "¿Buscabas errores... o me estabas buscando a mí?",

    "Sistema oculto activado.",

    "Hola Amiguis... esperaba que tarde o temprano aparecieras.",

    "No todos descubren este Easter Egg.",

    "Excelente... ahora somos cómplices.",

    "No le cuentes a los demás dónde estaba escondida."

];

mensaje.textContent = frases[Math.floor(Math.random() * frases.length)];

    mensaje.style.position = "fixed";
    mensaje.style.bottom = "290px";
    mensaje.style.right = "170px";

    mensaje.style.background = "#ffffff";
    mensaje.style.color = "#222";
    mensaje.style.padding = "12px 18px";
    mensaje.style.borderRadius = "15px";
    mensaje.style.border = "2px solid #444";
    mensaje.style.fontFamily = "Inter, sans-serif";
    mensaje.style.fontSize = "15px";
    mensaje.style.fontWeight = "600";
    mensaje.style.boxShadow = "0 8px 18px rgba(0,0,0,.25)";
    mensaje.style.zIndex = "999999";

    // Estado inicial (invisible)
    mensaje.style.opacity = "0";
    mensaje.style.transform = "translateY(20px)";
    mensaje.style.transition = "all .35s";

    document.body.appendChild(mensaje);

    // Animación de entrada
    requestAnimationFrame(() => {
        mensaje.style.opacity = "1";
        mensaje.style.transform = "translateY(0)";
    });

    // Pico del bocadillo
    const pico = document.createElement("div");

    pico.style.position = "absolute";
    pico.style.right = "-10px";
    pico.style.bottom = "18px";

    pico.style.width = "0";
    pico.style.height = "0";

    pico.style.borderTop = "10px solid transparent";
    pico.style.borderBottom = "10px solid transparent";
    pico.style.borderLeft = "10px solid white";

    mensaje.appendChild(pico);

    // Desaparece después de 3.5 segundos
    setTimeout(() => {

        mensaje.style.opacity = "0";
        mensaje.style.transform = "translateY(20px)";

        setTimeout(() => mensaje.remove(), 350);

    }, 3500);

}