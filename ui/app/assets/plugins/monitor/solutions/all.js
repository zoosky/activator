/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['text!./newrelic.html', 'text!./appdynamics.html' ], function(newrelic, appdynamics){
    return {
        'newrelic-template': newrelic,
        'appdynamics-template': appdynamics
    };
});
