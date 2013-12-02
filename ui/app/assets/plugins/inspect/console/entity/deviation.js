define(['text!./deviation.html', 'core/pluginapi', './../widget', './../format'], function(template, api, ConsoleWidget, formatter) {
    var ko = api.ko;
    return api.Class(ConsoleWidget, {
        id: 'console-deviation-widget',
        template: template,
        init: function(args) {
            this.traceId = "unknown";
            this.parameters = function(params) {
                this.deviationType(params[0]);
                this.traceId = params[1];
            };
            this.deviationType = ko.observable();
            this.deviationTime = ko.observable();
            this.deviationActorPath = ko.observable()
            this.deviationReason = ko.observable();
            this.events = ko.observableArray([]);
        },
        dataName: 'deviation',
        dataTypes: ['deviation'],
        dataScope: {},
        dataRequest: function() {
            return { 'traceId': this.traceId };
        },
        onData: function(data) {
            this.isSystemEvent = function(type) {
                if (type.indexOf('Msg') > 0 || type.indexOf('Stream') > 0) {
                    return 1;
                } else {
                    return 0;
                }
            }

            this.parseEvent = function(level, event, result) {
                if (event != undefined) {
                    var message = "";
                    var reason = "";
                    var actorPath = "";
                    if (event.annotation.message != undefined) {
                        message = event.annotation.message;
                    };
                    if (event.annotation.reason != undefined) {
                        reason = event.annotation.reason;
                    }
                    if (event.annotation.actorInfo != undefined) {
                        actorPath = event.annotation.actorInfo.actorPath;
                    }
                    var eventInfo = {
                        'paddingSize' : "" + level * 20 + "px",
                        'type' : event.annotation.type,
                        'systemEvent' : this.isSystemEvent(event.annotation.type),
                        'timestamp' : formatter.formatTime(new Date(event.timestamp)),
                        'actor' : actorPath,
                        'message' : message,
                        'reason' : reason
                    }

                    // Check if this is the main reason of the deviation and if so update the labels
                    if (event.annotation.reason != undefined) {
                        this.deviationTime(formatter.formatTime(new Date(event.timestamp)));
                        this.deviationActorPath(event.annotation.actorInfo.actorPath);
                        this.deviationReason(event.annotation.reason);
                    }

                    result.push(eventInfo);
                }
            }

            this.parse = function(level, collection, result) {
                this.parseEvent(level, collection.event, result);

                if (collection.children != undefined && collection.children.length > 0) {
                    for (var i = 0; i < collection.children.length; i++) {
                        this.parse(level + 1, collection.children[i], result);
                    }
                }

                return result;
            };

            this.events(this.parse(0, data.deviation, []));
        }
    });
});
