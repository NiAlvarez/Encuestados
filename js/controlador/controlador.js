/*
 * Controlador
 */
var Controlador = function(modelo){
  this.modelo = modelo;
};

Controlador.prototype = {
  agregarPregunta: function(pregunta, respuestas){
    this.modelo.agregarPregunta(pregunta, respuestas);
  },

  obtenerPregunta: function(id){
    return this.modelo.obtenerPregunta(id);
  },

  borrarPregunta: function(id){
    this.modelo.borrarPregunta(id);
  },

  borrarTodo: function(){
    this.modelo.borrarTodo();
  },

  editarPregunta: function(id, pregunta, respuestas){
    this.modelo.editarPregunta(id, pregunta, respuestas);
  },

  agregarVotos: function(nombrePregunta, respuestaSeleccionada){
    this.modelo.agregarVotos(nombrePregunta, respuestaSeleccionada);
  }
};
