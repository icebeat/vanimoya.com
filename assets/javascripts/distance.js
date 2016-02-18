var countries = {
  'SE': {
    'ANY': '¿Cambiarás las albóndigas por jamón del bueno?'
  },
  'CH': 'Mucho chocolate suizo pero para chocolate el de San Ginés ;)',
  'US': {
    'ANY': 'Tendrás que cruzar el charco para la boda del año',
    'CA': 'Para puente el de la Pepa ¡viva Cádiz!',
    'NY': 'Cambiarás el "New York New York" de Sinatra por un chotis'
  },
  'FR': '¡Oh la la! Comment ça va?',
  'AU': 'Te esperamos con jamón del bueno. ¿Te lo vas a perder?',
  'GB': 'London calling! Keep calm and carry on!',
  'ES': {
    'ANY': 'Madrid y Cádiz se unen para celebrar la boda del año.',
    'HERE': 'Más cerca de casa imposible. ¿Te lo vas a perder?',
    'AN': 'Quillo que me caso, qué bastinazo. ¡no ni na!',
    'AS': 'Aunque no está invitado... ¡Viva Fernando Alonso!',
    'CN': 'Canarias, en invierno os veremos!',
    'CB': 'La comunidad autónoma favorita de los novios',
    'CL': 'Burgos y Salamanca estarán muy presentes en la boda',
    'CT': 'Madrid no tiene playa, vaya vaya.',
    'EX': 'Te esperamos que nos falta un buen embutido',
    'GA': 'Zamburiñas, pulpo, albariño ¿Quién da más?',
    'IB': 'Será maravilloso viajar hasta Madrid!',
    'RI': 'Te tendremos presente con un buen vino riojano',
    'MD': 'Más cerca de casa imposible. ¿Te lo vas a perder?',
    'MC': '¡Acho pijo huevo! Nos casamos!',
    'NC': 'Tú en los encierros y nosotros de boda!',
    'PV': 'Tómate un pintxo y un zurito a nuestra salud',
    'VC': '¿Fallas? Lo que va arder es Madrid!'
  }
};

var distance = {
  'far': ['plane'],
  'near': ['train', 'bus', 'car'],
  'around': ['walk'] // 'taxi', 'subway', 
};

var getLocation = function() {

  var day = 1000 * 60 * 60 * 24;
  var now = new Date().getTime();
  var setupTime = localStorage.getItem('setupTime');

  if (setupTime == null || (now-setupTime > day)) {
    window.localStorage.setItem('setupTime', now);
    $.getJSON("http://ip-api.com/json/?callback=?", callbackAPI);
  } else {
    var API = window.localStorage.getItem('locationByIP');
    updateMessage(JSON.parse(API));
  }

};

var callbackAPI = function(API) {
  if (API.status === 'success') {
    updateMessage(API);
    // Save JSON
    window.localStorage.setItem('locationByIP', JSON.stringify(API));
  }
};

var updateMessage = function(API) {

  var message = 'Really? Welcome anyway!';
  var icon = distance['far'][0];
  var countryCode = API.countryCode;
  var region = API.region;
  var city = API.city;
  var to = 'Madrid';

  // Spain?
  if (countryCode === 'ES') {
    // Coordinates
    // East/West: if longitude < 0 then West, else East
    // North/South: if latitude < 0 then South else North
    var country = countries['ES'];
    icon = distance['near'][Math.floor(Math.random() * distance['near'].length)];
    if (city === 'Madrid') {
      icon = distance['around'][0];
      message = country['HERE'];
      to = 'Cielo';
    } else if (country[region]) {
      message = country[region];
    } else {
      message = country['ANY'];
    }
  } else if (countries[countryCode]) {
    var country = countries[countryCode];
    if (country[region]) {
      message = country[region];
    } else {
      message = country['ANY'];
    }
  }

  // Widow
  message = message.replace(/\s(?=[^\s\"]*$)/g, '&nbsp;');

  // Update message
  $('.player-where').removeClass('loading');
  $('.player-message').html(message);
  $('.player-from').html(city);
  $('.player-icon').addClass(icon);
  $('.player-to').html(to);

};
