(function () {
  'use strict';

  var USE_FFT = true;

  var HEIGHT = 400;
  var WIDTH = 600;
  var NOISE_MAX_SAMPLES = 20;
  var MIN_SNR = 2;
  var SAMPLE_SIZE = 1024;

  var TOTAL_NOISE = 10;
  var MINIMUM_CONSECUTIVE_NOTES = 3;
  var SECONDARY_PEAKS_PERCENTAGE = 0.4;
  var SAME_FREQUENCY_THRESHOLD = 0.9;
  var MAX_FREQUENCY = 4000;
  var HEIGHT = 400;
  var WIDTH = 600;
  var MAX_PITCH = 90;
  var MIN_PITCH = 40;

  Noteflight.Transcriber = function (editor, title) {
    var self = this;
    self.title = title;
    self.editor = editor;
    Noteflight.DialogViewModel.call(this);

    var Note = $$nf.classes.com.noteflight.notation.model.Note;
    var ChromaticPitch = $$nf.classes.com.noteflight.music.pitch.ChromaticPitch;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    self.audioContext = new AudioContext();
    self.audioRecorder = null;
    self.maxValue = ko.observable(0);
    self.position = ko.observable(0);
    self.position2 = ko.observable(0);
    self.pitch2 = ko.observable(0);
    self.value = ko.observable(0);
    self.pitch = ko.observable(0);
    self.works = ko.observable(0);
    self.signalEnergy = ko.observable(0);
    self.autocorrelationArray = [];
    self.audioDataMatrix = [];
    self.maximumsMatrix = [];
    self.recording = null;
    self.restDuration = 0;
    self.recordingStream = null;
    self.streamOfNotes = [];
    self.javascriptNode = null;
    self.noiseEnergy = {value: 0, totalSamples: 0, ready: false};
    self.ready = ko.observable("");
    self.isRecording = true;

    self.noiseArray = [];
    self.drawCanvas = null;
    self.drawContext = null;
    var arrayToDraw = null;
    var rafID = null;
    var freqByteData = null;
    var zeroGain = null;
    var frequenciesToAnalyze = null;

    var canvas = null;
    var contextCanvasFinal = null;

    self.samplesCounter = ko.observable(0);

    function absoluteValue(array) {
      var result = [];
      for (var i = 0; i < array.length; i++) {
        result.push(Math.abs(array[i]));
      }

      return result;
    }

    var TOTAL_SAMPLES_TO_BE_NOTE = 3;
    var TOTAL_SAMPLES_TO_BE_NOISE = 5;
    var MIN_CONFIDENCE_VALUE = 0.2;

    function getNoteFromFrequency(freq, confidence) {
      freq = Math.round(freq);
      var lastNotes = [];
      var sameNotes = 0;
      var totalNotesAnalyzed = 0;
      var i = 0;
      if (freq != -1) {
        console.log("detection - freq: " + freq + "   confidence: " + confidence);
        var newElement = true;
        if (self.streamOfNotes.length > 0) {
          var lastElement = self.streamOfNotes[self.streamOfNotes.length - 1];
          if (lastElement.frequency == freq) {
            lastElement.duration ++;
            newElement = false;
            if (lastElement.duration == TOTAL_SAMPLES_TO_BE_NOTE || confidence >= MIN_CONFIDENCE_VALUE) lastElement.isNote = true;
          } else if(confidence >= MIN_CONFIDENCE_VALUE) {
              self.streamOfNotes.push({frequency: freq, duration: 1, noiseDuration: 0, isNote: true, isNoise: false});
          } else {
            if (lastElement.isNote) {
              self.streamOfNotes.push({frequency: freq, duration: 0, noiseDuration: 1, isNote: false, isNoise: false});
            } else {
              lastElement.frequency = freq;
              lastElement.noiseDuration ++;
              if (lastElement.noiseDuration == TOTAL_SAMPLES_TO_BE_NOISE) lastElement.isNoise = true;
            }
          }
        } else {
          self.streamOfNotes.push({frequency: freq, duration: 1, noiseDuration: 0, isNote: false, isNoise: false});
        }
      }
    }

    function calculateSignalEnergy(array) {
      var energy = 0;
      for (var i = 0; i < array.length; i++) {
        energy += array[i] * array[i];
      }

      return energy;
    }

    function calculateMixedAcfAmdf(acf, amdf){
      var values = [];
      for (var i = 0; i < acf.length; i ++) {
        values.push(1000000 * acf[i] / (amdf[i] + 1));
      }

      return values;
    }


    function calculateAMDF (array) {
      var values = [];
      var totalAmount = 0;
      var m = 0;
      var j = 0;
      for (var i = 0; i < array.length; i++) {
        totalAmount = 0;
        for (j = 0; j < array.length; j++) {
          m = i + j;
          if (m >= array.length) m = m - array.length;
          totalAmount += Math.abs(array[j] - array[m]);
        }

        totalAmount = totalAmount/ array.length; // Remove the 200
        values.push(totalAmount);
      }
      return values;
    }

    function calculateAutocorrelation(array) {
      var values = [];
      var totalAmount = 0;
      var m = 0;
      var j = 0;
      for (var i = 0; i < array.length; i++) {
        totalAmount = 0;
        for (j = 0; j < array.length; j++) {
          m = i + j;
          if (m >= array.length) m = m - array.length;
          totalAmount += array[j] * array[m];
        }

        totalAmount = totalAmount/ array.length; // Remove the 200
        values.push(totalAmount);
      }

      return values;
    }


    // function calculateAutocorrelation(array) {
    //   var values = [];
    //   var totalAmount = 0;
    //   var m = 0;
    //   var n = 0;
    //   var totalSamples = 0;
    //   var arrayLength = array.length;
    //   for (var i = 0; i < 2 * arrayLength; i++) {
    //     totalAmount = 0;
    //     m = 0;
    //     n = array.length - i;
    //     totalSamples = i;
    //     if (i > arrayLength) {
    //       m = i - arrayLength;
    //       n = -m;
    //       totalSamples = 2 * arrayLength - i;
    //     }

    //     for (var j = m; j < m + totalSamples; j++) {
    //       totalAmount += array[j] * array[n + j];
    //     }

    //     totalAmount = totalAmount * 200 / array.length; // Remove the 200
    //     values.push(totalAmount);
    //   }

    //   return values;
    // }


    function getMaximumFromArray(array, maxNumber) {
      var array2 = array.slice(0);
      if (maxNumber === undefined) maxNumber = 0;
      var counter = 0;
      var max = 0;
      if (array.length >= maxNumber) {
        max = Math.max.apply(null, array2);
        for (var i = 0; i < maxNumber - 1; i++) {
          array2.splice(array2.indexOf(max), 1);
          max = Math.max.apply(null, array2);
        }
      }

      return max;
    }

    function calculateMaximums(array) {
      var maxArray = [];
      var goingUp = true;
      var average = 0;
      var consecutive = 0;
      for (var i = 1; i < array.length; i++) {
        average += array[i];
        if (array[i] < array[i - 1] && goingUp) {
          maxArray.push({
            position: i,
            value: array[i - 1]
          });
          goingUp = false;
          consecutive = 0;
        } else if (array[i] > array[i - 1]) {
          consecutive++;
          if (consecutive == 3) goingUp = true;
        } else {
          consecutive = 0;
        }
      }

      average += array[0];
      average = average / array.length;

      return {
        average: average,
        maxs: maxArray
      };
    }

    function calculateFollowingMinimum(array, maxPosition) {
      var min = 9999999999999;
      var pos = 0;
      if (maxPosition >= array.length) return null;
      for (var i = maxPosition; i < array.length; i++) {
        if (array[i] < min) {
          min = array[i];
          pos = i;
        } else {
          return {position: pos, value: min};
        }
      }

      return {position: pos, value: min};
    }

    function getMaximumOfPeaks (arrayOfPeaks) {
      var max = 0;
      var position = 0;
      for (var i = 0; i < arrayOfPeaks.length; i ++) {
        if (arrayOfPeaks[i].value > max) {
          max = arrayOfPeaks[i].value;
          position = i;
        }
      }

      return {value: max, position: position};
    }

    function getPeriodicity(array2) {
      //var array = array2.slice(0, Math.floor(array2.length/4));
      var array = array2;
      var THRESHOLD = 0.3;
      var THRESHOLD_SECOND_MAX = 0.7;
      var MAX_MIN_RELATION = 0.8;
      var secondMaxAmplitude = getMaximumFromArray(array, 1);
      var autocorrelationMaximums = calculateMaximums(array);
      if (autocorrelationMaximums.maxs.length === 0) return null;
      var maxPeak = getMaximumOfPeaks(autocorrelationMaximums.maxs);
      var maxValue = maxPeak.value; // Should be 1 in 0 position
      if (secondMaxAmplitude === 0) secondMaxAmplitude = autocorrelationMaximums.maxs[0].value;
      var arrayOfPeaks = [];
      var arrayOfDifferences = [];
      for (var i = 0; i < autocorrelationMaximums.maxs.length; i++) {
        var followingMinimum = calculateFollowingMinimum(array, autocorrelationMaximums.maxs[i].position);
        if (followingMinimum !== null) {
          var maxMinRelation = followingMinimum.value / autocorrelationMaximums.maxs[i].value;
          //console.log("MAXMIN: " + maxMinRelation);

          //if (autocorrelationMaximums.maxs[i].value >= secondMaxAmplitude * THRESHOLD_SECOND_MAX && autocorrelationMaximums.maxs[i].value >= maxValue * THRESHOLD) {
          if (maxMinRelation <= MAX_MIN_RELATION) {
            arrayOfPeaks.push({position: autocorrelationMaximums.maxs[i].position, value: autocorrelationMaximums.maxs[i].value});
          }
        }
      }

      var maxRepeated = 0;
      var position = 0;
      var diff1 = 0;
      var maxRepeated2 = 0;
      var position2 = 0;
      var DIFF_TOLERANCE_IN_SAMPLES = 1;
      var MAX_FREQ_THRESHOLD = 4500;
      var MIN_FREQ_THRESHOLD = 150;
      var MINIMUM_REPETITIONS = 2;
      var objectOfDifferences = {};
      //console.log("length array of peaks: " + arrayOfPeaks.length);
      for (i = 1; i < arrayOfPeaks.length; i++) {
        var found = false;
        var diff = Math.abs(arrayOfPeaks[i].position - arrayOfPeaks[i - 1].position);
        //44100 / (periodicity.differenceInSamples * 4)
        var f = 44100 / (diff * 2); 
        if (f >= MIN_FREQ_THRESHOLD && f <= MAX_FREQ_THRESHOLD) {
          // for (var d in objectOfDifferences) {
          //   if (d >= diff - DIFF_TOLERANCE_IN_SAMPLES && d <= diff + DIFF_TOLERANCE_IN_SAMPLES) {
          //     objectOfDifferences[d]++;
          //     found = true;
          //     break;
          //   }
          // }
          for (var j = 0; j < arrayOfDifferences.length; j++) {
            if (arrayOfDifferences[j].difference >= diff - DIFF_TOLERANCE_IN_SAMPLES && arrayOfDifferences[j].difference <= diff + DIFF_TOLERANCE_IN_SAMPLES) {
              arrayOfDifferences[j].counter++;
              found = true;
              break;
            }
          }

          // if (!found) objectOfDifferences[diff] = 1;

          if (!found) arrayOfDifferences.push({
            difference: diff,
            counter: 1,
            peakValue: arrayOfPeaks[i].value
          });
        }
      }

      // for (var d in objectOfDifferences) {
      //   if (objectOfDifferences[d] > maxRepeated) {
      //     maxRepeated = objectOfDifferences[d];
      //     position = d;
      //   }
      // }

      // for (var d in objectOfDifferences) {
      //   if (d != position){
      //     if (objectOfDifferences[d] > maxRepeated2) {
      //       maxRepeated2 = objectOfDifferences[d];
      //       position2 = d;
      //     }
      //   }
      // }

      for (i = 0; i < arrayOfDifferences.length; i++) {
        if (arrayOfDifferences[i].counter > maxRepeated) {
          maxRepeated = arrayOfDifferences[i].counter;
          position = i;
        }
      }

      for (i = 0; i < arrayOfDifferences.length; i++) {
        if (arrayOfDifferences[i].difference != arrayOfDifferences[position].difference) {
          if (arrayOfDifferences[i].counter > maxRepeated2) {
            maxRepeated2 = arrayOfDifferences[i].counter;
            position2 = i;
          }
        }
      }



      if (maxRepeated >= MINIMUM_REPETITIONS && arrayOfDifferences.length > 0) {
        console.log("primer hz: " + 22050 / arrayOfDifferences[position].difference + " repeticions: " + maxRepeated + " peakValue: " + arrayOfDifferences[position].peakValue);
        console.log("segon hz: " + 22050 / arrayOfDifferences[position2].difference + " repeticions: " + maxRepeated2 + " peakValue: " + arrayOfDifferences[position2].peakValue);
        console.log("-----");
        //console.log("diff: " + arrayOfDifferences[position].difference + "    counter: " + arrayOfDifferences[position].counter);
        var confidence = 100;// arrayOfDifferences[position].counter * arrayOfDifferences[position].difference / SAMPLE_SIZE;
        return {differenceInSamples: arrayOfDifferences[position].difference, confidence: confidence};
      } else {
        //console.log("null");
        return null;
      }
    }



    function getFrequency(array) {
    /*  var drawCanvas = document.getElementById("testCanvas");
      var drawContext = drawCanvas.getContext("2d");
      var HEIGHT = 400;
      var WIDTH = 600;
      for (var i = 0; i < array.length; i++) {
        var value = array[i];
        var percent = value / 256;
        var height = HEIGHT * percent;
        var offset = HEIGHT - height - 1;
        var barWidth = WIDTH / array.length;
        var hue = i / array.length * 360;

        drawContext.clearRect(i * barWidth, 0, barWidth, HEIGHT);
        drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
        drawContext.fillRect(i * barWidth, offset, barWidth, height);
      }
*/
      var periodicityInSamples = getPeriodicity(array);
      return periodicityInSamples;
    }

    function getMaxFromArray(array) {
      var max = 0;
      var pos = 0;
      for (var i = 0; i < array.length; i++) {
        if (array[i] > max) {
          max = array[i];
          pos = i;
        }
      }

      return {position: pos, value: max};
    }

    function removeAccidentalNoise(array) {
      for (var i = 0; i < array.length; i++) {
        if (!array[i].isNoise && !array[i].isNote) {
          array.splice(i, 1);
        }
      }

      var counter = 1;
      while (counter < array.length) {
        if (array[counter].isNote && (array[counter].frequency == array[counter - 1].frequency)) {
          array[counter - 1].duration += array[counter].duration;
          array.splice(counter, 1);
        } else {
          counter++;
        }
      }

      return array;
    }

    function isAmplitudeEnough(signalEnergy, noiseEnergy) { 
      return signalEnergy / noiseEnergy >= MIN_SNR;
    }


    self.notesToAdd = [];
    self.calculatePitches = function () {
      // self.streamOfNotes = removeAccidentalNoise(self.streamOfNotes);
      // for (var i = 0; i < self.streamOfNotes.length; i++) {
      //   if (self.streamOfNotes[i].isNote) {
      //     self.notesToAdd.push(ChromaticPitch.getPitchNumberByFrequency(self.streamOfNotes[i].frequency));
      //   } else {
      //     // is noise (or rest!!)
      //     var rrr =333333333;
      //   }
      // }

      // for (i = 0; i < self.notesToAdd.length; i++) {
      //   //if (controller.document.entryAfterSelection)
      //   //{
      //   self.editor.controller.enterPitchAtSelection(self.notesToAdd[i], false);
      //   // }

      // }

      // var drawCanvas = document.getElementById("testCanvas");
      // var drawContext = drawCanvas.getContext("2d");
      // var HEIGHT = 400;
      // var WIDTH = 600;

      // for (i = 0; i < self.notesToAdd.length; i++) {
      //   var value = self.notesToAdd[i];
      //   var percent = value / 256;
      //   var height = HEIGHT * percent;
      //   var offset = HEIGHT - height - 1;
      //   var barWidth = WIDTH / value;
      //   var hue = i / value * 360;

      //   drawContext.clearRect(i * barWidth, 0, barWidth, HEIGHT);
      //   drawContext.fillStyle = 'red';
      //   drawContext.fillRect(i * barWidth, offset, 1, 1);
      // }
    }

    function getMaxValue(array) {
      var maxVals = array.maxs;
      var max = 0;
      var pos = 0;
      for (var i = 0; i < maxVals.length; i++) {
        if (maxVals[i].value > max) {
          max = maxVals[i].value;
          pos = i;
        }
      }

      return maxVals[pos];
    }

    self.startRecording = function () {
      //self.recordingStream.clear();
      self.isRecording = true;
      //self.recordingStream.start();
    }

    self.stopRecording = function () {
      self.isRecording = false;
      self.arrayOfNotes = [];

      contextCanvasFinal.beginPath();
      contextCanvasFinal.moveTo(0, canvasHeight);
      var canvasHeight = 300;

      // calculate difference of freq
      // for (var i = 0; i < self.arrayOfSamples.length; i ++) {
      //   var peaksDifferences = [];
      //   if (self.arrayOfSamples[i].arrayOfPeaks.length > 0) {
      //     peaksDifferences.push(self.arrayOfSamples[i].arrayOfPeaks[0].frequency);
      //     for (var j = 0; j < self.arrayOfSamples[i].arrayOfPeaks.length - 1; j ++) {
      //       peaksDifferences.push(self.arrayOfSamples[i].arrayOfPeaks[j + 1].frequency - self.arrayOfSamples[i].arrayOfPeaks[j].frequency);
      //     }
      //   }

      //   var histogram = {};
      //   for (var k = 0; k < peaksDifferences.length; k ++) {
      //     if (histogram[peaksDifferences[k]]) {
      //       histogram[peaksDifferences[k]]++;
      //     } else {
      //       histogram[peaksDifferences[k]] = 1;
      //     }
      //   }

      //   var higherValue = 0;
      //   var higherElement = 0;
      //   for (var element in histogram) {
      //     if (histogram[element] > higherValue) {
      //       higherValue = histogram[element];
      //       higherElement = element;
      //     }
      //   }

      //   var pitch = self.findNoteByFrequency(higherElement);
      //   self.addPitch(pitch);
      //   contextCanvasFinal.lineTo(i, 2 * (canvasHeight / 2 - pitch));
      // }
      
      for (var i = 0; i < self.arrayOfSamples.length; i ++) {
        var pitch = 0;
        if (!self.arrayOfSamples[i].arrayOfPeaks[0].isNoise) {
          pitch = self.findNoteByFrequency(self.arrayOfSamples[i].arrayOfPeaks[0].frequency);
        }

        self.addPitch(pitch);
        contextCanvasFinal.lineTo(i, 2 * (canvasHeight / 2 - pitch));
      }

      contextCanvasFinal.strokeStyle = '#ff0000';
      contextCanvasFinal.stroke();


      // Remove pitches out of range 
      for (var i = 0; i < self.arrayOfNotes.length; i ++) {
        if (self.arrayOfNotes[i].pitch > MAX_PITCH || self.arrayOfNotes[i].pitch < MIN_PITCH) {
            self.arrayOfNotes.splice(i, 1);
        }
      }

      // Remove false notes step by step and join same notes
      var notesJoint = false;
      for (var i = 1; i <= MINIMUM_CONSECUTIVE_NOTES; i ++) {
        for (var j = 0; j < self.arrayOfNotes.length; j++) {
          if (self.arrayOfNotes[j].duration <= i) {
            self.arrayOfNotes.splice(j, 1);
            notesJoint = true;
          }
        }

        var totalNotes = self.arrayOfNotes.length;
        j = 0;
        while (j < totalNotes - 1 && notesJoint) {
          if (self.arrayOfNotes[j].pitch == self.arrayOfNotes[j + 1].pitch) { // Same pitch
            self.arrayOfNotes[j].duration += self.arrayOfNotes[j + 1].duration;
            self.arrayOfNotes.splice(j + 1, 1);
            totalNotes --;
          } else {
            j++;
          }
        }

        notesJoint = false;
      }

      // add notes to score
      for (var i = 0; i < self.arrayOfNotes.length; i++) {
        self.editor.controller.enterPitchAtSelection(self.arrayOfNotes[i].pitch, false);
      }
      //self.recordingStream.stop();
      //self.javascriptNode.disconnect();
      //self.calculatePitches();
    }

    function drawGraph(arr) {
      var chart = new dhtmlXChart({
        view: "spline",
        container: "chart",
        value: "#data0#",
        item: {
          borderColor: "#1293f8",
          color: "#ffffff"
        },
        line: {
          color: "#1293f8",
          width: 1
        },
        offset: 0,
        yAxis: {
          start: -100,
          end: 100,
          step: 0.001,
          template: function (obj) {
            return (obj % 20 ? "" : obj);
          }
        }
      });
      chart.parse(arr, "jsarray");
    }


    self.extractHigherValueFrequency = function(frequencyByteData, fourierFastTransformSize, sampleRate) {
      var higherValue = 0;
      var position = 0;
      var energy = 0;
      // Search for the frequency with the higher value
      for (var x = 0; x < frequencyByteData.length; x++) {
        energy += frequencyByteData[x];
        if (frequencyByteData[x] > higherValue) {
            higherValue = frequencyByteData[x];
            position = x;
        }
      }

      energy = energy / frequencyByteData.length;
      var frequency = self.calculateFrequency(position, sampleRate, fourierFastTransformSize);
      return {"frequency": frequency, "position": position, "value": higherValue, "signalEnergy": energy};
    };

    self.extractSecondaryPeaks = function(array, maxValue, fourierFastTransformSize, sampleRate) {
      //var threshold = maxValue * SECONDARY_PEAKS_PERCENTAGE;
      var threshold = maxValue * SECONDARY_PEAKS_PERCENTAGE;
      var secondaryPeaksArray = [];
      var lastValue = 0;
      var goingUp = false;
      for (var x = 0; x < array.length; x++) {
        if (array[x] >= lastValue) {
          goingUp = true;
        } else {
          if (goingUp) { // This is a maximum
            if (x > 0 && array[x - 1] >=  threshold) { // Important peak
              var position = 0;
              if (array[x - 1] * SAME_FREQUENCY_THRESHOLD <= array[x]) { // Two consecutive important peaks
                position = x - 0.5;
              } else if (x > 1 && array[x - 1] * SAME_FREQUENCY_THRESHOLD <= array[x - 2]) {
                position = x - 1.5;
              } else {
                position = x - 1;
              }

              var frequency = self.calculateFrequency(position, sampleRate, fourierFastTransformSize);
              secondaryPeaksArray.push({"value": array[x - 1], "frequency": frequency});
            }
            
            goingUp = false;
          }
        }

        lastValue = array[x];
      }

      return secondaryPeaksArray;
    };

    self.calculateFrequency = function (position, sampleRate, fourierFastTransformSize) {
        return position * (sampleRate / fourierFastTransformSize);
    };

    self.calculatePosition = function (frequency, sampleRate, fourierFastTransformSize) {
        return frequency * ( fourierFastTransformSize / sampleRate);
    };

    self.removeNoise = function (array) {
      for (var i = 0; i < array.length; i ++) {
        var result = array[i] - self.noiseArray[i];
        if (result < 0) {
          array[i] = 0;
        } else {
          array[i] = result;
        }
      }
    }

    function checkSampleEnergy(sampleEnergy, signalEnergy, totalSamples) { 
      var averageEnergy = signalEnergy / totalSamples;
      return sampleEnergy > 5 * averageEnergy;
    }

    self.findNoteByFrequency = function(frequency) {
      return ChromaticPitch.getPitchNumberByFrequency(frequency);
        // var currentFrequencySlot = 0;
        // var nextFrequencySlot = 0;
        // var result;
        // for (var i in self.absNotesFrequencies) {
        //   var freqNumberSlot = parseInt(i, 10);

        //   if (currentFrequencySlot != 0) { // Used to get the value of the following freq
        //     nextFrequencySlot = freqNumberSlot;
        //     break;
        //   }

        //   if (freqNumberSlot > frequency) {
        //     currentFrequencySlot = freqNumberSlot
        //   }
        // }

        // if (nextFrequencySlot != 0) {
        //   if ((nextFrequencySlot + currentFrequencySlot) / 2 > frequency) {
        //     result = nextFrequencySlot;
        //   } else {
        //     result = currentFrequencySlot;
        //   }
        // } else { // Last possible frequency
        //   result = currentFrequencySlot;
        // }


        // return result;
    };

    self.addPitch = function (pitch) {
      if (self.arrayOfNotes.length > 0) {
        var lastNote = self.arrayOfNotes[self.arrayOfNotes.length - 1];
        if (lastNote.pitch == pitch) {
          lastNote.duration ++;
          return;
        } 
      }

      self.arrayOfNotes.push({"pitch": pitch, "duration": 1});
    }

    self.arrayOfSamples = [];
    self.saveSamples = function (higherValueFrequency, secondaryPeaks) {
      self.arrayOfSamples.push({"mainPeak": higherValueFrequency, "arrayOfPeaks": secondaryPeaks, "isNoise": false});
      self.samplesCounter(self.samplesCounter()+1);
    };

    self.addNoiseSample = function () {
      self.arrayOfSamples({"isNoise": true});
    };

    self.initAudioRecording = function () {
      if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      if (!navigator.cancelAnimationFrame)
        navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
      if (!navigator.requestAnimationFrame)
        navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

      var analyser;
      var microphone;
      var ctx;

      self.arrayOfNotes = [];
      
      canvas = document.getElementById('resultCanvas');
      contextCanvasFinal =  canvas.getContext('2d');
      
      //self.javascriptNode = self.audioContext.createJavaScriptNode(SAMPLE_SIZE, 1, 1);
      var noiseCounter = 0;
      var noiseMatrix = [];

      function updateAnalysers(time) {

        if (!self.drawContext) {
          self.drawCanvas = document.getElementById("testCanvas");
          self.drawContext = self.drawCanvas.getContext("2d");
        }

        self.drawContext.clearRect(0, 0, WIDTH, HEIGHT);
        if (frequenciesToAnalyze) {
          for (var i = 0; i < frequenciesToAnalyze.length; i++) {
            var value = frequenciesToAnalyze[i];
            var percent = value / 256;
            var height = HEIGHT * percent;
            var offset = HEIGHT - height - 1;
            var barWidth = WIDTH / frequenciesToAnalyze.length;
            var hue = i / frequenciesToAnalyze.length * 360;

            self.drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
            self.drawContext.fillRect(i * barWidth, offset, barWidth, height);
          }


        }

          // // analyzer draw code here
          // {
          //     var SPACING = 3;
          //     var BAR_WIDTH = 1;
          //     var numBars = Math.round(canvasWidth / SPACING);
          //     var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

          //     analyserNode.getByteFrequencyData(freqByteData); 

          //     analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
          //     analyserContext.fillStyle = '#F6D565';
          //     analyserContext.lineCap = 'round';
          //     var multiplier = analyserNode.frequencyBinCount / numBars;

          //     // Draw rectangle for each frequency bin.
          //     for (var i = 0; i < numBars; ++i) {
          //         var magnitude = 0;
          //         var offset = Math.floor( i * multiplier );
          //         // gotta sum/average the block, or we miss narrow-bandwidth spikes
          //         for (var j = 0; j< multiplier; j++)
          //             magnitude += freqByteData[offset + j];
          //         magnitude = magnitude / multiplier;
          //         var magnitude2 = freqByteData[i * multiplier];
          //         analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
          //         analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
          //     }
          // }
          
          rafID = window.requestAnimationFrame( updateAnalysers );
      }


      navigator.getUserMedia({audio: true}, function (stream) {
        ctx = self.audioContext;

        // Create the filter
        var filter = ctx.createBiquadFilter();
        // Create and specify parameters for the low-pass filter.
        filter.type = "lowshelf"; // High-pass filter. See BiquadFilterNode docs
        filter.frequency.value = 200; 
        filter.gain.value = -40;

       // var snd = new Audio("/sounds/pianoShort.m4a"); 
        //snd.play();

        var microphoneSource = ctx.createMediaStreamSource(stream);
        var analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 2048;

        microphoneSource.connect(filter);
        filter.connect(analyserNode);


        //var res = 2048;
        var res = 4096;

        var javascriptNodeAutocorrelation = null;
        var javascriptNode = null;
        if (USE_FFT) {
          javascriptNode = ctx.createScriptProcessor(res, 1, 1);
          analyserNode.connect(javascriptNode);
          freqByteData = new Uint8Array(analyserNode.frequencyBinCount); 
          var maxPositionToDetect = self.calculatePosition(MAX_FREQUENCY, self.audioContext.sampleRate, analyserNode.fftSize);
          maxPositionToDetect = Math.ceil(maxPositionToDetect);

          updateAnalysers();

          contextCanvasFinal.beginPath();
          contextCanvasFinal.moveTo(0, 300);
          javascriptNode.connect(ctx.destination);
        } else {
          javascriptNodeAutocorrelation = ctx.createScriptProcessor(res, 1, 1);
          microphoneSource.connect(javascriptNodeAutocorrelation);
          javascriptNodeAutocorrelation.connect(ctx.destination);

        }



        // binding the callback to window to avoid the GC to clean it
        // https://bugzilla.mozilla.org/show_bug.cgi?id=916387
        if (USE_FFT) {
          javascriptNode.onaudioprocess = window.audioProcess = function() {

            analyserNode.getByteFrequencyData(freqByteData);

            frequenciesToAnalyze = freqByteData.subarray(0, maxPositionToDetect);

            if (noiseCounter < TOTAL_NOISE) {
              noiseMatrix.push(frequenciesToAnalyze.subarray(0));
            } else {

              self.removeNoise(frequenciesToAnalyze);
              var higherValueFrequency = self.extractHigherValueFrequency(frequenciesToAnalyze, analyserNode.fftSize, self.audioContext.sampleRate);
              var p = ChromaticPitch.getPitchNumberByFrequency(higherValueFrequency.frequency)
              contextCanvasFinal.lineTo(self.samplesCounter(), 2 * (150 - p));
              contextCanvasFinal.stroke();

              var secondaryPeaks = self.extractSecondaryPeaks(frequenciesToAnalyze, higherValueFrequency.value, analyserNode.fftSize, self.audioContext.sampleRate);

              if (!checkSampleEnergy(higherValueFrequency.value, higherValueFrequency.signalEnergy, frequenciesToAnalyze.length)) {
                self.works("IS IT WORKING?: NO"); // not used now
                self.addNoiseSample();

              } else {

                if (self.isRecording) {
                  //self.addPitch(pitch);
                  self.saveSamples(higherValueFrequency, secondaryPeaks);
                  //console.log(pitch);
                }


                var pitch = self.findNoteByFrequency(secondaryPeaks[0].frequency);

                self.works("IS IT WORKING?: YES!!");
                self.maxValue("Max Value: " + higherValueFrequency.frequency.toString());
                self.position("Position: " + higherValueFrequency.position.toString());
                self.position2("Position2!!: " + secondaryPeaks[0].frequency.toString());
                self.pitch2("pitch2!!: " + ChromaticPitch.getPitchNumberByFrequency(secondaryPeaks[0].frequency));
                self.value("Value: " + higherValueFrequency.value.toString());
                self.pitch("Pitch: " + pitch.toString());
                self.signalEnergy("Signal Energy: " + higherValueFrequency.signalEnergy.toString());


                //draw code
                // var drawCanvas = document.getElementById("testCanvas");
                // var drawContext = drawCanvas.getContext("2d");
                // var HEIGHT = 400;
                // var WIDTH = 600;

                var arrayToDraw = frequenciesToAnalyze;

                //draw code
                // var drawCanvas = document.getElementById("testCanvas");
                // var drawContext = drawCanvas.getContext("2d");
                // var HEIGHT = 400;
                // var WIDTH = 600;
                // drawContext.clearRect(0, 0, WIDTH, HEIGHT);
                // for (var i = 0; i < arrayToDraw.length; i++) {
                //   var value = arrayToDraw[i];
                //   var percent = value / 256;
                //   var height = HEIGHT * percent;
                //   var offset = HEIGHT - height - 1;
                //   var barWidth = WIDTH / arrayToDraw.length;
                //   var hue = i / arrayToDraw.length * 360;

                //   drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
                //   drawContext.fillRect(i * barWidth, offset, barWidth, height);
                // }
              }
            }

            noiseCounter++;
            if (noiseCounter == TOTAL_NOISE) {
              var averageNoise;
              for (var q = 0; q < noiseMatrix[0].length; q++) {
                averageNoise = 0;
                for (var r = 0; r < TOTAL_NOISE; r++) {
                  averageNoise += noiseMatrix[r][q];
                }

                averageNoise = averageNoise / TOTAL_NOISE;
                self.noiseArray.push(averageNoise);
              }
            }

          }
        }

        if (!USE_FFT) {

          var drawCanvas = document.getElementById("testCanvas");
          var drawContext = drawCanvas.getContext("2d");
          var HEIGHT = 400;
          var WIDTH = 600;

          javascriptNodeAutocorrelation.onaudioprocess = window.audioProcess = function (e) {
            var audioData = e.inputBuffer.getChannelData(0);
            
            // Smooth the signal
            for (var i = 1; i < audioData.length; i ++) {
              audioData[i - 1] = (audioData[i] + audioData[i - 1]) / 2;
            }

            // Hann window
            var audioDataLength = audioData.length;
            for (var i = 0; i < audioDataLength; i ++) {
              audioData[i] =  audioData[i] * self.hannWindow(i, audioDataLength);
            }

            var absoluteArray = absoluteValue(audioData);
            //self.currentEnergy = calculateSignalEnergy(absoluteArray)
            //self.autocorrelationArray = calculateAutocorrelation(absoluteArray, self.currentEnergy);
            var acf = calculateAutocorrelation(absoluteArray);
            var amdf = calculateAMDF(absoluteArray);

            self.autocorrelationArray = calculateMixedAcfAmdf(acf, amdf);


            //self.autocorrelationArray = self.autocorrelationArray.splice(Math.ceil(self.autocorrelationArray.length / 2));
            var arrayToDraw = self.autocorrelationArray;

            for (var i = 0; i < arrayToDraw.length; i++) {
              var value = arrayToDraw[i];
              var percent = value / 256;
              var height = HEIGHT * percent;
              var offset = HEIGHT - height - 1;
              var barWidth = WIDTH / arrayToDraw.length;
              var hue = i / arrayToDraw.length * 360;

              drawContext.clearRect(i * barWidth, 0, barWidth, HEIGHT);
              drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
              drawContext.fillRect(i * barWidth, offset, barWidth, height);
            }

            var periodicity = getPeriodicity(self.autocorrelationArray);
            if (periodicity) {
              //console.log("periodicity: " + 44100 / periodicity);
              self.position(44100 / periodicity.differenceInSamples);
            } else {
              self.position("NULL");
            }

      //   // self.getNoiseAmplitude(self.currentEnergy);
      //   // var freq = -1;
      //   // if (periodicity !== null && self.noiseEnergy.ready && isAmplitudeEnough(self.currentEnergy, self.noiseEnergy.value)) {
      //   //   freq = 44100 / (periodicity.differenceInSamples * 4);
      //   // }

      //   // var confidence = periodicity !== null ? periodicity.confidence : 0;
      //   // getNoteFromFrequency(freq, confidence);

      //   // 
          }
        }

     




        // self.ready("WAIT!!!");
        // self.recordingStream = stream;
        // microphone = ctx.createMediaStreamSource(stream);
        // //analyser = ctx.createAnalyser();
        // //analyser2 = ctx.createAnalyser();
        // //microphone.connect(analyser);
        // microphone.connect(self.javascriptNode);
        // //analyser2.connect(self.javascriptNode);
        // self.javascriptNode.connect(ctx.destination);
        // // microphone.connect(or);
        // //processor.connect(ctx.destination);

        // // analyser.connect(ctx.destination);
        // // process();
      }, function(){});



      // self.javascriptNode.onaudioprocess = function (e) {
      //   var audioData = e.inputBuffer.getChannelData(0);
        
      //   for (var i = 0; i < audioData.length; i++) {
      //     var value = audioData[i]* 300 + 40;
      //     var percent = value / 256;
      //     var height = HEIGHT * percent;
      //     var offset = HEIGHT - height - 1;
      //     var barWidth = WIDTH/audioData.length;
      //     var hue = i/audioData.length * 360;

      //     drawContext.clearRect(i * barWidth, 0, barWidth, HEIGHT);
      //     drawContext.fillStyle = 'black';
      //     drawContext.fillRect(i * barWidth, offset, 1, 1);
      //   }
      //   var absoluteArray = absoluteValue(audioData);
      //   self.currentEnergy = calculateSignalEnergy(absoluteArray)
      //   self.autocorrelationArray = calculateAutocorrelation(absoluteArray, self.currentEnergy);




      //   // var periodicity = getPeriodicity(self.autocorrelationArray);
      //   // self.getNoiseAmplitude(self.currentEnergy);
      //   // var freq = -1;
      //   // if (periodicity !== null && self.noiseEnergy.ready && isAmplitudeEnough(self.currentEnergy, self.noiseEnergy.value)) {
      //   //   freq = 44100 / (periodicity.differenceInSamples * 4);
      //   // }

      //   // var confidence = periodicity !== null ? periodicity.confidence : 0;
      //   // getNoteFromFrequency(freq, confidence);

      //   // self.position(freq);
      // }
    }

    self.getNoiseAmplitude = function(currentEnergy) {
      if (!self.noiseEnergy.ready) {
        if (currentEnergy !== 0) {
          self.noiseEnergy.totalSamples ++;
          self.noiseEnergy.value += currentEnergy;
        }

        if (self.noiseEnergy.totalSamples == NOISE_MAX_SAMPLES) {
          self.noiseEnergy.ready = true;
          self.noiseEnergy.value = self.noiseEnergy.value / self.noiseEnergy.totalSamples;
          self.ready("GO!");
        }
      }
    };

    self.hannWindow = function (i, size) {
      return 0.5 * (1 - Math.cos(2 * Math.PI * i / (size - 1)));
    }

  }
}());