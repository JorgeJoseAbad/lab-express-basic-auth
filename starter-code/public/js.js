
$(document).ready(function ($) {
    //two alternatives to get action path.
    let action = this.location.pathname;
    let actionOption = $('#login-register-form').attr('action');
    if ((action === '/register') && (actionOption === '/register')){
      $('#userPassword').strength();
    }
});
