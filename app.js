var inscripciones = angular.module('Inscripciones', ['datatables', 'ngResource']);

inscripciones.directive('documentoExistenteValidator', ['$http', '$q', function($http, $q) {
  return {
    require : 'ngModel',
    link : function($scope, element, attrs, ngModel) {
      ngModel.$asyncValidators.documentoExistente = function(documento) {
        if(!$scope.onePage.modificar) {
            return $http.get('php/checkDni?dni='+ documento).
                then(function resolved() {                    
                    $scope.onePage.errors = 'El documento ya existe';
                    //username exists, this means validation fails
                    return $q.reject('exists');
                }, function rejected() {
                    $scope.onePage.errors = '';
                    //username does not exist, therefore this validation passes
                    return true;
            });
        } else {
          return $q.resolve();
        }
      };
    }
  }
}])


inscripciones.controller('onePageController', function ($scope, $http, DTOptionsBuilder, DTColumnBuilder) {
    var controller = this;
    controller.table;
    controller.persons = [];
    controller.totalInscriptos = 0;
    controller.totalAcreditados = 0;

    controller.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('full_numbers')
        .withDisplayLength(10)
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
    };
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

    controller.guardar = function (nueva, acreditar) {
        controller.persona.acreditado = acreditar ? acreditar : 'No';
        var url = nueva ? 'php/agregar.php' : 'php/actualizar.php';
        $http.post(
            url,
            controller.persona
        ).then(function(result) {
           refrescarDatos();
           controller.cancelar();
        });
    }

    procesarDatos = function (datos) {
        controller.persons = datos;
        calcularResultados();
    }

    refrescarDatos = function () {
        $http.get("php/obtenerDatos.php").then(function(result){
            procesarDatos(result.data);
        });
    };

    refrescarDatos();

    calcularResultados = function () {
        controller.totalInscriptos = controller.persons.length;
        controller.totalAcreditados = _.filter(controller.persons, function(persona) {
            return persona.Acreditado === "Si";
        }).length;
    };

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
    		}else {
                controller.modificar = false;
                $('tr.selected').removeClass('selected');
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

    controller.buscarDoc = function () {
  		  var result = _.find(controller.persons, function (persona) {
            return persona.Documento === controller.persona.docResponsable;
  		  });
  		  if (result) {
            controller.persona.responsable =  result.LastName+ ', ' + result.FirstName;
            controller.mostrarResponsable = true;
  		  }else {
            controller.persona.responsable = 'La persona tiene que estar cargada';
            controller.mostrarResponsable = false;
  		  }
    };

  	controller.seleccionoPersona = function (infoRow, nRow) {  		
  		  if ( $(nRow).hasClass('selected') ) {
            $(nRow).removeClass('selected');
            controller.persona = controller.limpiarDatos();
        } else {
            $('tr.selected').removeClass('selected');
            $(nRow).addClass('selected');
            controller.persona = controller.limpiarDatos(infoRow);
            if (controller.persona.isKid) {
                controller.buscarDoc();
            }
        }
        controller.modificarPersona();
  	}

  	controller.personaIsSelected = function () {
  		  return controller.persona.documento !== '' && controller.modificar;
  	}

  	controller.modificarPersona = function () {
  		  controller.modificar = true;
  	}

  	controller.crearNuevaPersona = function () {  		  
  		  controller.persona = controller.limpiarDatos();
  	}

    controller.pulseraEspecial = function () {
      return controller.persona.salutacion === "Pastor" 
          || controller.persona.salutacion === "Pastora"
          || controller.persona.salutacion === "Especial";
    }

    controller.errors = '';
    controller.isValid = function () { 
        if (controller.persona.isKid 
            && controller.persona.responsable === 'La persona tiene que estar cargada') {
            controller.errors = "El responsable tiene que estar cargado";
            return false;
        }
        if (controller.persona.isKid 
            && controller.persona.docResponsable === '') {
            controller.errors = "";
            return false;
        }
        if (controller.persona.isKid 
            && controller.persona.telefono === '') {
            controller.errors = controller.agregarForm.phone.$touched ? "Debe brindar un telefono" : "";
            return false;
        }
        if(!controller.agregarForm.documento.$valid && controller.persona.documento != '') {
            controller.errors = "El documento ya existe";
            return false;      
        }
        if(!controller.agregarForm.documento.$valid && controller.persona.documento === '') {
            controller.errors = '';
            return false;
        }
        controller.errors = '';
        return true;
    }
    controller.mostrarErrores = function () {
        return controller.errors != '';
    } 
    controller.cancelar = function () {
        controller.limpiarDatos();
        controller.modificar
    } 
});