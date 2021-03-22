
$(document).ready(function ($) {
    let action = this.location.pathname;
    console.log(action);
    if (action === '/register'){
      $('#userPassword').strength();
    }
});
