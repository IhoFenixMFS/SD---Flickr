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
						"</div><p></p>" + 
						
						"<div class='col-md-12'>" +
							"<div class='card-body'>" + 
								"<p class='card-text'>" +
									"<nombre class='nombre'> Subida por: " + person.realname._content + "</nombre><br>" +
									"<span class='badge badge-light'>" + fSubida + "</span>" +
								"</p>" +
								"<h5 class='card-text'>" + photo.title._content + "</h5>" +  
								"<h5 class='card-text' >" + photo.description._content + "</h5>" + 
								"<a href='timeline.html?id_usuario=" + person.id + "' class='badge badge-primary'>Ir a: @" + photo.owner.username + "</a>" +
								/*obtenerMiniaturaFotos(idFoto, person, posicionImagen);*/
							"</div>" +
						"</div>" +
						
					"</div>" +
				"</div>" +
			"</div><hr /></br></br>";
			
			$('#imagenes').append(imagenesHTML);
			
		
			
			
		}
	});
}

function obtenerMiniaturaFotos(idFoto, person, posicionImagen) {
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
	//Hacemos popeable cada imgen -> generamos la miniatura y su pop-up para mostrarla en un emergente
			
		
			var photo = data.photo;
			var fSubida = formatDate(new Date(parseInt(photo.dateuploaded)*1000));
			
			var urlSmall = 'https://farm' + photo.farm + ".staticflickr.com/" + photo.server + '/' + photo.id + '_' + photo.secret + '_m.jpg';
			
			// Miniatura
			$("#imagenes").append($("<a></a>").attr("id", "imageLink_" + posicionImagen));
			$("#imageLink_" + posicionImagen).attr("data-toggle", "modal");
			$("#imageLink_" + posicionImagen).attr("data-target", "#popup_" + posicionImagen);

			$("#imageLink_" + posicionImagen).append($("<img/>").attr("id", "image_" + posicionImagen));
			$("#image_" + posicionImagen).attr("src", urlSmall);
			$("#image_" + posicionImagen).attr("class", "img-thumbnail image");

			// Popup
			$("#imagenes").append($("<div></div>").attr("id", "popup_" + posicionImagen));
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
													.attr("src", urlSmall)))));
			
			
		
			
			
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


