/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['webjars!knockout', 'commons/settings', 'widgets/log/log', 'commons/utils', 'commons/events', './sbt'],
    function(ko, settings, log, utils, events, sbt){
  settings.register("build.startApp", true);
  settings.register("build.rerunOnBuild", true);
  settings.register("build.runInConsole", false);
  settings.register("build.retestOnSuccessfulBuild", false);
  settings.register("build.recompileOnChange", true);

  var log = new log.Log();

  // properties of the application we are building
  var app = {
    name: ko.observable(window.serverAppModel.name ? window.serverAppModel.name : window.serverAppModel.id),
    hasAkka: ko.observable(false),
    hasPlay: ko.observable(false),
    hasConsole: ko.observable(false)
  };

  var compile = utils.Singleton({
    init: function() {
      var self = this;

      this.activeTask = ko.observable(""); // empty string or taskId
      this.haveActiveTask = ko.computed(function() {
        return self.activeTask() != "";
      }, this);
      this.needCompile = ko.observable(false);
      // TODO use the real setting for this
      this.recompileOnChange = ko.observable(true);
      events.subscribe(function(event) {
        return event.type == 'FilesChanged';
      },
      function(event) {
        if (self.recompileOnChange()) {
          if (app.hasPlay()) {
            debug && console.log("files changed but it's a Play app so not recompiling.")
            log.info("Some of your files may have changed; reload in the browser or click \"Start compiling\" above to recompile.")
            log.info("  (for Play apps, Activator does not auto-recompile because it may conflict with compilation on reload in the browser.)")
          } else {
            debug && console.log("files changed, doing a recompile");
            // doCompile just marks a compile pending if one is already
            // active.
            self.doCompile();
          }
        } else {
          debug && console.log("recompile on change unchecked, doing nothing");
        }
      });

      // we generally expect to get this event on startup, which
      // will then cause us to reload sources, which will then
      // trigger a FilesChanged which will trigger a compile.
      events.subscribe(function(event) {
        debug && console.log("filtering event: ", event);
        return event.type == 'SourcesMayHaveChanged';
      },
      function(event) {
        debug && console.log("Sources may have changed, reloading the list");
        self.reloadSources(null);
      });
    },
    logEvent: function(event) {
      if (log.event(event)) {
        // logged already
      } else {
        log.leftoverEvent(event);
      }
    },
    reloadProjectInfoThenCompile: function() {
      var self = this;

      log.info("Loading details of this project...");

      // TODO indicate status
      //self.status(api.STATUS_BUSY);
      var taskId = sbt.runTask({
        task: 'name',
        onmessage: function(event) {
          debug && console.log("event from name task ", event);
          logEvent(event);
        },
        success: function(result) {
          debug && console.log("name task results ", result);
          self.activeTask("");

          app.name(result.params.name);
          app.hasAkka(result.params.hasAkka === true);
          app.hasPlay(result.params.hasPlay === true);
          app.hasConsole(result.params.hasConsole === true);

          log.debug("name=" + app.name() +
              " hasAkka=" + app.hasAkka() +
              " hasPlay=" + app.hasPlay() +
              " hasConsole=" + app.hasConsole());

          self.compileAfterReloadProjectInfo();
        },
        failure: function(status, message) {
          debug && console.log("loading project info failed", message);
          self.activeTask("");
          log.warn("Failed to load project details: " + message);
          // TODO set status properly
          //self.status(api.STATUS_ERROR);
        }
      });
      self.activeTask(taskId);
    },
    // after = optional
    reloadSources: function(after) {
      var self = this;

      log.info("Refreshing list of source files to watch for changes...");
      // Are we busy when watching sources? I think so...
      // TODO communicate status
      //self.status(api.STATUS_BUSY);
      sbt.watchSources({
        onmessage: function(event) {
          debug && console.log("event watching sources", event);
          logEvent(event);
        },
        success: function(data) {
          debug && console.log("watching sources result", data);
          // TODO set status somewhere
          //self.status(api.STATUS_DEFAULT);
          log.info("Will watch " + data.count + " source files.");
          if (typeof(after) === 'function')
            after();
        },
        failure: function(status, message) {
          debug && console.log("watching sources failed", message);
          log.warn("Failed to reload source file list: " + message);
          // WE should modify our status here!
          // TODO status
          // self.status(api.STATUS_ERROR);
          if (typeof(after) === 'function')
            after();
        }
      });
    },
    afterCompile: function(succeeded) {
      var self = this;

      // TODO fix status
      /*
      if (succeeded)
        self.status(api.STATUS_DEFAULT);
      else
        self.status(api.STATUS_ERROR);
        */

      if (self.needCompile()) {
        debug && console.log("need to recompile because something changed while we were compiling");
        self.needCompile(false);
        self.doCompile();
      } else if (succeeded) {
        // asynchronously reload the list of sources in case
        // they changed. we are trying to serialize sbt usage
        // here so we only send our event out when we finish
        // with the reload.
        self.reloadSources(function() {
          // notify others
          events.send({ 'type' : 'CompileSucceeded' });
        });
      }
    },
    compileAfterReloadProjectInfo: function() {
      var self = this;

      if (self.needCompile()) {
        // asked to restart while loading the project info; so bail out here
        // without starting the actual compile task.
        log.info('Recompile requested.');
        self.afterCompile(false);
        return;
      }

      // TODO status
      //self.status(api.STATUS_BUSY);
      log.info("Compiling...");
      var task = { task: 'compile' };
      var taskId = sbt.runTask({
        task: task,
        onmessage: function(event) {
          logEvent(event);
        },
        success: function(data) {
          debug && console.log("compile result: ", data);
          self.activeTask("");
          if (data.type == 'GenericResponse') {
            log.info('Compile complete.');
          } else {
            log.error('Unexpected reply: ' + JSON.stringify(data));
          }
          self.afterCompile(true); // true=success
        },
        failure: function(status, message) {
          debug && console.log("compile failed: ", status, message)
          self.activeTask("");
          log.error("Request failed: " + status + ": " + message);
          self.afterCompile(false); // false=failed
        }
      });
      self.activeTask(taskId);
    },
    // this does reload project info task, compile task, then watch sources task.
    doCompile: function() {
      var self = this;
      if (self.haveActiveTask()) {
        debug && console.log("Attempt to compile with a compile already active, will recompile again when we finish");
        self.needCompile(true);
        return;
      }

      log.clear();
      self.reloadProjectInfoThenCompile();
    },
    stopCompile: function() {
      if (self.haveActiveTask()) {
        sbt.killTask({
          taskId: self.activeTask(),
          success: function(data) {
            debug && console.log("kill success: ", data)
          },
          failure: function(status, message) {
            debug && console.log("kill failed: ", status, message)
            log.error("Killing task failed: " + status + ": " + message)
          }
        });
      }
    }
  });

  var build = utils.Singleton({
    init: function() {
    },
    log: log,
    app: app,
    compile: compile
  });

  return build;
});
