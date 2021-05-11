let pagina = 1;

const cita = {
    nombre: '',
    apellido: '',
    celular: '',
    fecha: '',
    hora: '',
    servicios: []

}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp()
});

function iniciarApp() {
    mostrarServicios();

    //resalta el div actual segun el tab al que se presiona
    mostrarSeccion()

    //oculta o muestra una seccion segun el tab al que se presiona
    cambiarSeccion();

    //paginacion siguiente y anterior
    paginaSiguiente();
    paginaAnterior();

    //comprueba la pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

    //mostrar el resumen de la cita o mensaje de error
    mostrarResumen();

    //alamcena el nombre de la cita en el objeto
    nombreCita();
    apellidoCita();
    fechaCita();
    celularCita();
    horaCita();
    //deshabilita dias pasados
    deshabilitarFecha();
}

function mostrarSeccion() {
    //eliminar mostrar seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }


    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');
    //eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }


    //resalta la sccion seccionActual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();

            pagina = parseInt(e.target.dataset.paso);




            //llamar la funcion de mostrar seccion
            mostrarSeccion();

            botonesPaginador();
        })
    })

}
async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const { servicios } = db;
        //generar el html
        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio;

            //DOM scripting 
            //Generar nombre de servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `S/. ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //generar div contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;
            //selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;

            //inyectar precio y nombre al div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //inyectarlo en el html
            document.querySelector('#servicios').appendChild(servicioDiv);
        })
    } catch (error) {
        console.log(error)
    }
}

function seleccionarServicio(e) {
    let elemento;
    //forzar que el elemento al cual le damos click sea el DIV
    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }
    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);

        // console.log(elemento.dataset.idServicio);

        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const servicioObj = {
                id: parseInt(elemento.dataset.idServicio),
                nombre: elemento.firstElementChild.textContent,
                precio: elemento.firstElementChild.nextElementSibling.textContent,
            }
            //console.log(servicioObj)
        agregarServicio(servicioObj);
    }

}

function eliminarServicio(id) {
    // console.log("elimando....", id)
    const { servicios } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);
    console.log(cita);
}

function agregarServicio(servicioObj) {
    const { servicios } = cita;

    cita.servicios = [...servicios, servicioObj];

    console.log(cita);
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;


        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;

        botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if (pagina === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); //estamos en la pagina 3 , carga el resumen con datos
    } else {
        paginaSiguiente.classList.remove('ocultar');
        paginaAnterior.classList.remove('ocultar');
    }
    mostrarSeccion(); //cambia la seccion que se muestra por la pagina

}

function mostrarResumen() {
    //destructuring
    const { nombre, apellido, celular, fecha, hora, servicios } = cita;

    //seleccionar resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //limpiar el html previo
    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    //validacion de objeto
    if (Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios.';

        noServicios.classList.add('invalidar-cita');

        //agregar a resumen DIV
        resumenDiv.appendChild(noServicios);
        return;
    }
    //mostrar resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';

    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const apellidoCita = document.createElement('P');
    apellidoCita.innerHTML = `<span>Apellido:</span> ${apellido}`;

    const celularCita = document.createElement('P');
    celularCita.innerHTML = `<span>Celular:</span> ${celular}`;

    const serviciosCita = document.createElement('Div');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;

    //iterar sobre el arreglo de Servicios
    servicios.forEach(servicio => {
            const { nombre, precio } = servicio;

            const contenedorServicio = document.createElement('DIV');
            contenedorServicio.classList.add('contenedor-servicio');

            const textoServicio = document.createElement('P');
            textoServicio.textContent = nombre;

            const precioServicio = document.createElement('P');
            precioServicio.textContent = precio;
            precioServicio.classList.add('precio');

            const totalServicio = precio.split('S/.');
            // console.log(parseInt(totalServicio[1].trim()));
            cantidad += parseInt(totalServicio[1].trim());

            //colocar texto y precio en el DIV
            contenedorServicio.appendChild(textoServicio);
            contenedorServicio.appendChild(precioServicio);

            serviciosCita.appendChild(contenedorServicio);

        })
        // console.log(cantidad);
    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(apellidoCita);
    resumenDiv.appendChild(celularCita);

    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a Pagar: </span>S/. ${cantidad}`;

    resumenDiv.appendChild(cantidadPagar);
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');
    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();
        // console.log(nombreTexto);

        //validacion de que nombreTexto debe tener algo
        if (nombreTexto === '') {
            mostrarAlerta('Coloque su nombre', 'error');
        } else if (nombreTexto.length < 3) {
            mostrarAlerta('Nombre no valido, Demasiado corto', 'error');
        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;


        }
    })

}

function apellidoCita() {
    const apellidoInput = document.querySelector('#apellido');
    apellidoInput.addEventListener('input', e => {
        const apellidoTexto = e.target.value.trim();
        // console.log(apellidoTexto);

        //validacion de que apellidoTexto debe tener algo
        if (apellidoTexto === '') {
            mostrarAlerta('Coloque su apellido', 'error');
        } else if (apellidoTexto.length < 3) {
            mostrarAlerta('Apellido no valido, Demasiado corto', 'error');
        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.apellido = apellidoTexto;


        }
    })

}

function celularCita() {
    const celularInput = document.querySelector('#celular');
    celularInput.addEventListener('input', e => {
        const celularTexto = e.target.value.trim();


        //validacion de que celularTexto debe tener algo
        if (celularTexto === '') {
            mostrarAlerta('Coloque un numero de celular, para contacto', 'error');
        } else if (celularTexto.length !== 9) {
            mostrarAlerta('Numero de celular no valido', 'error');
        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.celular = celularTexto;


        }
    })

}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        const dia = new Date(e.target.value).getUTCDay();

        if ([0, 6].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de semana no validos', 'error');
        } else {
            cita.fecha = fechaInput.value;

        }

    })

}

function mostrarAlerta(mensaje, tipo) {

    //si hay una alerta previa, entonces no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        return;
    }


    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error') {
        alerta.classList.add('error');

    }
    //insertar en el html
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //eliminar la alerta despues de 3segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function deshabilitarFecha() {
    const fechaInput = document.querySelector('#fecha');
    const fechaAhora = new Date();


    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate();

    let fechaDeshabilitar = '';

    if (mes < 10) {
        fechaDeshabilitar = `${year}-0${mes}`;
    } else {
        fechaDeshabilitar = `${year}-${mes}`;
    }

    if (dia < 10) {
        fechaDeshabilitar += `-0${dia}`;
    } else {
        fechaDeshabilitar += `-${dia}`;
    }

    fechaInput.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {


        const horaCita = e.target.value;
        const hora = horaCita.split(':');
        if (hora[0] < 10 || hora[0] > 18) {
            mostrarAlerta('Hora no valida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 3000);

        } else {
            cita.hora = horaCita;
            console.log(cita);
        }

    })
}