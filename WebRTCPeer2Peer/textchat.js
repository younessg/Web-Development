/*var dataChannel;
var sdpConstraints = { optional: [{ RtpDataChannels: true }] };

if (peer) {
    peer.ondatachannel = function(e) {
        dc = e.channel;
        dataChannelInit(dc)
    };

    peer.onicecandidate = function(e) {
        if (e.candidate) return;
        console.log("onicecandidate", peer.localDescription);
    };

    peer.oniceconnectionstatechange = function(e) {
        var state = peer.iceConnectionState
        console.log("oniceconnectionstatechange", state);
    };
}

function dataChannelInit(dc) {
    dataChannel = dc;
    dataChannel.onopen = function() {
        console.log("dataChannel", "CONNECTED!");
    };
    dataChannel.onmessage = function(e) { if (e.data) console.log("onmessage", e.data); }
}

document.querySelector('#send-btn').addEventListener('click', sendMSG);

function sendMSG() {
    var _msg = document.querySelector('#msg-txt').value;
    if (_msg) {
        dataChannel.send(_msg);
        console.log("sent message", _msg);
    }
}
*/