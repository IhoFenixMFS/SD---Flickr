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
	//$("#imagenes").empty();
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
							"<a id='imagen" + posicionImagen + "' href='#'>" +
								"<img id='image-src-" + posicionImagen + "' src='http://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg' alt=''>" +
							"</a>" +
						"</div>" + 
						"<div class='col-md-8'><div class='card-body'>" + 
							"<h5 class='card-title'>" + photo.title._content + "</h5>" +  
							"<p class='card-text'>" + photo.description._content + "</p>" + 
							"<p class='card-text'>" +
								"<small class='text-muted'>" + person.realname._content + " (" + photo.owner.username + ")</small><br>" +
								"<span class='badge badge-light'>" + fSubida + "</span>" +
							"</p>" +
							"<a href='timeline.html?id_usuario=" + person.id + "' class='badge badge-primary'>Ver perfil</a>" +
						"</div>" +
					"</div>" +
				"</div>" +
			"</div>";
			
			//$("#imagenes").empty();//¿?¿?¿?¿?¿?¿?¿? -------------------------------------------------
			$('#imagenes').append(imagenesHTML);
			
			//Hacemos popeable cada imgen -> generamos la miniatura y su pop-up para mostrarla en un emergente
	/*
			// Miniatura
			$("#imagenes").append($("<a></a>").attr("id", "imageLink_" + i));
			$("#imageLink_" + i).attr("data-toggle", "modal");
			$("#imageLink_" + i).attr("data-target", "#popup_" + i);

			$("#imageLink_" + i).append($("<img/>").attr("id", "image_" + i));
			$("#image_" + i).attr("src", urlSmall);
			$("#image_" + i).attr("class", "img-thumbnail image");

			// Popup
			$("#imagenes").append($("<div></div>").attr("id", "popup_" + i));
			$("#popup_" + i).attr("class", "modal fade");
			$("#popup_" + i).attr("class", "modal fade");
			$("#popup_" + i).attr("tabindex", "-1");
			$("#popup_" + i).attr("role", "dialog");
			$("#popup_" + i).attr("aria-labelledby", "myModalLabel");
			$("#popup_" + i).attr("aria-hidden", "true");
			$("#popup_" + i).append(
					$("<div class='modal-dialog'></div>").append(
							$("<div class='modal-content'></div>").append(
									$("<div class='modal-body'></div>").append(
											$("<img class='img-responsive'/>")
													.attr("src", url)))));
	*/
			
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


