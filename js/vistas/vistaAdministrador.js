/*
 * Vista administrador
 */
var VistaAdministrador = function(modelo, controlador, elementos){
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  // Suscripción de observadores //
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });

  this.modelo.preguntaBorrada.suscribir(function(){
    contexto.reconstruirLista();
  });

  this.modelo.todoBorrado.suscribir(function(){
    contexto.reconstruirLista();
  });

  this.modelo.preguntaEditada.suscribir(function(){
    contexto.reconstruirLista();
  });
};


VistaAdministrador.prototype = {
  // Lista //
  inicializar: function(){
    this.reconstruirLista();
    this.configuracionDeBotones();
    validacionDeFormulario();
  },

  construirElementoPregunta: function(pregunta){
    var contexto = this;
    var nuevoItem = $('<li/>', {        // Se crea un elemento <li> por cada pregunta generada. //
      id: pregunta.id,
      class: 'list-group-item',
      text: pregunta.textoPregunta
    })

    var interiorItem = $('.d-flex');
    var titulo = interiorItem.find('h5');
    titulo.text(pregunta.textoPregunta);
    interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function(resp){
      return " " + resp.textoRespuesta;
    }));
    nuevoItem.html($('.d-flex').html());
    return nuevoItem;
  },

  reconstruirLista: function(){
    var lista = this.elementos.lista;
    lista.html('');
    var preguntas = this.modelo.preguntas;
    for (var i=0;i<preguntas.length;++i){
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },

  configuracionDeBotones: function(){
    var e = this.elementos;
    var contexto = this;

    // Asociación de eventos a botones //
    e.botonAgregarPregunta.click(function(){
      var id = parseInt(e.id.val());
      var value = e.pregunta.val();
      var respuestas = [];

      $('[name="option[]"]').each(function(){
        var respuesta = $(this).val();
        if(respuesta.length > 0){
          respuestas.push({
            textoRespuesta: respuesta,
            cantidad: 0
          });
        }
      })
      contexto.limpiarFormulario();

      if (id) {
        contexto.controlador.editarPregunta(id, value, respuestas);
      } else {
        contexto.controlador.agregarPregunta(value, respuestas);
      }

      e.botonAgregarPregunta.html('Crear pregunta');
    });

    e.botonBorrarPregunta.click(function(){
      var id = parseInt($('.list-group-item.active').attr('id'));
      contexto.controlador.borrarPregunta(id);
    });

    e.borrarTodo.click(function(){
      contexto.controlador.borrarTodo();
    });

    e.botonEditarPregunta.click(function(){
      var id = parseInt($('.list-group-item.active').attr('id'));
      var pregunta = contexto.controlador.obtenerPregunta(id);
      console.log(pregunta);

      if (pregunta) {
        contexto.limpiarFormulario();
        contexto.elementos.id.val(id);
        contexto.elementos.pregunta.val(pregunta.textoPregunta);
        for (var i = 0; i < pregunta.cantidadPorRespuesta.length - 1; i++) {
          contexto.agregarRespuesta();
        }
        $('[name="option[]"]').each(function (index, value) {
          if ($(value).parent().attr('id') !== 'optionTemplate') {
            $(value).val(pregunta.cantidadPorRespuesta[index].textoRespuesta);
          }
        });

        contexto.elementos.botonAgregarPregunta.html('Guardar pregunta');
      }
    });
  },

  agregarRespuesta: function () {
    var $template = $('#optionTemplate');
    var $clone = $template.clone().removeClass('hide').addClass('has-success').attr('id', "").insertBefore($template);
    var $option = $clone.find('[name="option[]"]');
    $('#localStorageForm').formValidation('addField', $option);
  },

  limpiarFormulario: function(){
    this.elementos.id.val('');
    $('.form-group.answer.has-feedback.has-success').remove();
  },
};
