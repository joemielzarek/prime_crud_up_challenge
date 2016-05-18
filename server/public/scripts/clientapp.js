$(document).ready(function(){
  console.log("hey, this works!");

//------- EVENT LISTENERS -------//
  $('#register-btn').on('click', postOwner);

});

//------- UTILITY FUNCTIONS -------//
function postResponse(res) {
  if (res == 200) {
    //call function that appends to DOM or seperate GET
    console.log('Owner recieved!');
  } else {
    console.log('Owner rejected!!');
  }
}

//------- AJAX FUNCTIONS -------//
function postOwner(event) {
  event.preventDefault();

  var owner = {};

  $.each($('#owner-reg-form').serializeArray(), function (i, field) {
    owner[field.name] = field.value;
  });

  $.post('/owners', data, postResponse);
}
