define(['core/model', 'text!./monitor.html', 'core/pluginapi', 'core/widgets/log', 'css!./monitor.css'], function(model, template, api, log, css){

	var ko = api.ko;
	var sbt = api.sbt;

	var monitorConsole = api.PluginWidget({
		id: 'play-monitor-widget',
		template: template,
		init: function(parameters){
			var self = this

			this.title = ko.observable("Monitor");

			this.atmosLink = model.snap.app.atmosLink;
			this.atmosCompatible = model.snap.app.hasConsole;
			this.runningWithAtmos = ko.computed(function() {
				return model.snap.app.haveActiveTask() && this.atmosLink() != '' && model.snap.signedIn();
			}, this);
			this.runningWithoutAtmosButEnabled = ko.computed(function() {
				return model.snap.app.haveActiveTask() && this.atmosLink() == '' && model.snap.signedIn() && model.snap.app.runInConsole();
			}, this);
			this.runningWithoutAtmosBecauseDisabled = ko.computed(function() {
				return model.snap.app.haveActiveTask() && this.atmosLink() == '' && model.snap.signedIn() && !model.snap.app.runInConsole();
			}, this);
			this.notSignedIn = ko.computed(function() {
				return !model.snap.signedIn();
			}, this);
			this.notRunningAndSignedInAndAtmosEnabled = ko.computed(function() {
				return !model.snap.app.haveActiveTask() && model.snap.app.runInConsole() && model.snap.signedIn();
			}, this);
			this.notRunningAndSignedInAndAtmosDisabled = ko.computed(function() {
				return !model.snap.app.haveActiveTask() && !model.snap.app.runInConsole() && model.snap.signedIn();
			}, this);
		},
		restartWithAtmos: function(self) {
			model.snap.app.runInConsole(true);
		},
		restartWithoutAtmos: function(self) {
			model.snap.app.runInConsole(false);
		},
		enableAtmos: function(self) {
			model.snap.app.runInConsole(true);
		},
		disableAtmos: function(self) {
			model.snap.app.runInConsole(false);
		},
		showLogin: function(self) {
			$('#user').addClass("open");
		}
	});

	return api.Plugin({
		id: 'monitor',
		name: "Monitor",
		icon: "▶",
		url: "#monitor",
		routes: {
			'monitor': function() { api.setActiveWidget(monitorConsole); }
		},
		widgets: [monitorConsole]
	});
});
