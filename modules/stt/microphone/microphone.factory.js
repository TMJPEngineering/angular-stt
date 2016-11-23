(function() {
    'use strict';

    angular
        .module('microphone')
        .factory('Microphone', Microphone);
    Microphone.$inject = [];

    function Microphone() {
        var factory = {
            constructor: constructor,
            onPermissionRejected: onPermissionRejected,
            onError: onError,
            onMediaStream: onMediaStream,
            onAudioProcess: onAudioProcess,
            record: record,
            stop: stop,
            // exportDataBufferTo16Khz: exportDataBufferTo16Khz,
            onStartRecording: onStartRecording,
            onStopRecording: onStopRecording,
            onAudio: onAudio,
            saveData: saveData,
            playWav: playWav,
            encodeWav: encodeWav,
            writeString: writeString,
            floatTo16BitPCM: floatTo16BitPCM
        };

        return factory;

        function constructor(options) {
            var options = options || {};

            // We record in mono because the speech recognition service does not support stereo. 
            this.bufferSize = options.bufferSize || 8192;
            this.inputChannels = options.inputChannels || 1;
            this.outputChannels = options.outputChannels || 1;
            this.recording = false;
            this.requestedAccess = false;
            this.sampleRate = 16000;

            // Auxiliar buffer to keep unused samples (used when doing downsampling) 
            this.bufferUnusedSamples = new Float32Array(0);
            this.samplesAll = new Float32Array(20000000);
            this.samplesAllOffset = 0;

            if (!navigator.getUserMedia) {
                navigator.getUserMedia = navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia || navigator.msGetUserMedia;
            }
        }

        // Called when the user reject the use of the microphone
        function onPermissionRejected() {
            console.log('LOG: onPermissionRejected() called');
            this.requestedAccess = false;
            factory.onError('Permission to access the microphone rejected.');
        }

        function onError(error) {
            console.log('LOG: onError() called');
            console.log('Microphone.onError():', error);
        }

        // Called when the user authorizes the use of the microphone.
        function onMediaStream(stream) {
            console.log('LOG: onMediaStream() called');
            var AudioContext = window.AudioContext || window.webkitAudioContext;

            if (!AudioContext)
                throw new Error('AudioContext not available');

            if (!this.audioContext)
                this.audioContext = new AudioContext();

            var gain = this.audioContext.createGain(),
                audioInput = this.audioContext.createMediaStreamSource(stream);

            audioInput.connect(gain);

            if (!this.mic)
                this.mic = this.audioContext.createScriptProcessor(this.bufferSize, this.inputChannels, this.outputChannels);

            console.log('Microphone.onMediaStream(): sample rate is:', this.sampleRate);

            this.mic.onaudioprocess = this.onAudioProcess.bind(this);
            this.stream = stream;

            gain.connect(this.mic);

            this.mic.connect(this.audioContext.destination);
            this.recording = true;
            this.requestedAccess = false;
            factory.onStartRecording();
        }

        function onAudioProcess(data) {
            console.log('LOG: onAudioProcess() called');
            // We speak but we are not recording
            if (!this.recording)
                return;

            // Single channel
            var channel = data.inputBuffer.getChannelData(0);

            // resampler(this.audioContext.sampleRate, data.inputBuffer, factory.onAudio);
            this.saveData(new Float32Array(channel));
            factory.onAudio(factory.exportDataBufferTo16Khz(new Float32Array(channel)));

            // export with microphone mhz, remember to update the this.sampleRate with the sample rate from your microphone
            // factory.onAudio(this._exportDataBuffer(new Float32Array(chan)));
        }

        // Start the audio recording 
        function record() {
            console.log('LOG: record() called');
            if (!navigator.getUserMedia) {
                factory.onError('Browser doesn\'t support microphone input');
                return;
            }

            if (this.requestedAccess) {
                return;
            }

            navigator.getUserMedia({ audio: true },
                factory.onMediaStream.bind(this), // Microphone permission granted
                factory.onPermissionRejected.bind(this)); // Microphone permission rejected
        }

        // Stop the audio recording 
        function stop() {
            console.log('LOG: stop() called');
            if (!this.recording)
                return;

            if (JSON.parse(localStorage.getItem('playback')))
                factory.playWav(); // Plays back the audio that was recorded 

            this.recording = false;
            this.stream.getTracks()[0].stop();
            this.requestedAccess = false;
            this.mic.disconnect(0);
            factory.onStopRecording();
        }

        // Creates a Blob type: 'audio/l16' with the chunk and downsampling to 16 kHz
        // coming from the microphone.
        // Explanation for the math: The raw values captured from the Web Audio API are
        // in 32-bit Floating Point, between -1 and 1 (per the specification).
        // The values for 16-bit PCM range between -32768 and +32767 (16-bit signed integer).
        // Multiply to control the volume of the output. We store in little endian.
        // @param  {Object} buffer Microphone audio chunk
        // @return {Blob} 'audio/l16' chunk
        // @deprecated This method is depracated
        function exportDataBufferTo16Khz(bufferNewSamples) {
            console.log('LOG: exportDataBufferTo16Khz() called');
            var buffer = null,
                newSamples = bufferNewSamples.length,
                unusedSamples = this.bufferUnusedSamples.length;

            if (unusedSamples > 0) {
                buffer = new Float32Array(unusedSamples + newSamples);
                for (var i = 0; i < unusedSamples; ++i) {
                    buffer[i] = this.bufferUnusedSamples[i];
                }
                for (i = 0; i < newSamples; ++i) {
                    buffer[unusedSamples + i] = bufferNewSamples[i];
                }
            } else {
                buffer = bufferNewSamples;
            }

            // Downsampling variables
            var filter = [-0.037935, -0.00089024, 0.040173, 0.019989, 0.0047792, -0.058675, -0.056487, -0.0040653, 0.14527, 0.26927, 0.33913, 0.26927, 0.14527, -0.0040653, -0.056487, -0.058675, 0.0047792, 0.019989, 0.040173, -0.00089024, -0.037935],
                samplingRateRatio = this.audioContext.sampleRate / 16000,
                nOutputSamples = Math.floor((buffer.length - filter.length) / (samplingRateRatio)) + 1,
                pcmEncodedBuffer16k = new ArrayBuffer(nOutputSamples * 2),
                dataView16k = new DataView(pcmEncodedBuffer16k),
                index = 0,
                volume = 0x7FFF, // Range from 0 to 0x7FFF to control the volume
                nOut = 0;

            for (var i = 0; i + filter.length - 1 < buffer.length; i = Math.round(samplingRateRatio * nOut)) {
                var sample = 0;
                for (var j = 0; j < filter.length; ++j) {
                    sample += buffer[i + j] * filter[j];
                }
                sample *= volume;
                dataView16k.setInt16(index, sample, true); // true means little endian
                index += 2;
                nOut++;
            }

            var indexSampleAfterLastUsed = Math.round(samplingRateRatio * nOut);
            var remaining = buffer.length - indexSampleAfterLastUsed;
            if (remaining > 0) {
                this.bufferUnusedSamples = new Float32Array(remaining);
                for (i = 0; i < remaining; ++i) {
                    this.bufferUnusedSamples[i] = buffer[indexSampleAfterLastUsed + i];
                }
            } else {
                this.bufferUnusedSamples = new Float32Array(0);
            }

            return new Blob([dataView16k], {
                type: 'audio/l16'
            });
        }

        // Functions used to control Microphone events listeners.
        function onStartRecording() {
            console.log('LOG: onStartRecording() called');
        }

        // Functions used to control Microphone events listeners.
        function onStopRecording() {
            console.log('LOG: onStopRecording() called');
        }

        // Functions used to control Microphone events listeners.
        function onAudio() {
            console.log('LOG: onAudio() called');
        }

        function saveData(samples) {
            console.log('LOG: saveData() called');
            for (var i = 0; i < samples.length; ++i) {
                this.samplesAll[this.samplesAllOffset + i] = samples[i];
            }
            this.samplesAllOffset += samples.length;
        }

        function playWav() {
            console.log('LOG: playWav() called');
            var samples = this.samplesAll.subarray(0, this.samplesAllOffset);
            var dataview = factory.encodeWav(samples, 1, this.audioContext.sampleRate);
            var audioBlob = new Blob([dataview], { type: 'audio/l16' });
            var url = window.URL.createObjectURL(audioBlob);
            var audio = new Audio();
            audio.src = url;
            audio.play();
        }

        function encodeWav(samples, channels, sampleRate) {
            console.log('LOG: encodeWav() called');
            console.log('Length of samples:', samples.length);
            var buffer = new ArrayBuffer(44 + samples.length * 2);
            var view = new DataView(buffer);

            // RIFF identifier 
            factory.writeString(view, 0, 'RIFF');
            // RIFF chunk length 
            view.setUint32(4, 36 + samples.length * 2, true);
            // RIFF type 
            factory.writeString(view, 8, 'WAVE');
            // format chunk identifier 
            factory.writeString(view, 12, 'fmt ');
            // format chunk length 
            view.setUint32(16, 16, true);
            // sample format (raw) 
            view.setUint16(20, 1, true);
            // channel count 
            view.setUint16(22, channels, true);
            // sample rate 
            view.setUint32(24, sampleRate, true);
            // byte rate (sample rate * block align) 
            view.setUint32(28, sampleRate * 4, true);
            // block align (channel count * bytes per sample) 
            view.setUint16(32, channels * 2, true);
            // bits per sample 
            view.setUint16(34, 16, true);
            // data chunk identifier 
            factory.writeString(view, 36, 'data');
            // data chunk length 
            view.setUint32(40, samples.length * 2, true);

            factory.floatTo16BitPCM(view, 44, samples);

            return view;
        }

        function writeString(view, offset, string) {
            console.log('LOG: writeString() called');
            for (var i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        }

        function floatTo16BitPCM(output, offset, input) {
            console.log('LOG: floatTo16BitPCM() called');
            for (var i = 0; i < input.length; i++, offset += 2) {
                var s = Math.max(-1, Math.min(1, input[i]));
                output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
            }
        }
    }
})();
