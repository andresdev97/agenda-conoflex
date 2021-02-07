var db = firebase.firestore();

// PROJECT
const $formulario = document.formularioPedidos;
const $buttonAgregarPedido = $formulario.button;

const $cajaPedidos = document.querySelector('#caja-pedidos');
const $cajaFacturados = document.querySelector('#caja-facturados');

const arrayPedidos = [];
const arrayFacturados = [];

$buttonAgregarPedido.onclick = function (e) {

    $cajaPedidos.innerHTML = '';

    // capturo los datos necesarios del form
    const $cliente = $formulario.cliente.value;
    const $fecha = $formulario.fecha.value;
    const $orden = $formulario.orden.value;
    const $cantidad = Number($formulario.cantidad.value);
    let $articulos = document.querySelector('#textarea-articulos').value;
    // respetamos los saltos de línea del textarea
    $articulos = $articulos.replace(/\r?\n/g, "<br>");

    // validación
    if ($cliente === '' || $fecha === '' || $cantidad === '' || $articulos === '') {
        alert('TENÉS QUE INGRESAR TODOS LOS DATOS CON (*)');
    } else {
        // creo el objeto y le asigno los datos
        let pedido = {
            cliente: $cliente,
            fecha: $fecha,
            orden: $orden,
            cantidad: $cantidad,
            estado: 'sinFacturar',
            articulos: $articulos,
            pagado: false,
            ruta: false,
            transporte: ''
        }

        // agrego el objeto al array
        arrayPedidos.push(pedido);

        // firebase code
        db.collection("pedidos").add({
            cliente: $cliente,
            fecha: $fecha,
            orden: $orden,
            cantidad: $cantidad,
            estado: 'sinFacturar',
            articulos: $articulos,
            pagado: false,
            ruta: false,
            transporte: ''
        })
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });




        // llamo a la función para que renderice cada objeto del array como un div diferente
        mostrarPedidos(arrayPedidos);

        console.log(arrayPedidos);

    }

    e.preventDefault();

}

function mostrarPedidos(pedidos) {

    $cajaPedidos.innerHTML = '';

    for (let i = 0; i < pedidos.length; i++) {

        // por cada vuelta del for creo los elementos necesarios por cada pedido
        const $divPedido = document.createElement('div');
        const $h3 = document.createElement('h3');
        const $h4 = document.createElement('h4');
        const $p = document.createElement('p');
        const $p2 = document.createElement('p');
        const $p3 = document.createElement('p');
        const $buttonFacturado = document.createElement('button');
        const $buttonEliminar = document.createElement('button');

        // saco los datos del objeto actual del array y se lo asigno a los elementos creados
        $h3.textContent = `CLIENTE: ${pedidos[i].cliente}`;
        $h4.textContent = `FECHA: ${pedidos[i].fecha}`;
        $p.textContent = `N° ORDEN: ${pedidos[i].orden}`;
        $p2.textContent = `CANTIDAD ITEMS: ${pedidos[i].cantidad}`;
        $p3.innerHTML = `ARTÍCULOS: <br/>${pedidos[i].articulos}`;
        //$p3.textContent = `ARTÍCULOS: ${pedidos[i].articulos}`;

        $buttonFacturado.textContent = 'FACTURADO';
        $buttonEliminar.textContent = 'ELIMINAR';

        // meto todo dentro del div
        $divPedido.appendChild($h3);
        $divPedido.appendChild($h4);
        $divPedido.appendChild($p);
        $divPedido.appendChild($p2);
        $divPedido.appendChild($p3);
        $divPedido.appendChild($buttonFacturado);
        $divPedido.appendChild($buttonEliminar);

        $divPedido.style = 'color: red';

        db.collection("pedidos").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

                

                console.log(`${doc.id} => ${doc.data().cliente}`);
            });
        });

        pasarAFacturados($buttonFacturado, arrayFacturados, pedidos, i);
        eliminarPedido($buttonEliminar, pedidos, i);

        // meto el div dentro de la caja de pedidos
        $cajaPedidos.appendChild($divPedido);

    }

}

function pasarAFacturados(botonFacturado, facturados, pedidos, i) {

    // al clickear 'facturado'
    botonFacturado.onclick = function () {

        // agrego el objeto clickeado al array de facturados
        facturados.push(pedidos[i]);

        // y lo saco del array de pedidos
        pedidos.splice(i, 1);

        //facturados[i].estado = 'facturado';

        mostrarPedidos(pedidos);
        mostrarFacturados(facturados);

        console.log(facturados);
        console.log(pedidos);

    }
}

function mostrarFacturados(facturados) {

    $cajaFacturados.innerHTML = '';

    for (let i = 0; i < facturados.length; i++) {

        const $divFacturado = document.createElement('div');
        const $h3 = document.createElement('h3');
        const $h4 = document.createElement('h4');
        const $p = document.createElement('p');
        const $p2 = document.createElement('p');
        const $p3 = document.createElement('p');
        const $buttonSinFacturar = document.createElement('button');
        const $buttonEliminar = document.createElement('button');
        const $buttonPagado = document.createElement('button');
        const $buttonNoPagado = document.createElement('button');
        const $buttonRuta = document.createElement('button');
        const $p4 = document.createElement('p');

        $h3.textContent = `CLIENTE: ${facturados[i].cliente}`;
        $h4.textContent = `FECHA: ${facturados[i].fecha}`;
        $p.textContent = `N° ORDEN: ${facturados[i].orden}`;
        $p2.textContent = `CANTIDAD ITEMS: ${facturados[i].cantidad}`;
        $p3.innerHTML = `ARTÍCULOS: <br/>${facturados[i].articulos}`;
        $p4.textContent = `PAGADO: ${facturados[i].pagado ? 'SÍ' : 'NO'}`;
        $p4.setAttribute('id', `pagado${i}`);
        $buttonSinFacturar.textContent = 'NO FACTURADO';
        $buttonEliminar.textContent = 'ELIMINAR';
        $buttonPagado.textContent = 'PAGADO';
        $buttonNoPagado.textContent = 'NO PAGADO';
        $buttonRuta.textContent = 'A LA RUTA'

        $divFacturado.appendChild($h3);
        $divFacturado.appendChild($h4);
        $divFacturado.appendChild($p);
        $divFacturado.appendChild($p2);
        $divFacturado.appendChild($p3);
        $divFacturado.appendChild($p4);
        $divFacturado.appendChild($buttonSinFacturar);
        $divFacturado.appendChild($buttonEliminar);
        $divFacturado.appendChild($buttonPagado);
        $divFacturado.appendChild($buttonNoPagado);
        $divFacturado.appendChild($buttonRuta);

        $divFacturado.style = 'color: green';

        pasarAPedidos($buttonSinFacturar, facturados, arrayPedidos, i);
        eliminarFactura($buttonEliminar, facturados, i);

        $buttonPagado.onclick = function () {
            facturados[i].pagado = true;

            mostrarFacturados(facturados);
        }

        $buttonNoPagado.onclick = function () {
            facturados[i].pagado = false;

            mostrarFacturados(facturados);
        }

        //agregarARuta($buttonRuta, $tablaRuta, facturados, i, arrayRuta);

        pasarARuta(facturados, i, arrayRuta, $buttonRuta);


        $cajaFacturados.appendChild($divFacturado);

    }

}

function pasarAPedidos(botonSinFacturar, facturados, pedidos, i) {

    botonSinFacturar.onclick = function () {

        pedidos.push(facturados[i]);
        facturados.splice(i, 1);

        //pedidos[i].estado = 'sinFacturar';

        mostrarFacturados(facturados);
        mostrarPedidos(pedidos);

        console.log(facturados);
        console.log(pedidos);
    }

}

function eliminarPedido(botonEliminar, pedidos, i) {

    botonEliminar.onclick = function () {

        pedidos.splice(i, 1);
        mostrarPedidos(pedidos);

        console.log(pedidos);
    }

}

function eliminarFactura(botonEliminar, facturados, i) {

    botonEliminar.onclick = function () {

        facturados.splice(i, 1);
        mostrarFacturados(facturados);

        console.log(facturados);
    }

}

// RUTA

const $formRuta = document.querySelector('#form-ruta');
const $buttonFormRuta = $formRuta.buttonRuta;
const $fechaRuta = $formRuta.fechaRuta;

const $salidaCamion = document.querySelector('#salida-camion');
const $divRuta = document.querySelector('#div-ruta');
const $tablaRuta = document.querySelector('#tbody-ruta');

const arrayRuta = [];

$buttonFormRuta.onclick = function (e) {

    $salidaCamion.textContent = `SIGUIENTE RUTA: ${$fechaRuta.value}`;

    e.preventDefault();

}

function pasarARuta(facturados, i, arrayRuta, $buttonRuta) {

    $buttonRuta.onclick = function () {

        if (facturados[i].ruta === false) {

            if (facturados[i].pagado !== true) {
                alert('El cliente todavía no pagó');
            }

            const $transporte = prompt('Ingresá el transporte');

            facturados[i].transporte = $transporte;

            $divRuta.innerHTML = '';

            facturados[i].ruta = true;

            arrayRuta.push(facturados[i]);

            mostrarRuta($tablaRuta, arrayRuta, facturados);

            console.log(arrayRuta);

        } else {
            alert('El pedido ya está en ruta');
        }

    }

}

function mostrarRuta($tablaRuta, arrayRuta, facturados) {

    $tablaRuta.innerHTML = '';

    for (let i = 0; i < arrayRuta.length; i++) {

        const $nuevaFila = document.createElement('tr');
        $nuevaFila.setAttribute('id', 'tr-ruta');
        const $tdCliente = document.createElement('td');
        $tdCliente.className = 'td-ruta';
        const $tdFecha = document.createElement('td');
        $tdFecha.className = 'td-ruta';
        const $tdTransporte = document.createElement('td');
        $tdTransporte.className = 'td-ruta';
        const $buttonEliminar = document.createElement('button');
        $buttonEliminar.className = 'td-ruta';

        const nombreCliente = arrayRuta[i].cliente;
        const fecha = arrayRuta[i].fecha;
        const transporte = arrayRuta[i].transporte;

        $tdCliente.textContent = nombreCliente;
        $tdFecha.textContent = fecha;
        $tdTransporte.textContent = transporte;
        $buttonEliminar.textContent = 'ELIMINAR';

        $nuevaFila.appendChild($tdCliente);
        $nuevaFila.appendChild($tdFecha);
        $nuevaFila.appendChild($tdTransporte);
        $nuevaFila.appendChild($buttonEliminar);

        $tablaRuta.appendChild($nuevaFila);

        eliminarDeRuta($buttonEliminar, arrayRuta, i, facturados);

        console.log('entrando a ruta')

    }

}

function eliminarDeRuta(botonEliminar, ruta, i, facturados) {

    botonEliminar.onclick = function () {

        facturados[i].ruta = false;
        ruta[i].ruta = false;

        ruta.splice(i, 1);

        mostrarRuta($tablaRuta, ruta);

    }

}
