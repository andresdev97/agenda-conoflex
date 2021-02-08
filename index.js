var db = firebase.firestore();

// PROJECT
const $formulario = document.formularioPedidos;
const $buttonAgregarPedido = $formulario.button;

const $cajaPedidos = document.querySelector('#caja-pedidos');
const $cajaFacturados = document.querySelector('#caja-facturados');

const arrayPedidos = [];
const arrayFacturados = [];

mostrarPedidos();
mostrarFacturados();

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

        $formulario.reset();

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
            transporte: '',
            id: Math.floor(Math.random() * 999999)
        })
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });

        // llamo a la función para que renderice cada objeto del array como un div diferente
        mostrarPedidos();

    }

    e.preventDefault();

}

function mostrarPedidos() {

    $cajaPedidos.innerHTML = '';

    db.collection("pedidos").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

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
            $h3.textContent = `CLIENTE: ${doc.data().cliente}`;
            $h4.textContent = `FECHA: ${doc.data().fecha}`;
            $p.textContent = `N° ORDEN: ${doc.data().orden}`;
            $p2.textContent = `CANTIDAD ITEMS: ${doc.data().cantidad}`;
            $p3.innerHTML = `ARTÍCULOS: <br/>${doc.data().articulos}`;
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

            pasarAFacturados($buttonFacturado, db.collection('facturados'), doc.data().id, doc.id);
            eliminarPedido($buttonEliminar, doc.id);

            // meto el div dentro de la caja de pedidos
            $cajaPedidos.appendChild($divPedido);

            console.log(`${doc.id} => ${doc.data().cliente}`);
        });
    });

}

function pasarAFacturados(botonFacturado, facturados, docData, docId) {

    // al clickear 'facturado'
    botonFacturado.onclick = function () {

        db.collection("pedidos").where("id", "==", docData)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    facturados.add(doc.data());
                    mostrarPedidos();
                    mostrarFacturados();

                    db.collection("pedidos").doc(docId).delete().then(function () {
                        console.log("Document successfully deleted!");
                        mostrarPedidos();
                        mostrarFacturados();
                    }).catch(function (error) {
                        console.error("Error removing document: ", error);
                    });

                });
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });


        // agrego el objeto clickeado al array de facturados

        //console.log(docData);
        //facturados.push(pedidos.data().id);

        // y lo saco del array de pedidos
        //pedidos.splice(i, 1);

        //facturados[i].estado = 'facturado';

    }
}

function mostrarFacturados(facturados) {

    $cajaFacturados.innerHTML = '';

    db.collection("facturados").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

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

            $h3.textContent = `CLIENTE: ${doc.data().cliente}`;
            $h4.textContent = `FECHA: ${doc.data().fecha}`;
            $p.textContent = `N° ORDEN: ${doc.data().orden}`;
            $p2.textContent = `CANTIDAD ITEMS: ${doc.data().cantidad}`;
            $p3.innerHTML = `ARTÍCULOS: <br/>${doc.data().articulos}`;
            $p4.textContent = `PAGADO: ${doc.data().pagado ? 'SÍ' : 'NO'}`;
            $p4.setAttribute('id', `pagado${doc.data().id}`);
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

            pasarAPedidos($buttonSinFacturar, db.collection('pedidos'), doc.data().id, doc.id);
            eliminarFactura($buttonEliminar, doc.id);

            $buttonPagado.onclick = function () {

                var documentoSeleccionado = db.collection("facturados").doc(doc.id);

                // Set the "capital" field of the city 'DC'
                return documentoSeleccionado.update({
                    pagado: true
                })
                    .then(function () {
                        mostrarFacturados();
                        console.log("Document successfully updated!");
                    })
                    .catch(function (error) {
                        // The document probably doesn't exist.
                        console.error("Error updating document: ", error);
                    });

            }

            $buttonNoPagado.onclick = function () {
                var documentoSeleccionado = db.collection("facturados").doc(doc.id);

                // Set the "capital" field of the city 'DC'
                return documentoSeleccionado.update({
                    pagado: false
                })
                    .then(function () {
                        mostrarFacturados();
                        console.log("Document successfully updated!");
                    })
                    .catch(function (error) {
                        // The document probably doesn't exist.
                        console.error("Error updating document: ", error);
                    });
            }

            //agregarARuta($buttonRuta, $tablaRuta, facturados, i, arrayRuta);

            pasarARuta(facturados, doc.data().id, arrayRuta, $buttonRuta);


            $cajaFacturados.appendChild($divFacturado);

            console.log(`${doc.id} => ${doc.data().cliente}`);
        });
    });

}

function pasarAPedidos(botonSinFacturar, pedidos, docData, docId) {

    botonSinFacturar.onclick = function () {

        db.collection("facturados").where("id", "==", docData)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    pedidos.add(doc.data());
                    mostrarPedidos();
                    mostrarFacturados();

                    db.collection("facturados").doc(docId).delete().then(function () {
                        console.log("Document successfully deleted!");
                        mostrarPedidos();
                        mostrarFacturados();
                    }).catch(function (error) {
                        console.error("Error removing document: ", error);
                    });

                });
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

}

function eliminarPedido(botonEliminar, docId) {

    botonEliminar.onclick = function () {

        db.collection("pedidos").doc(docId).delete().then(function () {
            console.log("Document successfully deleted!");
            mostrarPedidos();
            mostrarFacturados();
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });
    }

}

function eliminarFactura(botonEliminar, docId) {

    botonEliminar.onclick = function () {

        db.collection("facturados").doc(docId).delete().then(function () {
            console.log("Document successfully deleted!");
            mostrarPedidos();
            mostrarFacturados();
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });
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

db.collection("fecha_ruta").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        $salidaCamion.textContent = `SIGUIENTE RUTA: ${doc.data().fechaRuta}`;
        console.log("Document successfully loaded!");
    })

});

$buttonFormRuta.onclick = function (e) {

    db.collection("fecha_ruta").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

            var documentoSeleccionado = db.collection("fecha_ruta").doc(doc.id);

            // Set the "capital" field of the city 'DC'
            return documentoSeleccionado.update({
                fechaRuta: $fechaRuta.value
            })
                .then(function () {
                    $salidaCamion.textContent = `SIGUIENTE RUTA: ${doc.data().fechaRuta}`;
                    db.collection("fecha_ruta").get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            $salidaCamion.textContent = `SIGUIENTE RUTA: ${doc.data().fechaRuta}`;
                            console.log("Document successfully loaded!");
                        })
                    
                    });
                    console.log("Document successfully updated!");
                })
                .catch(function (error) {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });

        });

    },
        e.preventDefault()
    );
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











