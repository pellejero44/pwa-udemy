// Routes.js - Módulo de rutas
var express = require("express");
var router = express.Router();

const mensajes = [
  {
    _id: "XXX",
    user: "spiderman",
    mensaje: "Hola Mundo",
  },
];

// Get mensajes
router.get("/", function (req, res) {
  res.json(mensajes);
});

// POST mensajes
router.post("/", function (req, res) {
  const mensaje = {
    user: req.body.user,
    mensaje: req.body.mensaje,
  };

  mensajes.push(mensaje);

  res.json({
    ok: true,
    mensaje,
  });
});

module.exports = router;
