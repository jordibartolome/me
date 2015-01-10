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
				description: "The future of online music notation",
				link: "http://www.noteflight.com",
				backgroundColor: "rgba(231, 229, 206, 0.44)",
				letterColor: "black"
			},
			{
				name: "Whatameal",
				logoUrl: "/images/whatameal.png",
				description: "Share and create recipes online",
				link: "http://www.whatameal.com",
				backgroundColor: "rgba(229, 93, 42, 0.29)",
				letterColor: "black"
			},
			{
				name: "Volotea",
				logoUrl: "/images/volotea.png",
				description: "A new European airline",
				link: "http://www.volotea.com/en",
				backgroundColor: "rgba(63, 9, 66, 0.28)",
				letterColor: "black"
			},
			{
				name: "jordibartolome.io",
				logoUrl: "/images/jordibartolome.png",
				description: "This site! Feel free to fork it on github.",
				link: "/",
				backgroundColor: "#e8d5d5",
				letterColor: "black"
			},
			{
				name: "music21",
				logoUrl: "/images/music21.png",
				description: "A toolkit for computed-aided musicology",
				link: "http://web.mit.edu/music21/",
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
				description: "Music online editor. HTML5, Javascript, AS3 and CSS.",
				bullets: [
					{
						bullet: "Development of the HTML5 editor. Extensive use of Knockout."
					},
					{
						bullet: "Real time music transcription."
					},
					{
						bullet: "Use of web audio API to improve audio performance."
					}
				]
			},
			{
				title: "Web consultant",
				company: "Newshore",
				link: "http://www.newshore.es",
				city: "Barcelona, Catalonia",
				startDate: "May 2012",
				endDate: "October 2013",
				description: "Development of www.volotea.com. A new European airline. Umbraco, .NET, Javascript and CSS.",
				bullets: [
					{
						bullet: "Designed part of the architecture of the Content Management System (CMS) and optimized the performance of the web."
					},
					{
						bullet: "Also designed different windows services and web services related to the website."
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
				description: "Development of software for the national police. Visual Basic, Cobol and SQL.",
				bullets: [
					{
						bullet: "Software analyzer and developer of Business Intelligence applications for the national police department."
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
				description: "Development of the music21 software. Use of Python.",
				bullets: [
					{
						bullet: "Participated in the “music21” project, a set of tools for helping scholars and other active listeners answer questions about music quickly and simply."
					},
					{
						bullet: "Developed a software that detects in real time, through audio and signal processing techniques, the note that a violinist plays and shows the score properly. Advisor: Dr. Michael Scott Cuthbert."
					},
					{
						bullet: "The results of this project were published in 'New applications to Score Following and feature extraction beyond MIDI', by J. Bartolomé and M.S. Cuthbert (NIPS 2011 – Music and Machine Learning Workshop. December 2011, Granada, Spain)"
					},
					{
						bullet: "Example of some developed applications <a class='regularLink' href='http://www.youtube.com/watch?v=h48hSl6syyw' target='_blank'>here</a>."
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
				description: "Relevant coursework: Programming, Signal Processing, Telematics, Mathematics, Physics and Electronics.",
				bullets: []
			},
			{
				title: "Master thesis",
				university: "Pompeu Fabra University",
				startDate: "2011",
				endDate: "2011",
				description: "Development of Master’s Thesis titled: 'Alignment of the recording of a violin performance with the corresponding musical score', consisting on the development of a software to process the audio signal and the movement of the bow, in order to find the notes played by a violinist. Advisor: Dr. Xavier Serra.",
				bullets: []
			},
			{
				title: "Music - violin",
				university: "Conservatori Municipal de Barcelona",
				startDate: "1999",
				endDate: "2006",
				description: "Violin, harmony, orchestra... lots of years, lots of things!",
				bullets: []
			},
		]);

		self.skills = ko.observableArray([
			{
				group: "Web Technologies",
				className: "webTechnologies skillsGroupWrapper",
				elements: ["HTML5", "CSS", "Web Services"]
			},
			{
				group: "Javascript Technologies",
				className: "jsTechnologies skillsGroupWrapper",
				elements: ["Javascript", "jQuery", "Knockout", "AJAX", "Web audio API"]
			},
			{
				group: "Programming Languages",
				className: "programmingLanguages skillsGroupWrapper",
				elements: ["Python", "Django", ".NET", "Java", "C#"]
			},
			{
				group: "Others",
				className: "others skillsGroupWrapper",
				elements: ["Jenkins", "SEO"]
			}
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
            self.top(window.scrollY <= 0);
            self.navBar().highlightElement();

        }

		self.initialize = function () {
            $(window).on("scroll", scroll);
            self.navBar().highlightElement();
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

			// Just in case the user scrolls to negative positions
			if (!found) {
				self.items()[0].selected(true);
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