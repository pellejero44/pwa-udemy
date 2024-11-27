// Entrenamiento PouchDB

// 1- Crear la base de datos
// Nombre:  mensajes
var db = new PouchDB("mensajes");

// Objeto a grabar en base de datos
let mensaje = {
  _id: new Date().toISOString(),
  user: "spiderman",
  mensaje: "Mi tía hizo unos panqueques muy buenos",
  sincronizado: false,
};

// 2- Insertar en la base de datos
db.put(mensaje);

// 3- Leer todos los mensajes offline
// mostrar en la consola
db.allDocs({
  include_docs: true,
  descending: true,
}).then((result) => {
  console.log(result.rows);
});

// 4- Cambiar el valor 'sincronizado' de todos los objetos
//  en la BD a TRUE
db.allDocs({
  include_docs: true,
  descending: true,
}).then((result) => {
  result.rows.forEach((mensaje) => {
    db.put({
      ...mensaje.doc,
      sincronizado: true,
    });
  });
});

// 5- Borrar todos los registros, uno por uno, evaluando
// cuales estan sincronizados
// deberá de comentar todo el código que actualiza
// el campo de la sincronización

db.allDocs({
  include_docs: true,
  descending: true,
}).then((result) => {
  result.rows.forEach((mensaje) => {
    if (mensaje.doc.sincronizado) {
      db.remove(mensaje.doc);
    }
  });
});
