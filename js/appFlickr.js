let photosGuardado = new Map();

$(function() {
$.getJSON('https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=' 
	 + api_key + '&user_id=' +user_id + 
	'&format=json&nojsoncallback=1',
	mostrar_fotos
)

function mostrar_fotos(info){
	var i;
	for (i=0;i<info.photos.photo.length;i++) {
	   var item = info.photos.photo[i];
	   var url = 'https://farm'+item.farm+".staticflickr.com/"+item.server
		          +'/'+item.id+'_'+item.secret+'_m.jpg';
	   console.debug(url);
	   $("#imagenes").append($("<img/>").attr("src",url));
    }
}

function mostrar_fotos_usuario() {
    $('#imagenes').append("<div class=\"gif\"><img src=\"img/cargando-gif.gif\"></div>");
    var criteriofinal1 = calculaCriterio();
    $.getJSON('https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=' +
        api_key + '&user_id=' + user_id + criteriofinal1 +
        '&format=json&nojsoncallback=1',
        mostrar_fotos
    )
}

function addPhotosGuardado(id) {
    photosGuardado.set(id,photosBusqueda[Number(id)]);
    actualizarFotos();
}

}
)		