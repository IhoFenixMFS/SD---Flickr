var api_key = localStorage.getItem('api_key');
var user_id = localStorage.getItem('user_id');

var constantes = {
	api_key: api_key,
	user_id: user_id
}

$(document).ready(function() {
	
	//Se muetran las fotos de todos los contactos al inicio
	obtenerFotos(0);
	
	$('#btntodo').click(function(){
		//getAllObtenerFotos(0);
		obtenerFotos(0);
		$('#mostrando-by').text("todos");
	});
	
	$('#btnamigos').click(function(){
		//getAllObtenerFotos(1);
		obtenerFotos(1);
		$('#mostrando-by').text("todos");
	});
	
	$(document).on('click', '#popup-image', function() {
		   $('#imagepreview').attr('src', $('#image-src').attr('src'));
		   $('#imagemodal').modal('show');
		});
	

})

function obtenerFotos(filtrar) {
	//si filtrar es true (0) se muestran todas las fotos,
	//si es false (1), se muestran las de familiares y amigos.
	
	$("#imagenes").empty();
	//Primero, limpiamos el tablón, para mostrar las nuevas
	
	var url = "https://api.flickr.com/services/rest/?method=flickr.photos.getContactsPublicPhotos";
	var data = {
		api_key: constantes.api_key,
		user_id: constantes.user_id,
		just_friends: filtrar,
		count: 8,
		format: "json",
		nojsoncallback: 1
	};

	$.ajax({
		url : url,
		type: "GET",
		data: data,
		responseType:'application/json',
		dataType : "json",
		success : function(photos) {
			mostrarFotos(photos);
			contadorImg = photos.photos.total;
		}
	});
}

function mostrarFotos(data) {
	var longFotos = data.photos.photo.length;
	var photos = data.photos.photo;

	for(var i = 0; i < longFotos; i++) {
		obtenerInfoUser(photos[i], i);
	}
}

function obtenerInfoUser (photo, posicionImagen) {
	var url = "https://api.flickr.com/services/rest/?method=flickr.people.getInfo";
	var data = {
		api_key: constantes.api_key,
		user_id: photo.owner,
		format: "json",
		nojsoncallback: 1
	};
			
	$.ajax({
		url : url,
		type: "GET",
		data: data,
		responseType:'application/json',
		dataType : "json",
		success : function(data) {
			var idFoto = photo.id;
			var person = data.person;
			obtenerInfoFotos(idFoto, person, posicionImagen);
		}
	});
}

function obtenerInfoFotos(idFoto, person, posicionImagen) {
	var url = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo";
	var data = {
		api_key: constantes.api_key,
		photo_id: idFoto,
		format: "json",
		nojsoncallback: 1
	};
	var imagenesHTML = "";
	//Se inicializa como String vacío para, posteriormente poder concatenar en cada iteración el texto HTML que el navegador interpretará y "dibujará" con las imágenes. 
	
	$.ajax({
		url : url,
		type: "GET",
		data: data,
		responseType:'application/json',
		dataType : "json",
		success : function(data) {
			
			//en la variable "foto" almacenamos los datos del objeto "photo" para después poder usar los atributos del mismo que necesitemos
			var photo = data.photo;
			var fSubida = formatDate(new Date(parseInt(photo.dateuploaded)*1000));
			//Incluimos el HTML para mostrar las imágenes
			//se ha tabulado para facilitar su lectura, ya que es muy lioso hacerlo en una sola línea.
			imagenesHTML = imagenesHTML +
			"<div class='col-6'>" +
				"<div class='card card-timeline'>" +
					"<div class='row no-gutters'>" +
					
						"<div class='col-md-4'>" +
						"<a id='imagen-popup" + posicionImagen + "' href='#'>" +
								"<img id='image-src-" + posicionImagen + "' src='http://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg' alt=''>" +
							"</a>" +
						"</div><p></p>" + 
						
						"<div class='col-md-12'>" +
							"<div class='card-body'>" + 
								"<p class='card-text'>" +
									"<nombre class='nombre'> Subida por: " + person.realname._content+ "(" + photo.owner.username + ")</nombre><br>" +
									"<span class='badge badge-light'>" + fSubida + "</span>" +
								"</p>" +
								"<h5 class='card-text'>" + photo.title._content + "</h5>" +  
								"<h5 class='card-text' >" + photo.description._content + "</h5>" + 
						"</div>" +
						
					"</div>" +
				"</div>" +
			"</div><hr /></br></br>";
			
			$('#imagenes').append(imagenesHTML);
			
			//Gestión de maximizado de imagenes
			var idImagen = '#image-src-' + posicionImagen;
			var idPopup = '#imagen-popup' + posicionImagen;
			$(document).on('click', idPopup, function() {
			   $('#imagepreview').attr('src', $(idImagen).attr('src'));
			   $('#imagemodal').modal('show');
			});
			
		}
	});
}

//Formato de la fecha
function formatDate(date) {
	var monthNames = [
	"Enero", "Febrero", "Marzo",
	"Abril", "Mayo", "Junio", "Julio",
	"Agosto", "Septiembre", "Octubre",
	"Noviembre", "Diciembre"
	];
	
	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();
	return day + ' ' + monthNames[monthIndex] + ' ' + year;
}


