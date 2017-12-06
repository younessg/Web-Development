navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

var isInitiator = false;
var peer = null;
var _stream = null;
var dataChannel; //
let senderVideo = document.querySelector('#sender-video');
let _receiver = document.querySelector('#receiver-video');
let constraints = {
    video: true,
    audio: true
};

document.querySelector('#start').addEventListener('click', startMyVideoStream);

function startMyVideoStream(ev) {
    isInitiator = true;
    navigator.getUserMedia(constraints, successCallback, errorCallback);
};

function successCallback(stream) {
    _stream = stream
    createPeer(_stream);
    broadcastStream(_stream);
}

function errorCallback(err) {
    console.log(err);
}

function broadcastStream(_stream) {
    window.stream = _stream; // stream available to console
    if (window.URL) {
        senderVideo.src = window.URL.createObjectURL(_stream);
    } else {
        senderVideo.src = _stream;
    }
    //senderVideo.muted = true;
    senderVideo.play();
}

function createPeer(_stream) {

    console.log("createPeer / isInitiator", isInitiator);

    let config;

    if (_stream != null && _stream != '') {
        config = { initiator: isInitiator, stream: _stream, trickle: false }
    } else {
        config = { initiator: isInitiator, trickle: false }
    }

    if (!peer) {
        peer = new SimplePeer(config);
    }

    bindPeerEvents(peer);
}

function bindPeerEvents(peer) {
    peer.on('stream', handlePeerStream);
    peer.on('signal', handlePeerSignal);
    //peer.on('data', handlePeerData);
    peer.on('error', handlePeerError);
    peer.on('negotiationneeded', function(ev) {
        console.log(ev);
    });

    /* chat part */
    peer.ondatachannel = function(e) {
        dataChannel = e.channel;
        dataChannelInit(dataChannel)
    };

    peer.onicecandidate = function(e) {
        if (e.candidate) {
            console.log("onicecandidate", JSON.stringify(peer.localDescription));
        }
    };

    peer.oniceconnectionstatechange = function(e) {
        var state = peer.iceConnectionState
        console.log("oniceconnectionstatechange", state);
    };

    //createDataChannel(peer);
}

function handlePeerStream(stream) {

    _stream = stream;

    console.log("handlePeerStream / _stream", _stream);
    console.log("handlePeerStream / _stream.getVideoTracks", _stream.getVideoTracks());

    window.stream = _stream; // stream available to console
    if (window.URL) {
        _receiver.src = window.URL.createObjectURL(_stream);
    } else {
        _receiver.src = _stream;
    }
    _receiver.play();
}

function handlePeerSignal(data) {
    console.log("handlePeerSignal", data);
    document.querySelector('#textAreaMyOffer').textContent = JSON.stringify(data);
}

function handlePeerError(data) {
    console.log("handlePeerError", data);
}

function handlePeerData(data) {
    console.log("handlePeerData", data);
}

document.querySelector('#submit-btn').addEventListener('click', handleHandShake);

//$('#incoming').submit(handleHandShake);
let targetPeer;

function handleHandShake(event) {
    event.preventDefault;
    console.assert("handleHandShake", event);
    createPeer(null);
    targetPeer = JSON.parse(document.querySelector('#someTextArea').value);
    peer.signal(targetPeer);
    return false;
}

document.querySelector('#acknowledgeSignal-btn').addEventListener('click', acknowledgeSignal);

function acknowledgeSignal(ev) {
    let targetPeer = JSON.parse(document.querySelector('#acknowledgeSignal-txtArea').value);
    peer.signal(targetPeer);
}

let vmuted = false;
// Handle video mute unmute
function toggleMuteVideo() {
    let tracks = _stream.getVideoTracks();
    console.log("toggleMuteVideo / # video tracks", tracks);
    /*if (!vmuted) {
        _stream.getVideoTracks()[0].stop();
        vmuted = true;
    } else {
        _stream.getVideoTracks()[0].play();
        vmuted = false;
    }
    //_stream.getVideoTracks()[0].enabled = false;*/
    _stream.getVideoTracks()[0].enabled = !(_stream.getVideoTracks()[0].enabled);
}

let audionmuted = false;
let soundTracks;
// Handle audion mute unmute
function toggleMuteSound() {
    let tracks = _stream.getAudioTracks();
    console.log("toggleMuteSound / # audio tracks", tracks);
    /*if (!audionmuted) {
        //_stream.getAudioTracks()[0].stop();
        _stream.getAudioTracks()[0].enabled = true;
        audionmuted = true;
    } else {
        //_stream.getVideoTracks()[0].play();
        _stream.getAudioTracks()[0].enabled = false;
        audionmuted = false;
    }*/
    _stream.getAudioTracks()[0].enabled = !(_stream.getAudioTracks()[0].enabled);
}

// HANDLE MIC LEVEL --------------------------
var mic_range = document.querySelector('#mic-range');
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var gainNode = audioCtx.createGain();
var source;
var audioDestination;
var biquadFilter = audioCtx.createBiquadFilter();
if (_stream) {
    window.orginalStream = _stream;

    source = audioCtx.createMediaStreamSource(_stream);
    source.connect(gainNode);
    audioDestination = audioCtx.createMediaStreamDestination();

    /*biquadFilter.type = "lowshelf";
    biquadFilter.frequency.value = 1000;
    
    source.connect(biquadFilter);
    biquadFilter.connect(audioCtx.destination);*/

    gainNode.connect(audioCtx.destination);

    window.localStream = audioDestination.stream;
}
// Mic value changes callback -----------------------
mic_range.oninput = function() {
    console.log("handleAudioVolumeChange / range", mic_range.value / 10);
    // Range is 0 and 2
    gainNode.gain.value = mic_range.value / 10;
    //biquadFilter.gain.value = mic_range.value;
    document.querySelector('#miclevel').innerHTML = "Mic level: " + gainNode.gain.value;
};

// HANDLE SPEAKER level -----------------------------
var spkr_range = document.querySelector('#spkr-range');
spkr_range.oninput = function() {
    //audioDestination.volume =
    if (senderVideo) {
        senderVideo.volume = spkr_range.value / 10;
    }
    document.querySelector('#speakerlevel').innerHTML = "Spkr level: " + spkr_range.value / 10;

};

// Handle video filters ------------------------------
var selectBox = document.querySelector('#videofilters');
var contex_1 = document.querySelector('#canvas-1').getContext('2d');
var filter = ['none', 'blur(3px)', 'grayscale(1)', 'invert(1)', 'sepia(1)'];
var pixelData;
var isPlaying = false;

function handleVieoFilterChange() {
    selectedValue = selectBox.value;
    console.log(selectedValue);
    senderVideo.className = selectedValue;

    var filterIndex = 0;
    contex_1.filter = 'none';

    switch (selectedValue) {
        case 'none':
            filterIndex = 0;
            break;
        case 'blur':
            filterIndex = 1;
            break;
        case 'grayscale':
            filterIndex = 2;
            break;
        case 'invert':
            filterIndex = 3;
            break;
        case 'sepia':
            filterIndex = 4;
            break;
    };

    contex_1.filter = filter[filterIndex];
    contex_1.drawImage(senderVideo, 0, 0, 300, 225);
    pixelData = contex_1.getImageData(0, 0, 300, 255);

    //apply filter using pixelData
    // var filteredData = filter(pixelData);

    contex_1.putImageData(pixelData, 0, 0);
    requestAnimationFrame(handleVieoFilterChange);

    var tempCanvas = document.querySelector('#canvas-1');
    var filteredStream = tempCanvas.captureStream();

    if (!isPlaying) {
        _receiver.src = window.URL.createObjectURL(filteredStream);
        _receiver.play();
        isPlaying = true;
        filteredStream.getTracks().forEach(
            function(track) {
                peer.addTrack(
                    track,
                    stream
                );
            }
        );
    }

    //pc.addStream(stream);
}

// Get all media devices -----------------------
navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

function gotDevices(deviceInfos) {
    var masterOutputSelector = document.querySelector('#mediasources');
    for (var i = 0; i !== deviceInfos.length; ++i) {
        var deviceInfo = deviceInfos[i];
        var option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        //if (deviceInfo.kind === 'audiooutput') {
        console.info('deviceInfo.kind: ', deviceInfo.kind);
        option.text = deviceInfo.label || 'speaker ' +
            (masterOutputSelector.length + 1);
        masterOutputSelector.appendChild(option);
    }
}

//============================================================
/* data channel for text chat */
function createDataChannel(peer) {
    dataChannel = peer.createDataChannel("chat");
    bindDataChannelEvents(dataChannel);
}

function bindDataChannelEvents(dataChannel) {
    dataChannel.onopen = function() {
        console.log("bindDataChannelEvents / onopen", "Data channel conected!");
    };
    dataChannel.onmessage = function(e) {
        if (e.data) console.log("bindDataChannelEvents / onmessage", e.data);
    }
}

document.querySelector('#send-btn').addEventListener('click', sendMSG);

function sendMSG() {
    var _value = $("#msg-txt").val();
    console.log(_value);
    /*if (_value) {
        dataChannel.send(value);
    }*/

    peer.data(_value);
}