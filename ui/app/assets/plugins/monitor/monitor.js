/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['text!./monitor.html', 'css!./monitor.css', 'main/pluginapi', 'commons/templates', './solutions/all' ], function(template, css, api, templates, solutions){

    var monitorPage = api.PluginWidget({
        id: 'monitor-page-screen',
        template: template,
        appVersion: window.serverAppVersion,
        init: function(config) {
            var self = this;
            this.selectedSolution = ko.observable(undefined);
            this.solutionTemplate = ko.observable(undefined);
            this.noSolutionChosen = ko.observable(true);
        },
        classInit: function(proto) {
            // Register trace tree template that is used in the deviation view
            $.each(solutions,function(key,value) {
                templates.registerTemplate(key, value);
            });
        },
        route: function(path) {
            if (path == undefined || $.trim(path).length == 0) {
                this.selectedSolution(undefined);
                this.solutionTemplate(undefined);
                this.noSolutionChosen(true);
            } else {
                this.selectedSolution(path);
                this.solutionTemplate(path+"-template");
                this.noSolutionChosen(false);
            }
        },
        isSelectedSolution: function(choice) {
            return choice == this.selectedSolution();
        }
    });

    return api.Plugin({
        id: 'monitor',
        name: "Monitor",
        icon: "",
        url: "#monitor",
        routes: {
            'monitor': function(path) {
                api.setActiveWidget(monitorPage);
                monitorPage.route(path.rest);
            }
        },
        widgets: [monitorPage]
    });
});
