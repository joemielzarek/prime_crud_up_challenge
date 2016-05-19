$(document).ready(function(){
  $.get('/owners', getOwners);
  $.get('/pets', getPets);

//------- EVENT LISTENERS -------//
  $('#register-btn').on('click', postOwner);

  $('#add-pet-btn').on('click', postPet);

  $('#data-table-container').on('click', '.update', putPet);

  $('#data-table-container').on('click', '.delete', deletePet);

});

//------- UTILITY FUNCTIONS -------//
function deletePetResponse(res) {
  if (res == 'OK') {
    console.log('Pet deleted!');
  } else {
    console.log('Pet not deleted!!', res);
  }
}

function putPetResponse(res) {
  if (res == 'OK') {
    console.log('Pet updated!');
  } else {
    console.log('Pet not updated!!', res);
  }
}

function postPetResponse(res) {
  if (res == 'Created') {
    $.get('/pets', getPets);
    console.log('Pet recieved!');
  } else {
    console.log('Pet rejected!!', res);
  }
}

function postOwnerResponse(res) {
  if (res == 'Created') {
    $.get('/owners', getOwners);
    console.log('Owner recieved!');
  } else {
    console.log('Owner rejected!!', res);
  }
}

//------- AJAX FUNCTIONS -------//

function getVisitInfo(data) {
  return data.check_out;
}

function deletePet(event) {
  event.preventDefault();

  var deletedPet = $(this).parent().parent().data('petId');

  $.ajax ({
    type: 'DELETE',
    url: '/pets/' + deletedPet,
    success: function (data) {
      deletePetResponse();
      $.get('/pets', getPets);
    }
  });
}

function putPet() {
  var updatedPet = {};
  $.each($(this).parent().parent().find('input').serializeArray(), function(i, field) {
    updatedPet[field.name] = field.value;
  });
  updatedPet.petId = $(this).parent().parent().data('petId');
  console.log(updatedPet);
  $.ajax ({
    type: 'PUT',
    url: '/pets',
    data: updatedPet,
    success: function (data) {
      putPetResponse();
    }
  });
}

function getPets(pets) {
  $('#data-table-container').empty();
  $('#data-table-container').append('<tr>' +
         '<th>' + 'Owner' + '</th>' +
         '<th>' + 'Pet Name' + '</th>' +
         '<th>' + 'Breed' + '</th>' +
         '<th>' + 'Color' + '</th>' +
         '<th>' + 'Update' + '</th>' +
         '<th>' + 'Delete' + '</th>' +
         '<th>' + 'Check In / Out' + '</th>' +
         '</tr>');

  pets.forEach(function(row) {

    var checkOut = $.get('/visits/' + row.max, getVisitInfo);

    //Button function
    var buttonType = 'IN';

    if (checkOut) {
      buttonType = 'OUT';
    }

    function inOutButton(type) {
      var $button = '<button class ="' + type + '">' + type + '</button>';
      return $button;
      }

    var $el = $('<tr>' +
         '<td>' + row.first_name + ' ' + row.last_name + '</td>' +
         '<td>' + '<input type="text" value="' + row.name +'" name="petName" />' + '</td>' +
         '<td>' + '<input type="text" value="' + row.breed +'" name="petBreed" />' + '</td>' +
         '<td>' + '<input type="text" value="' + row.color +'" name="petColor" />' + '</td>' +
         '<td>' + '<button class="update">Update</button>' + '</td>' +
         '<td>' + '<button class="delete">Delete</button>' + '</td>' +
         '<td>' + inOutButton(buttonType) + '</td>' +
       '</tr>');
       $el.data('petId', row.id);
    $('#data-table-container').append($el);
  });

}

function postPet(event) {
  event.preventDefault();

  var pet = {};

  $.each($('#pets-form').serializeArray(), function (i, field) {
    pet[field.name] = field.value;
  });
  console.log('pet gen', pet);
  $('#pets-form').children('input[type=text]').val('');
  $.post('/pets', pet, postPetResponse);
}

function getOwners(owners) {

  $('#owner-drop-down').empty();
  owners.forEach(function(row) {
    var $el = $('<option value="'+ row.id +'">'+ row.first_name + ' ' + row.last_name + '</option>');
    $('#owner-drop-down').append($el);
  });

}

function postOwner(event) {
  event.preventDefault();

  var owner = {};

  $.each($('#owner-reg-form').serializeArray(), function (i, field) {
    owner[field.name] = field.value;
  });

  $('#owner-reg-form').children().val('');
  $.post('/owners', owner, postOwnerResponse);
}
