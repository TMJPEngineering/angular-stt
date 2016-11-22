/**
 * Copyright 2014 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* global $ */
'use strict';

var Microphone = require('../Microphone');
var handleMicrophone = require('../handlemicrophone').handleMicrophone;
var showError = require('./showerror').showError;

exports.initRecordButton = function(ctx) {

    var recordAudio = $('#recordAudio');
    var stopAudio = $('#stopAudio');
    // var child = $('#child');
    var qs = $('#qs');
    var stop = function () {
        var micOptions = {
            bufferSize: ctx.buffersize
        };
        var mic = new Microphone(micOptions);

        return function(evt) {
            evt.preventDefault();
            $('#reading').text('Stopping ...');
            console.log('Stopping microphone, sending stop action message');
            recordAudio.removeAttr('style');
            $.publish('hardsocketstop');
            mic.stop();
            $('#stopAudio').attr('disabled', 'disabled');
            $('#recordAudio').attr('disabled', false);
            $('#reading').text('');
            localStorage.setItem('currentlyDisplaying', 'false');
        }
    };

    recordAudio.click((function() {
        var token = ctx.token;
        var micOptions = {
            bufferSize: ctx.buffersize
        };
        var mic = new Microphone(micOptions);

        return function(evt) {
            evt.preventDefault();
            var currentModel = localStorage.getItem('currentModel');
            localStorage.setItem('currentlyDisplaying', 'record');
            $('#resultsText').val('');
            $('#reading').text('Starting ...');
            console.log('Not running, handleMicrophone()');
            handleMicrophone(token, currentModel, mic, function(err) {
                if (err) {
                    var msg = 'Error: ' + err.message;
                    console.log(msg);
                    showError(msg);
                    localStorage.setItem('currentlyDisplaying', 'false');
                } else {
                    recordAudio.css('background-color', '#d74108');
                    console.log('starting mic');
                    mic.record();
                    $('#recordAudio').attr('disabled', 'disabled');
                    $('#stopAudio').attr('disabled', false);
                    $('#resultsText').focus();
                    $('#reading').text('Reading ...');
                }
            });
        };
    })());

    stopAudio.click((stop)());
    qs.click((stop)());
    // child.click((stop)());
};
