var Detector = {};

(function() {
	'use strict';

	var WIDTH = 500;
	var HEIGHT = 300;
	var USE_FFT = true;
	var TOTAL_NOISE = 10;
  var SECONDARY_PEAKS_PERCENTAGE = 0.4;
  var SAME_FREQUENCY_THRESHOLD = 0.9;

	Detector.App = function () {
		var self = this;
		var canvas = null;
		var context;
		var ctx;
    var freqByteData = null;
    var zeroGain = null;
    var frequenciesToAnalyze = null;
    var noiseCounter = 0;
    var noiseMatrix = [];
    self.noiseArray = [];

	                self.works = ko.observable("start");
	                self.maxValue = ko.observable();
	                self.position = ko.observable();
	                self.position2 = ko.observable();
	                self.value = ko.observable();
	                self.signalEnergy = ko.observable();

    	window.AudioContext = window.AudioContext || window.webkitAudioContext;
    	self.audioContext = new AudioContext();

		self.initialize = function () {
			self.initAudioRecording();

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

	    self.initAudioRecording = function () {
	      if (!navigator.getUserMedia)
	        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	      if (!navigator.cancelAnimationFrame)
	        navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
	      if (!navigator.requestAnimationFrame)
	        navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

	      var analyser;
	      var microphone;
		  var rafID = null;

	      self.arrayOfNotes = [];
	      
	      // canvas = document.getElementById('canvas');
	      // context =  canvas.getContext('2d');


	      function updateAnalysers(time) {
	        if (!self.drawContext) {
	          self.drawCanvas = document.getElementById("canvas");
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
	          
	          rafID = window.requestAnimationFrame( updateAnalysers );
	      }

    self.calculateFrequency = function (position, sampleRate, fourierFastTransformSize) {
        return position * (sampleRate / fourierFastTransformSize);
    };

    function checkSampleEnergy(sampleEnergy, signalEnergy, totalSamples) { 
      var averageEnergy = signalEnergy / totalSamples;
      return sampleEnergy > 5 * averageEnergy;
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

	      navigator.getUserMedia({audio: true}, function (stream) {
	        ctx = self.audioContext;

	        // Create the filter
	        var filter = ctx.createBiquadFilter();
	        // Create and specify parameters for the low-pass filter.
	        filter.type = "lowshelf"; // High-pass filter. See BiquadFilterNode docs
	        filter.frequency.value = 200; 
	        filter.gain.value = -40;

	        var microphoneSource = ctx.createMediaStreamSource(stream);
	        var analyserNode = ctx.createAnalyser();
	        analyserNode.fftSize = 2048;

	        microphoneSource.connect(filter);
	        filter.connect(analyserNode);

	        var res = 2048;
	        //var res = 4096;

	        var javascriptNodeAutocorrelation = null;
	        var javascriptNode = null;
	        if (USE_FFT) {
	          javascriptNode = ctx.createScriptProcessor(res, 1, 1);
	          analyserNode.connect(javascriptNode);
	          freqByteData = new Uint8Array(analyserNode.frequencyBinCount); 
	          //var maxPositionToDetect = self.calculatePosition(MAX_FREQUENCY, self.audioContext.sampleRate, analyserNode.fftSize);
	          //maxPositionToDetect = Math.ceil(maxPositionToDetect);

	          updateAnalysers();
	          javascriptNode.connect(ctx.destination);
	        } else {
	          javascriptNodeAutocorrelation = ctx.createScriptProcessor(res, 1, 1);
	          microphoneSource.connect(javascriptNodeAutocorrelation);
	          javascriptNodeAutocorrelation.connect(ctx.destination);
	        }


	        if (USE_FFT) {
	          javascriptNode.onaudioprocess = window.audioProcess = function() {

	            analyserNode.getByteFrequencyData(freqByteData);

	            frequenciesToAnalyze = freqByteData;// freqByteData.subarray(0, maxPositionToDetect);

	            if (noiseCounter < TOTAL_NOISE) {
	              noiseMatrix.push(frequenciesToAnalyze.subarray(0));
	            } else {

	              self.removeNoise(frequenciesToAnalyze);
	              var higherValueFrequency = self.extractHigherValueFrequency(frequenciesToAnalyze, analyserNode.fftSize, self.audioContext.sampleRate);

	              var secondaryPeaks = self.extractSecondaryPeaks(frequenciesToAnalyze, higherValueFrequency.value, analyserNode.fftSize, self.audioContext.sampleRate);

	              if (!checkSampleEnergy(higherValueFrequency.value, higherValueFrequency.signalEnergy, frequenciesToAnalyze.length)) {
	                self.works("IS IT WORKING?: NO"); // not used now
	                //self.addNoiseSample();

	              } else {

	                if (self.isRecording) {
	                  //self.addPitch(pitch);
	                  self.saveSamples(higherValueFrequency, secondaryPeaks);
	                  //console.log(pitch);
	                }


	                self.works("IS IT WORKING?: YES!!");
	                self.maxValue("Max Value: " + higherValueFrequency.frequency.toString());
	                self.position("Position: " + higherValueFrequency.position.toString());
	                self.position2("Position2!!: " + secondaryPeaks[0].frequency.toString());
	                self.value("Value: " + higherValueFrequency.value.toString());
	                self.signalEnergy("Signal Energy: " + higherValueFrequency.signalEnergy.toString());

	                var arrayToDraw = frequenciesToAnalyze;

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

	          }
	        }

	      }, function(){});


		}

	}
}());


$(document).ready(function() {
	Detector.app = new Detector.App();
	Detector.app.initialize();
	ko.applyBindings(Detector.app);
});