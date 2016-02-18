var simpleWebAudioPlayer = function () {
  "use strict";
  
  var player = {},
    sounds = [],
    ctx,
    masterGain;
  
  player.load = function (sound, callback) {

    var request;
    
    // Load the sound
    request = new window.XMLHttpRequest();
    request.open("get", sound.src, true);
    request.responseType = "arraybuffer";
    request.onload = function() {
      ctx.decodeAudioData(request.response, function(buffer) {
        
        sounds[sound.name] = sound;
        
        sounds[sound.name].buffer = buffer;
        // Invoke a function if a callback is specified
        if (sounds[sound.name].callback) {
          sounds[sound.name].callback();
        }

      });
    };
    request.send();
  };
  
  player.play = function (name) {
    
    var inst = {};
    
    if (sounds[name]) { 
      // Create a new source for this sound instance
      inst.source = ctx.createBufferSource();
      inst.source.buffer = sounds[name].buffer;
      inst.source.connect(masterGain);
      inst.source.loop = true;

      // Play the sound
      if (sounds[name].pausedAt) {
        inst.source.start(0, sounds[name].pausedAt);
      } else {
        sounds[name].startedAt = ctx.currentTime;
        inst.source.start(0);
      }
      sounds[name].duration = sounds[name].buffer.duration;
      sounds[name].source = inst.source;

    }
  };

  player.pause = function (name) {
    
    if (sounds[name]) {
      sounds[name].pausedAt = (ctx.currentTime - sounds[name].startedAt) % sounds[name].duration;
      sounds[name].source.stop();
    }

  };
  
  // Create audio context
  if (typeof AudioContext !== "undefined") {
    ctx = new window.AudioContext();
  } else if (typeof webkitAudioContext !== "undefined") {
    ctx = new window.webkitAudioContext();
  }
  // Create the master gain node
  masterGain = (ctx.createGain) ? ctx.createGain() : ctx.createGainNode();
  // Connect the master gain node to the context's output
  masterGain.connect(ctx.destination);

  return player;
};