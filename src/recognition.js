import {showInfo, linebreak, capitalize} from './helper';

let final_transcript = '';
let recognizing = false;
let ignore_onend;
let start_timestamp;

// Create new speech recognize
const recognition = new webkitSpeechRecognition();

// Simple setting
recognition.continuous = false; // Set true if you want it continuous to recognize
recognition.interimResults = true; // Set true if you want it return interim result

// Start speak
recognition.onstart = function() {
    showInfo('info_speak_now');
    recognizing = true;
};

// Handle speak error
recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
        showInfo('info_no_speech');
        ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
        showInfo('info_no_microphone');
        ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
        if (event.timeStamp - start_timestamp < 100) {
            showInfo('info_blocked');
        } else {
            showInfo('info_denied');
        }
        ignore_onend = true;
    }
};

// Optional callback function
let resultCallback;

// When you stop speak and it recognized your speech
recognition.onend = function() {
    recognizing = false;
    info_speak_now.classList.remove('show');
    if (ignore_onend) {
        return;
    }

    if (!final_transcript) {
        return;
    }

    // Send last recognized text
    if (resultCallback) {
        resultCallback(final_transcript);
    }
};

// When it got result (run many time)
recognition.onresult = function(event) {
    let interim_transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            final_transcript = event.results[i][0].transcript;
        } else {
            interim_transcript += event.results[i][0].transcript;
        }
    }

    final_transcript = capitalize(final_transcript);
    interim_span.innerHTML = linebreak(capitalize(interim_transcript));
};

// Start recognize
function startRecognize(language, onResult) {
    if (recognizing) {
        recognition.stop();
        return;
    }

    final_transcript = '';
    interim_span.innerHTML = final_transcript;
    recognition.lang = language;
    recognition.start();
    ignore_onend = false;
    showInfo('info_allow');
    start_timestamp = event.timeStamp;
    resultCallback = onResult;
}

// Force stop recognize
function stopRecognize() {
    // Send last recognize text
    if (resultCallback && final_transcript) {
        resultCallback(final_transcript);
    }

    info_speak_now.classList.remove('show');
    recognition.stop();
}

export default {startRecognize, stopRecognize};
