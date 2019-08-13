import React from 'react';
import languages from './constant';
import recognition from './recognition';
import axios from 'axios';
import './app.scss';

const code = {
    'ja-JP': 'ja',
    'vi-VN': 'vi',
    'en-GB': 'en',
    'en-US': 'en',
}

/*
 * I'm using yandex.net api to translate text
 */
const freeKey = '_YOUR_API_KEY_';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLanguage: languages[0][1],
            from: 'ja',
            to: 'ja',
            isRecording: false,
            texts: [],
            translated: []
        }

        this.startRecording = this.startRecording.bind(this);
        this.updateCountry = this.updateCountry.bind(this);
        this.updateTranlsateLanguage = this.updateTranlsateLanguage.bind(this);
        this.translateText = this.translateText.bind(this);
        this.onResult = this.onResult.bind(this);
    }

    startRecording() {
        let isRecording = !this.state.isRecording;
        this.setState({isRecording});

        if (isRecording) {
            recognition.startRecognize(this.state.selectedLanguage, this.onResult);
        }
    }

    onResult(text) {
        let texts = this.state.texts;
        let translated = this.state.translated;
        texts.push(text);
        this.setState({texts, isRecording: false}, () => {
            this.translateText(text);
        });
    }

    updateCountry(event) {
        let selectedLanguage = event.target.value;
        this.setState({
            selectedLanguage,
            from: code[selectedLanguage],
            isRecording: false
        }, () => {
            recognition.stopRecognize();
        });
    }

    updateTranlsateLanguage(event) {
        let target = event.target.value;
        this.setState({
            to: code[target]
        })
    }

    translateText(text) {
        let obj = {
            text,
            lang: this.state.from + '-' + this.state.to,
            format: 'plain'
        }
        axios.post('https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + freeKey + '&' + this.serialize(obj))
            .then(response => {
                let translated = this.state.translated;
                let text = response.data.text[0]
                translated.push(text);
                this.setState({translated});
            });
    }

    serialize(obj, prefix) {
        let str = [], p;
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                let k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
                str.push((v !== null && typeof v === "object") ?
                    serialize(v, k) :
                    encodeURIComponent(k) + "=" + encodeURIComponent(v)
                );
            }
        }
        return str.join("&");
    }

    render () {
        return (
            <div id="content" className="app__content">
                <div id="info">
                    <p id="info_speak_now">Speak now.</p>
                    <p id="info_no_speech">No speech was detected. You may need to adjust your <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892"> microphone settings</a>.</p>
                    <p id="info_no_microphone">No microphone was found. Ensure that a microphone is installed and that <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892"> microphone settings</a> are configured correctly.</p>
                    <p id="info_allow">Click the "Allow" button above to enable your microphone.</p>
                    <p id="info_denied">Permission to use microphone was denied.</p>
                    <p id="info_blocked">Permission to use microphone is blocked. To change, go to chrome://settings/contentExceptions#media-stream</p>
                    <p id="info_upgrade">Web Speech API is not supported by this browser. Upgrade to <a href="//www.google.com/chrome">Chrome</a> version 25 or later.</p>
                </div>
                <div id="div_language">
                    <div id="start_button" className={this.state.isRecording ? 'listening' : ''} onClick={this.startRecording}>
                        {this.state.isRecording ?  <span>Listening...</span> : <span>Start</span>}
                    </div>
                    <div className="language">
                        Select input language:  &nbsp;&nbsp;
                        <select id="select_language" onChange={this.updateCountry}>
                            {languages.map((language, index) => <option key={index} value={language[1]}>{language[0]}</option>)}
                        </select>
                    </div>
                </div>
                <div id="results">
                    {this.state.texts.map((text, index) => <p key={index}>{text}</p>)}
                    <span id="interim_span" className="interim"></span>
                </div>
                <div id="div_language" className="translate">
                    <span />
                    <div className="language">
                        Select translate language:  &nbsp;&nbsp;
                        <select id="select_language" onChange={this.updateTranlsateLanguage}>
                            {languages.map((language, index) => <option key={index} value={language[1]}>{language[0]}</option>)}
                        </select>
                    </div>
                </div>
                <div id="translate-results">
                    {this.state.translated.map((text, index) => <p key={index}>{text}</p>)}
                </div>
            </div>
        )
    }
}
