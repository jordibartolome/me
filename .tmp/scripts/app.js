// This is the main javascript. It is the base for anything.
var Me = {};

(function() {
	'use strict';

	var SCROLL_Y_MARGIN = 10;

	Me.App = function () {
		var self = this;
		self.top = ko.observable(true);

		var navBarItems = [
			{
				title: "Home",
				id: "home"
			},
			{
				title: "Projects",
				id: "projects"
			},
			{
				title: "Resume",
				id: "resume"
			},
			{
				title: "Hobbies",
				id: "hobbies"
			},
			{
				title: "Contact",
				id: "contact"
			}
		]

		self.navBar = ko.observable(new Me.NavBar());
		navBarItems.forEach(function (item) {
			self.navBar().items.push(new Me.NavItemViewModel(item));
		});

		self.projects = ko.observableArray([]);
		var projects = [
			{
				name: "Noteflight",
				logoUrl: "/images/noteflight.png",
				description: "blablb bffa lbf lbfabf lbasdgfasd fa sdasdjfn dsaf dkf dkj dfaskja dsfkjasd fjkasd fkjasd fkjasd fkjasd faskjdf askdjf askdjf sakjdf sadkjf asdjkf asdkjf asdkjf asdkfja sdfkja sdfkjasd fakjsdf adskjf asdkjf askf askjf adskj askjf asdkjf askjdf asdkjf asdkfja sdfkjas dfkjasd fkjsadfasdfd asfad fad fda fadsfs lbfs lbfd lsdfglbfabf lbasdgfasd fa sdfd asfad fad fda fadsfs lbfs lbfd lsdfg",
				link: "http://www.noteflight.com",
				backgroundColor: "rgba(231, 229, 206, 0.44)",
				letterColor: "black"
			},
			{
				name: "Whatameal",
				logoUrl: "/images/whatameal.png",
				description: "blablb bf lbf lbfa lbf lbfabfasdfasfgaf adsfg gads gaf gadg asdgads  asd gdsa gdsagdsa lbfs lbfs lbfd lsdfg",
				link: "http://www.whatameal.com",
				backgroundColor: "rgba(229, 93, 42, 0.29)",
				letterColor: "black"
			},
			{
				name: "Volotea",
				logoUrl: "/images/volotea.png",
				description: "blablb bf lbf lbfa lbf lbfabf lbfs lbfs lbfd lsdfg",
				link: "http://www.volotea.com/en",
				backgroundColor: "rgba(63, 9, 66, 0.28)",
				letterColor: "black"
			},
			{
				name: "jordibartolome.io",
				logoUrl: "/images/jordibartolome.png",
				description: "blablb bf lbf lbfa lbf lbfabf lbfs lbfs lbfd lsdfg",
				link: "/",
				backgroundColor: "red",
				letterColor: "black"
			},
			{
				name: "music21",
				logoUrl: "/images/music21.png",
				description: "blablb bf lbf lbfa lbf lbfabf lbfs lbfs lbfd lsdfg",
				link: "/",
				backgroundColor: "rgba(0, 0, 0, 0.11)",
				letterColor: "black"
			}
		];

		projects.forEach(function (projectInfo) {
			self.projects.push(new Me.ProjectViewModel(projectInfo));
		});


		self.jobs = ko.observableArray([
			{
				title: "Web developer",
				company: "Noteflight",
				link: "http://www.noteflight.com",
				city: "Boston, MA, United States",
				startDate: "November 2013",
				endDate: "today",
				description: "here the description",
				bullets: [
					{
						bullet: "bull 1"
					},
					{
						bullet: "bull 2!!!! akjsdfajksdf afdsjkfadsjkadfs"
					}
				]
			},
			{
				title: "Web developer",
				company: "Newshore",
				link: "http://www.newshore.es",
				city: "Barcelona, Catalonia",
				startDate: "May 2012",
				endDate: "October 2013",
				description: "here the description",
				bullets: [
					{
						bullet: "bull 1"
					},
					{
						bullet: "bull 2!!!! akjsdfajksdf afdsjkfadsjkadfs"
					}
				]
			},
			{
				title: "Consultant",
				company: "Better Consultants",
				link: "http://www.betterconsultants.es",
				city: "Barcelona, Catalonia",
				startDate: "October 2011",
				endDate: "May 2012",
				description: "here the description",
				bullets: [
					{
						bullet: "bull 1"
					},
					{
						bullet: "bull 2!!!! akjsdfajksdf afdsjkfadsjkadfs"
					}
				]
			},
			{
				title: "Researcher",
				company: "Massachusetts Institute of Technology",
				link: "http://web.mit.edu/music21/",
				city: "Cambridge, MA, United States",
				startDate: "June 2011",
				endDate: "September 2011",
				description: "here the description",
				bullets: [
					{
						bullet: "bull 1"
					},
					{
						bullet: "bull 2!!!! akjsdfajksdf afdsjkfadsjkadfs"
					}
				]
			}
		]);

		self.education = ko.observableArray([
			{
				title: "Telecommunications Engineering - BSc and MSc",
				university: "Polytechnic University of Catalonia",
				startDate: "2005",
				endDate: "2011",
				description: "bla bla bla v fs fds df fdsfds fdsasdf asd fas dfasdfasdf",
				bullets: []
			},
			{
				title: "Master thesis",
				university: "Pompeu Fabra University",
				startDate: "2011",
				endDate: "2011",
				description: "Alignment of the recording of a violin performance with its score",
				bullets: []
			},
			{
				title: "Music - violin",
				university: "Conservatori Municipal de Barcelona",
				startDate: "1999",
				endDate: "2006",
				description: "Violin, harmony, orquestra... lots of things!",
				bullets: []
			},
		]);

		self.languages = ko.observableArray([
			{
				language: "Catalan",
				level: "Native"
			},
			{
				language: "Spanish",
				level: "Native"
			},
			{
				language: "English",
				level: "Professional working proficiency"
			}
		]);

		self.socialNetworks = ko.observableArray([]);
		var socialNetworks = [
			{
				className: "fa fa-fw fa-at",
				link: "mailto:jordi.bartolome.guillen@gmail.com"
			},
			{
				className: "fa fa-fw fa-linkedin",
				link: "https://www.linkedin.com/pub/jordi-bartolom%C3%A9-guill%C3%A9n/35/667/533"
			},
			{
				className: "fa fa-fw fa-github",
				link: "https://github.com/jordibartolome"
			},
			{
				className: "fa fa-fw fa-twitter",
				link: "https://www.twitter.com/jordibartolome"
			},
			{
				className: "fa fa-fw fa-youtube",
				link: "https://www.youtube.com/user/tubasu"
			},
			{
				className: "fa fa-fw fa-google-plus",
				link: "https://plus.google.com/+JordiBartolom%C3%A9Guill%C3%A9n/posts"
			}
			

		];

		socialNetworks.forEach(function (value) {
			self.socialNetworks.push(new Me.SocialNetworkViewModel(value));
		});

        function scroll () {
            // var backgroundPosition = window.scrollY / 3;
            // var str = "0px " + backgroundPosition + "px";
            // $("#homePicture").css("background-position", str);
            self.top(window.scrollY == 0);
            self.navBar().highlightElement();

        }

		self.initialize = function () {
            $(window).on("scroll", scroll);
		};

	};

	Me.NavBar = function () {
		var self = this;
		self.items = ko.observableArray([]);

		self.highlightElement = function () {
			var currentY = window.scrollY;
			var found = false;
			for (var i = self.items().length - 1; i >= 0; i--) {
				var sectionY = $("#" + self.items()[i].id).position().top - SCROLL_Y_MARGIN;
				if (sectionY <= currentY && !found) {
					self.items()[i].selected(true);
					found = true;
				} else {
					self.items()[i].selected(false);
				}

			}
		};
	};

	Me.NavItemViewModel = function (item) {
		var self = this;
		self.title = ko.observable(item.title);
		self.id = item.id;
		self.selected = ko.observable(false);

		self.scrollTo = function () {
			$('html,body').animate({
				scrollTop: ($("#" + self.id).position().top - SCROLL_Y_MARGIN) +'px'},
				'slow');
		};
	};

	Me.ProjectViewModel = function (info) {
		var self = this;
		self.showBack = ko.observable(false);
		self.info = ko.observable(info);

		self.redirect = function () {
			window.open(self.info().link, '_blank');
		};

		self.showDescription = function () {
			self.showBack(true);
		};

		self.hideDescription = function () {
			self.showBack(false);
		};
	};

	Me.SocialNetworkViewModel = function (info) {
		var self = this;
		self.info = info;

		self.redirect = function () {
			window.open(self.info.link, '_blank');
		};
	};
}());


$(document).ready(function() {
	Me.app = new Me.App();
	Me.app.initialize();
	ko.applyBindings(Me.app);
});




// var gamell2 = (function($, window){

// 	var worldMapRotating = false;

// 	var MOBILE_FALLBACK_MESSAGE = 'You are viewing a limited version of the site, please use a desktop browser to enjoy a much better experience.';
// 	var UNSUPPORTED_BOWSER_FALLBACK_MESSAGE = 'You are using an <strong>unsupported</strong> browser. Please <a href="http://browsehappy.com/">use a supported browser</a> - Chrome, Firefox or Safari - to improve your experience.';

// 	var RESUME_URL = "http://gamell.io/media/resume-joan-gamell.pdf"; 

// 	var SPRITE_URL = "/sprite.png";

// 	var DEFERRED_SCRIPTS = "/scripts/deferred/deferred.js";

// 	var DEFERRED_SCRIPTS = ['scripts/tipsy/src/javascripts/jquery.tipsy.js',
// 							'bower_components/d3/d3.js', 
// 							'bower_components/queue-async/queue.js', 
// 							'bower_components/topojson/topojson.js', 
// 							'scripts/infographics/sunburst.js',
// 							'scripts/infographics/world-map.js'];
// 							//'scripts/infographics/timeline.js'];
// 	// 	var setupAnimate = function(){
// 	$('.animate').textillate({
// 		  // the default selector to use when detecting multiple texts to animate
// 		  selector: '.texts',
// 		  // enable looping
// 		  loop: false,
// 		  // sets the minimum display time for each text before it is replaced
// 		  minDisplayTime: 2000,
// 		  // sets the initial delay before starting the animation
// 		  // (note that depending on the in effect you may need to manually apply 
// 		  // visibility: hidden to the element before running this plugin)
// 		  initialDelay: 0,
// 		  // set whether or not to automatically start animating
// 		  autoStart: true,

// 		  // in animation settings
// 		  in: {
// 		    // set the effect name
// 		    effect: 'fadeInDownBig',
// 		    // set the delay factor applied to each consecutive character
// 		    delayScale: 2,
// 		    // set the delay between each character
// 		    delay: 70,
// 		    // set to true to animate all the characters at the same time
// 		    sync: false,
// 		    // randomize the character sequence 
// 		    // (note that shuffle doesn't make sense with sync = true)
// 		    shuffle: true
// 		  }
// 		});
// 	};

// 	var loadDeferredScript = function(deferredPromise, index){
// 		if(index < DEFERRED_SCRIPTS.length){
// 			$.getScript(DEFERRED_SCRIPTS[index]).done(function(){
// 				loadDeferredScript(deferredPromise, index+1);
// 			});
// 		} else {
// 			deferredPromise.resolve("hurray");
// 		}
// 	}

// 	var loadDeferredScripts = function(){
// 		if(DEFERRED_SCRIPTS instanceof Array){
// 			var deferredPromise = new jQuery.Deferred();
// 			loadDeferredScript(deferredPromise,0);
// 			return deferredPromise.promise();
// 		} else {
// 			return $.getScript(DEFERRED_SCRIPTS);
// 		}
		
// 	};

// 	var initTooltip = function(){

// 		var tipsyCommonConfig = {html: true, fade: true};
// 		$("span.dropbox-success").tipsy($.extend({},tipsyCommonConfig,{gravity:"n", trigger:"manual"}));
// 		$('#resume-formal .custom-header h2 a').tipsy($.extend({},tipsyCommonConfig));
// 		$('#contact ul a').tipsy($.extend({},tipsyCommonConfig));

// 		$('.skills span.web').tipsy($.extend({},tipsyCommonConfig,{gravity:"s"}));
// 		$('.skills span.javascript').tipsy($.extend({},tipsyCommonConfig,{gravity:"s"}));
// 		$('.skills span.qc').tipsy($.extend({},tipsyCommonConfig,{gravity:"e"}));
// 		$('.skills span.other').tipsy($.extend({},tipsyCommonConfig,{gravity:"s"}));
// 		$('.skills span.project').tipsy($.extend({},tipsyCommonConfig,{gravity:"n"}));

// 	};

// 	var initQR = function(){ // function to load the images with the "rel" attribute
// 		$("img.needs-init").each(function(i, elem){
// 			$(elem).attr("src", $(elem).attr("rel"));	
// 		});
// 	};

// 	var initGithubButton = function(){
// 		// locally cached to avoid dns lookup and redirections from http://ghbtns.com/github-btn.html?user=gamell&repo=gamell.io&type=fork
// 		$(".github-button").html('<iframe src="github-btn.html?user=gamell&repo=gamell.io&type=fork" allowtransparency="true" frameborder="0" scrolling="0" width="62" height="20"></iframe>');
// 	};

// 	var initDropboxSaver = function(){	
// 		$("body").append('<script type="text/javascript" src="https://www.dropbox.com/static/api/1/dropins.js" id="dropboxjs" data-app-key="e7nb3h5uznhkmq9"></script>');
// 		$("#resume-formal .dropbox-button").bind("click",function(){
// 			try{
// 				var options = {
// 				    files: [
// 				        {
// 				            'filename': "Resume Joan Gamell.pdf",
// 				            'url': RESUME_URL
// 				        }
// 				    ],
// 				    success: dropboxSaveSuccess,
// 				    error: function(err) { alert("There was an error while saving the file to your dropbox: "+err); }
// 				};

// 				Dropbox.save(options);
// 			} catch(e){
// 				location.href = RESUME_URL;
// 			}
// 		});
// 	};

// 	var dropboxSaveSuccess = function(){
// 		var $dbSuccessTooltip = $("span.dropbox-success")
// 		$dbSuccessTooltip.tipsy("show");
// 		setTimeout(function(){
// 			$dbSuccessTooltip.tipsy("hide");	
// 		}, 3000);
// 	};

// 	var displayFallbackMessage = function(){
// 		var $messageContainer = $(".fallback-message p");
// 		if(!isImpressSupported() && $("body").hasClass('mobile')){
// 			$messageContainer.html(MOBILE_FALLBACK_MESSAGE);
// 		} else if(!isImpressSupported()){
// 			$messageContainer.html(UNSUPPORTED_BOWSER_FALLBACK_MESSAGE);
// 		}
// 	};

// 	var bindWorldMapRotation = function(){
// 		// setup the listener to init the world rotation
// 		if(window.location.hash === "#/resume-infographic-world-map" || !isImpressSupported() ){
// 			initWorldMapRotation();
// 		} else {
// 			$(window).on('hashchange',function(){ 
// 			    if(window.location.hash === "#/resume-infographic-world-map"){
// 			    	initWorldMapRotation();	
// 			    }
// 			});
// 		}
// 	};

// 	var bindInitQr = function(){
// 		// setup the listener to init the world rotation
// 		if(window.location.hash === "#/resume-formal" || !isImpressSupported() ){
// 			initQR();
// 		} else {
// 			$(window).on('hashchange',function(){ 
// 			    if(window.location.hash === "#/resume-formal"){
// 			    	initQR();	
// 			    }
// 			});
// 		}
// 	};

// 	var isImpressSupported = function(){
// 		return !$("body.impress-not-supported").length > 0;
// 	}

// 	var initWorldMapRotation = function(){
// 		if(!!worldMap && !worldMapRotating){
// 			worldMap.initRotation();
// 			worldMapRotating = true;
// 		}
// 	};

// 	var disablePrintingIfNotSupported = function(){
// 		if(!isImpressSupported()){
// 			$(".fa-print").hide();
// 		}
// 	};

// 	var initDeferredScripts = function(){
// 		initGithubButton();
// 		loadDeferredScripts().done(function(){
// 			initTooltip();
// 			bindWorldMapRotation();
// 			bindInitQr();
// 			initDropboxSaver();
// 		});
// 	};

// 	var initSprite = function(){
// 		$(".sprite").css("backgroundImage", "url("+SPRITE_URL+")");
// 	};

// 	var init = function(){

// 		impress().init();

// 		displayFallbackMessage();

// 		disablePrintingIfNotSupported();

// 		$(document).ready(function(){

// 			setupAnimate();
// 			$(window).load(function(){
// 				initDeferredScripts();
// 				initSprite();
// 			});

// 		});

// 	};

// 	init();

// })(jQuery, window);