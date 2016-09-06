var inscripciones = angular.module('Inscripciones', ['datatables', 'ngResource']);

inscripciones.controller('onePageController', function ($resource, DTOptionsBuilder, DTColumnBuilder) {
  	var controller = this;
	controller.table;
	controller.persons = [];

	controller.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(2);
    controller.dtColumns = [
        DTColumnBuilder.newColumn('Documento'),
        DTColumnBuilder.newColumn('Sal'),
        DTColumnBuilder.newColumn('Apellido'),
        DTColumnBuilder.newColumn('Nombre')
    ];

    $resource('datos.json').query().$promise.then(function(persons) {
        controller.persons = persons;
    });

	controller.limpiarDatos = function () {
		return {
			salutacion: '',
			documento: '',
			nombre: '',
			apellido: '',
			lugar: '',
			telefono: '',
			docResponsable: '',
			responsable: '',
			acreditado: 'No'
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
			controller.persona.responsable = result[2] + ', ' + result[3];
		}
		else {
			controller.persona.responsable = 'La persona tiene que estar cargada';
		}
	}

	angular.element(document).ready(function() {
		var personaSelected = [];
		table = $('#example').DataTable({
			data: Datos,
			columns: [
	            { title: "Documento" },
	            { title: "Salutacion" },
	            { title: "Apellido" },
	            { title: "Nombre" },
	            { title: "Lugar" },
	            { title: "Telefono" },
	            { title: "Documento Responsable" },
	            { title: "Acreditado" }
	        ],
			"language": {
			    "lengthMenu": "Mostrar _MENU_ personas por pagina",
			    "zeroRecords": "Sin resultados",
			    "info": "Mostrar paginas _PAGE_ de _PAGES_",
			    "infoEmpty": "No hay registros",
			    "infoFiltered": "(busqueda de _MAX_ total de personas)"
			}
		});
		$('#example tbody').on( 'click', 'tr', function () {
	        if ( $(this).hasClass('selected') ) {
	            $(this).removeClass('selected');
	            personaSelected = [];
	        }
	        else {
	            table.$('tr.selected').removeClass('selected');
	            $(this).addClass('selected');
	            personaSelected = table.row( this ).data();
	        }
	    });
	    $('#agregar').on( 'click', function () {
	    	if (personaSelected != []) {
	    		table.row('.selected').remove().draw( false );
	    	}	
	        var phone = $('#phone').val() ? $('#phone').val() : "";
	        var docRes = $('#docResponsable').val() ? $('#docResponsable').val() : "";
	        table.row.add( [	            
	            $('#documento').val(),
	            $('#salut').val(),	            
	            $('#lastName').val(),
	            $('#firstName').val(),
	            $('#place').val(),	            
	            phone,
	            docRes,
	            "Si"
	        ]).draw( false );
	        $('#cancelar').click();
	        $('#documento').val('');
            $('#salut').val('');	            
            $('#lastName').val('');
            $('#firstName').val('');
            $('#place').val('');
            if($('#phone').val()) $('#phone').val('');
            if($('#docResponsable').val()) $('#phone').val('');
            var count = 0;
            table.columns(7).every( function () {
			    _.each(this.data(), function(e) {			    	
			     	if (e === "Si") {
			    		count++;
			    		console.log(e);
			     	}
			    });
			});
            $("#acreditadosTotal").text(count);
	    });
	    $('#acreditar').on('click', function () {
	    	$('#documento').val(personaSelected[0]);
            $('#salut').val(personaSelected[1]);	            
            $('#lastName').val(personaSelected[2]);
            $('#firstName').val(personaSelected[3]);
            $('#place').val(personaSelected[4]);
            $('#abrirAgregar').click();
	    });
  	});
  	controller.isRowSelected = function () {
  		return controller.rowSelected;
  	}
});