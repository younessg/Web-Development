getUserMedia() => input => MediaStream | MediaStreamTrack: Video & MediaStreamTrack: Audio(L / R channesl) => output.

Constraints => example simpl.info / getusermedia / constraints => video: {
    mandatory: {
        minWidth: 640,
        minHeight: 360
    },
    optional[{
        minWidth: 1280,
        minHeight: 720
    }]
}

webaudiodemos.appspot.com / AudioRecorder
getUserMedia + Web Audio => navigator.webkitGetUserMedia({ audio: true }, got Stream);

function gotStream(stream) {
    var audioContext = new webkitAudioContext();
    var mediaStreamSource = audioContext.createMediaStreamSource(stream);
    mediaStreamSource.connect(audioContext.destinantion);
}

getUserMedia screencapture
var constraints = {
    video: {
        mandatory: {
            chromeMediaSource: 'screen'
        }
    }
};
navigator.webkitGetUserMedia(constraints, gotStream);

Video RTCPeerConnection => simpl.info / pc

RTCDataChannel / onreceivemessage = handle(data)
    -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
    var pc = new webkitRTCPeerConnection({
        servers,
        optional: [{ RTpDataChannel: true }]
    });

pc.ondatachannel = function(event) {
    receiveChannel = event.channel;
    receiveChannel.onmessage = function(event) {
        document.querySelector("div#receive").innerHTML = event.data;
    }
};

sendChannel = pc.createDataChannel("sendDataChannel", { reliable: false });

document.querySelector("button#send").onclick = function() {
    var data = document.querySelector("textarea#send").value;
    sendChannel.send(data);
}

// Signaling
RTCSessionDescription

//ICE a framework for connecting peers, it fiends the best path (STUN and TURN as input)
// STUN test server stun.l.google.com:19302, rfc5766-turn-server

// JavaScript frameworks
// Video chat. SimpleWebRTC, easyRTC, webRTC.io
// Peert to peer data: PeerJS, Sharefest

// SimpleWebRTC
var webrtc = new webrtc({
    localVideoEl: 'localVideo',
    remoteVideosEl: 'remoteVideos',
    autoRequestMedia: true
});

webrtc.on('readyToCall', function() {
    webrtc.joinRoom('My room name');
})

// PeerJS
var peer = new Peer('someid', { key: 'apiKey' });
peer.on('connection', function(conn) {
    conn.on('data', function(data) {
        // Will print 'hi';
        console.log(data);
    });
});

// Connecting peer
var pper = new Peer('anotherid', { key: 'apikey' });
var conn = peer.connection('someid');
conn.on('open', function() { conn.send('hi!') });

// Justin Uberti: Google I/O presentation video
// Cullen Jennings video: HTML5 WebRTC
// Book: webrtcbook.com

// Create peer connection with datachannel
peer = new RTCPeerConnection(config, { optional: [{ RTpDataChannel: true }] });
peer.onicecandidate = function(event) {
    if (event.candidate) {
        // Ignore this part since many IPs will be fetched
        peer.addiceCandidate(new RTCIceCandidate(JSON.parse(JSON.stringify(event.candidate))))
    } else {
        // Create a new offer to get a new session description that includes all ICE candidates
        peer.createOffer(function(sessionDescriotion) {
            personA2PersonB_Offer = sessionDescriotion
        }, fail);
    }
}

// video is ignored for this demo
peerChannel = peer.createDataChannel('message', { reliable: true });
// Initiate offer creation. The session description we het here includes no ICE candidtaes yet!
peer.createOffer(function(sessionDescriotion) {
    // Let our local peer connection know the session description we want to use.
    peer.selLocalDescription(sessionDescriotion);
    // Now we wait for all ICE candidates to trickle in.
    // We show the session descprtion we already have and update it once we have all ICE acandidates.
    // You can use trickle to propagate all IPs, set this flag to true when instanciating peerconnection class
});

// Create an answer
peer = RTCPeerConnection
peer.onicecandidate = function // ... like above
if (event.candidate) {
    peer.addiceCandidate(new RTCIceCandidate(JSON.parse(JSON.stringify(event.candidate))))
} else {
    peer.createAnswer(function(sessionDescriotion) {
        personBAnswerforA = sessionDescriotion;
    }, fail);
}
// We get notified for each data channel that was requested by Alice
peer.ondatachannel = function(event) {
    var dataChannel = event.channel;
    dataChannel.onopen = function() {
        // log person B channel open
    }
    dataChannel.onmessage = function(event) {
        // Log person B received message event.data
        // Log person B sends message of hello
        dataChannel.send('hello from person B');
    }
}

// Create an answer regardless if ICE finished
peer = new RTCPeerConnection
    // The on ICE part
peer.createAnswer(function(sessionDescriotion) {
    personBAnswer = sessionDescriotion;
}, fail);
// Then create initial answer anyway since ICE is not done yet
peer.setRemoteDescription('offer from person a');
peer.createAnswer(function(sessionDescriotion) {
    peer.selLocalDescription(sessionDescriotion);
}, fail);

// Doing the actual connecton between A and B
peerA.onopen = function() {
    // Log person A data channel open
    peerA.onmessage = function(event) {
        //log received message
    }
    peerA.send('hello');
}

peerA.setRemoteDescription('answer from person B');

// Chat with video,
// instanticate RTCpeer
// getUserMedia
// get stream
// peer.addstream(stream)
// peer.onaddstream

// Media devices selection
navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

function gotDevices(devices) {
    for (var i = 0; i !== devices.lenght; i++) {
        var device = devices[i];
        console.log(device.deviceId);
        console.log(device.deviceKind); // audion video input output
        console.log(device.deviceLabel);
    }
}
// Specifiy device ID in the constraints
navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);

// handle voulme changes with effects
var range = document.querySelector('#range');
var audioCtx = new AudioContext();
var gainNode = audioCtx.createGain();
var source;
if (_stream) source = audioCtx.createMediaStreamSource(_stream);
var biquadFilter = audioCtx.createBiquadFilter();
biquadFilter.type = "lowshelf";
biquadFilter.frequency.value = 1000;
biquadFilter.gain.value = range.value;
if (source) source.connect(biquadFilter);
biquadFilter.connect(audioCtx.destination);
range.oninput = function() {
    console.log("handleAudioVolumeChange / range", range.value);
    biquadFilter.gain.value = range.value;
};

// Detec media devices and set them in getUserMedia
selectVideoDevice(deviceId) {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: deviceId } } }) // <==
                // navigator.getUserMedia({ audio: false, video: { width: 720, height: 1280, deviceId: { exact: backCamera[1] } } },
                .then((stream) => {
                    this.$refs.video.src = window.URL.createObjectURL(stream)
                    this.$refs.video.play()
                })
        }
    },
    changeVideoDevice() {
        this.selectVideoDevice(this.currentVideoDevice)
    },

    // Detect media devices and add the track to peer connection
    pc.addTrack(stream.getVideoTracks()[0], stream);

// capture image from video
capturePhoto() {
    const ctx = this.$refs.canvas.getContext('2d')
        // const w = this.$refs.video.videoWidth
        // const h = this.$refs.video.videoHeight
    const w = this.$refs.video.clientWidth
    const h = this.$refs.video.clientHeight
    this.$refs.canvas.width = w
    this.$refs.canvas.height = h
    ctx.drawImage(this.$refs.video, 0, 0, w, h)
    this.captured = true
},