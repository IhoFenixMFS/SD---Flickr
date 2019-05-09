function validar(){
	if ((document.form.password.value == '1234') && (document.form.user.value == 'clara')){ 
		document.form.submit(); 
    } 
    else{ 
    	alert("Nombre de usuario y contraseña incorrectos"); 
    } 
}