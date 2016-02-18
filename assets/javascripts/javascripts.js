// Minified version of isMobile included in the HTML since it's small
!function(a){var b=/iPhone/i,c=/iPod/i,d=/iPad/i,e=/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,f=/Android/i,g=/(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,h=/(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,i=/IEMobile/i,j=/(?=.*\bWindows\b)(?=.*\bARM\b)/i,k=/BlackBerry/i,l=/BB10/i,m=/Opera Mini/i,n=/(CriOS|Chrome)(?=.*\bMobile\b)/i,o=/(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,p=new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)","i"),q=function(a,b){return a.test(b)},r=function(a){var r=a||navigator.userAgent,s=r.split("[FBAN");return"undefined"!=typeof s[1]&&(r=s[0]),this.apple={phone:q(b,r),ipod:q(c,r),tablet:!q(b,r)&&q(d,r),device:q(b,r)||q(c,r)||q(d,r)},this.amazon={phone:q(g,r),tablet:!q(g,r)&&q(h,r),device:q(g,r)||q(h,r)},this.android={phone:q(g,r)||q(e,r),tablet:!q(g,r)&&!q(e,r)&&(q(h,r)||q(f,r)),device:q(g,r)||q(h,r)||q(e,r)||q(f,r)},this.windows={phone:q(i,r),tablet:q(j,r),device:q(i,r)||q(j,r)},this.other={blackberry:q(k,r),blackberry10:q(l,r),opera:q(m,r),firefox:q(o,r),chrome:q(n,r),device:q(k,r)||q(l,r)||q(m,r)||q(o,r)||q(n,r)},this.seven_inch=q(p,r),this.any=this.apple.device||this.android.device||this.windows.device||this.other.device||this.seven_inch,this.phone=this.apple.phone||this.android.phone||this.windows.phone,this.tablet=this.apple.tablet||this.android.tablet||this.windows.tablet,"undefined"==typeof window?this:void 0},s=function(){var a=new r;return a.Class=r,a};"undefined"!=typeof module&&module.exports&&"undefined"==typeof window?module.exports=r:"undefined"!=typeof module&&module.exports&&"undefined"!=typeof window?module.exports=s():"function"==typeof define&&define.amd?define("isMobile",[],a.isMobile=s()):a.isMobile=s()}(this);

// Function from David Walsh: http://davidwalsh.name/css-animation-callback
function whichTransitionEvent(){
  var t,
      el = document.createElement("fakeelement");

  var transitions = {
    "transition"      : "transitionend",
    "OTransition"     : "oTransitionEnd",
    "MozTransition"   : "transitionend",
    "WebkitTransition": "webkitTransitionEnd"
  }

  for (t in transitions){
    if (el.style[t] !== undefined){
      return transitions[t];
    }
  }
}

var transitionEvent = whichTransitionEvent();
var player = simpleWebAudioPlayer();
var touchEvent = isMobile.any;
var clickEvent = isMobile.apple.device ? 'touchend' : 'click';

var addEvents = function(first, second) {

  // Load music
  player.load({
    name: first,
    src: '../../assets/media/' + first +'.mp3',
    callback: function() {
      if (!touchEvent) {
        player.play(first);
      }
    }
  });
  player.load({
    name: second,
    src: '../../assets/media/' + second + '.mp3'
  });
  // Add Events
  if (touchEvent) {
    $('.player-sound').addClass('off');
    $('.player-sound').removeClass('on');
    $('.player-frame').on(clickEvent, function() {
      toggleClasses(first, second);
      return false;
    });
  } else {
    $('.player-frame').mouseenter(function() {
      toggleClasses(first, second);
    }).mouseleave(function() {
      toggleClasses(first, second);
    });
  }
};

var toggleClasses = function(first, second) {
  if ($('.player').hasClass(first)) {
    $('.player').addClass(second);
    $('.player').removeClass(first);
    if ($('.player-sound').hasClass('on')) {
      player.pause(first);
      player.play(second);
    }
  } else {
    $('.player').removeClass(second);
    $('.player').addClass(first);
    if ($('.player-sound').hasClass('on')) {
      player.pause(second);
      player.play(first);
    }
  }
};

$( document ).ready(function() {
  
  if(touchEvent) {
    $('body').addClass('touch');
  }

  // Animate shapes
  $('.picker-frame').removeClass('outline');

  // Init Events
  $('.picker-bride').on(clickEvent, function () {
    $('.picker').addClass('hide');
    $('.player').removeClass('hide');
    $('.player-frame-rectangle').one(transitionEvent, function() {
      $('.player').addClass('bride');
      $('.player-frame-rectangle').addClass('hide');
      setTimeout(function() {
        $('.player').removeClass('intro');
        addEvents('bride', 'groom');
      }, 250);
    });
    setTimeout(function() {
      $('.player-frame-rectangle').removeClass('outline');
    }, 250);
    getLocation();
  });

  $('.picker-groom').on(clickEvent, function () {
    $('.picker').addClass('hide');
    $('.player').removeClass('hide');
    $('.player-frame-circle').one(transitionEvent, function() {
      $('.player').addClass('groom');
      $('.player-frame-circle').addClass('hide');
      setTimeout(function() {
        $('.player').removeClass('intro');
        addEvents('groom', 'bride');
      }, 250);
    });
    setTimeout(function() {
      $('.player-frame-circle').removeClass('outline');
    }, 250);
    getLocation();
  });

  $('.player-sound').on(clickEvent, function () {
    if ($('.player-sound').hasClass('on')) {
      $('.player-sound').addClass('off');
      $('.player-sound').removeClass('on');
      if ($('.player').hasClass('bride')) {
        player.pause('bride');
      } else {
        player.pause('groom');
      }
    } else {
      $('.player-sound').addClass('on');
      $('.player-sound').removeClass('off');
      if ($('.player').hasClass('bride')) {
        player.play('bride');
      } else {
        player.play('groom');
      }
    }
    return false;
  });

});