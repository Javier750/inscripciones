var inscripciones = angular.module('Inscripciones', ['datatables', 'ngResource']);

inscripciones.controller('onePageController', function ($scope, $http, DTOptionsBuilder, DTColumnBuilder) {
  	var controller = this;
	controller.table;
	controller.persons = [];

	controller.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(10)
		.withLanguage({
            "sEmptyTable":     "Sin datos",
            "sInfo":           "Mostrar _START_ hasta _END_ de _TOTAL_ personas",
            "sInfoEmpty":      "Mostrar 0 hasta 0 de 0 personas",
            "sInfoFiltered":   "(filtrado de _MAX_ personas totales)",
            "sInfoPostFix":    "",
            "sInfoThousands":  ".",
            "sLengthMenu":     "Ver _MENU_ personas",
            "sLoadingRecords": "Cargando...",
            "sProcessing":     "Procesando...",
            "sSearch":         "Buscar:",
            "sZeroRecords":    "No hubo coincidencias",
            "oPaginate": {
                "sFirst":    "Primera",
                "sLast":     "Ultima",
                "sNext":     "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending":  ": activar para ordenar ascendentemente",
                "sSortDescending": ": activar para ordenar descedentemente"
            }
        })
        .withOption('fnRowCallback', rowCallback);

  function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
    // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
    $('td', nRow).unbind('click');
    $('td', nRow).bind('click', function() {
        $scope.$apply(function() {
            controller.seleccionoPersona(aData, nRow);
        });
    });        
    return nRow;
  }
    controller.dtColumns = [
        DTColumnBuilder.newColumn('Documento'),
        DTColumnBuilder.newColumn('Sal'),
        DTColumnBuilder.newColumn('Apellido'),
        DTColumnBuilder.newColumn('Nombre'),
        DTColumnBuilder.newColumn('Lugar'),
        DTColumnBuilder.newColumn('Telefono'),
        DTColumnBuilder.newColumn('DooResponsable'),
        DTColumnBuilder.newColumn('Acreditado')
    ];

  $http.get("php/obtenerDatos.php").then(function(result){
    controller.persons = result.data;
    console.log(controller.persons)
  });

	controller.limpiarDatos = function (persona) {
		var isChico = persona && persona[6] ? true : false;
		if (persona){
			return {
				salutacion: persona[1],
				documento: persona[0],
				nombre: persona[3],
				apellido: persona[2],
				lugar: persona[4],
				telefono: persona[5],
				docResponsable: persona[6],
				responsable: '',
				acreditado: persona[7],
				isKid: isChico
			}
		}
		else {
			return {
				salutacion: 'Sr',
				documento: '',
				nombre: '',
				apellido: '',
				lugar: '',
				telefono: '',
				docResponsable: '',
				responsable: '',
				acreditado: 'No',
				isKid: isChico
			}
		}
	};
	controller.persona = controller.limpiarDatos();
	controller.persona.responsable = 'La persona tiene que estar cargada';

	controller.validate = function () {
		
	};

	controller.buscarDoc = function () {

		var result = _.find(Datos, function (persona) {
			return persona[0] === controller.persona.docResponsable;
		});
		if (result) {
			controller.persona.responsable =  result[2] + ', ' + result[3];
		}
		else {
			controller.persona.responsable = 'La persona tiene que estar cargada';
		}
	};

  	controller.seleccionoPersona = function (infoRow, nRow) {  		
  		if ( $(nRow).hasClass('selected') ) {
            $(nRow).removeClass('selected');
            controller.persona = controller.limpiarDatos();
        }
        else {
            $('tr.selected').removeClass('selected');
            $(nRow).addClass('selected');
            controller.persona = controller.limpiarDatos(infoRow);
  			controller.buscarDoc();
        }
  	}

  	controller.personaIsSelected = function () {
  		return controller.persona.documento !== '';
  	}

  	controller.modificarPersona = function () {
  		controller.modificar = true;
  	}

  	controller.crearNuevaPersona = function () {
  		controller.modificar = false;
  		$('tr.selected').removeClass('selected');
  		controller.persona = controller.limpiarDatos();
  	}
});