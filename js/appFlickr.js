$(function() {
	$.getJSON('https://api.flickr.com/services/rest/?&method=flickr.photos.getContactsPublicPhotos&api_key='
							+ api_key
							+ '&user_id='
							+ user_id
							+ '&format=json&nojsoncallback=1', mostrar_fotos)

	

})

function filtrar_fotos() {
	$.getJSON('https://api.flickr.com/services/rest/?&method=flickr.photos.getContactsPublicPhotos&api_key='
					+ api_key + '&user_id=' + user_id + '&just_friends=1'
					+ '&format=json&nojsoncallback=1', mostrar_fotos)
}

function mostrar_todo() {
	$.getJSON('https://api.flickr.com/services/rest/?&method=flickr.photos.getContactsPublicPhotos&api_key='
			+ api_key
			+ '&user_id='
			+ user_id
			+ '&format=json&nojsoncallback=1', mostrar_fotos)
}

function mostrar_fotos(info) {
	$("#imagenes").empty();
	var i;
	for (i = 0; i < info.photos.photo.length; i++) {
		var item = info.photos.photo[i];
		var url = 'https://farm' + item.farm + ".staticflickr.com/"
				+ item.server + '/' + item.id + '_' + item.secret
				+ '_m.jpg';
		console.debug(url);
		$("#imagenes").append($("<img/>").attr("src", url));
	}
}