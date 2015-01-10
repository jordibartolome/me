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
				backgroundColor: "#e8d5d5",
				letterColor: "black"
			},
			{
				name: "music21",
				logoUrl: "/images/music21.png",
				description: "blablb bf lbf lbfa lbf lbfabf lbfs lbfs lbfd lsdfg",
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