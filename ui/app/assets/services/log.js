/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['commons/utils'], function(utils){

  // TODO we should move both the ANSI stripping and the heuristic
  // parseLogLevel to the server side. We could also use
  // Djline.terminal=jline.UnsupportedTerminal when we launch
  // sbt on the server to avoid stripping ansi codes.

  var ansiCodeString = "\\033\\[[0-9;]+m";
  // if we wanted to be cute we'd convert these to HTML tags perhaps
  var ansiCodeRegex = new RegExp(ansiCodeString, "g");
  function stripAnsiCodes(s) {
    return s.replace(ansiCodeRegex, "");
  }

  var logLevelWithCodesRegex = new RegExp("^" + ansiCodeString + "\[" +
      ansiCodeString + "(debug|info|warn|error|success)" +
      ansiCodeString + "\] (.*)");
  var logLevelRegex = new RegExp("^\[(debug|info|warn|error|success)\] (.*)");
  function parseLogLevel(level, message) {
    if (level == 'stdout' || level == 'stderr') {
      var m = logLevelWithCodesRegex.exec(message);
      if (m !== null) {
        return { level: m[1], message: m[2] };
      }
      m = logLevelRegex.exec(message);
      if (m !== null) {
        return { level: m[1], message: m[2] };
      }
    }
    return { level: level, message: message };
  };


  // escapeHtml and entityMap from mustache.js MIT License
  // Copyright (c) 2010 Jan Lehnardt

  var entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;',
      "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  function unix(filename) {
    return filename.replace(/[\\]/g, '/');
  }

  function stripTrailing(filename) {
    if (filename.length > 0 && filename[filename.length - 1] == '/')
      return filename.substring(0, filename.length - 1);
    else
      return filename;
  }

  function startsWith(prefix, s) {
    return (prefix.length <= s.length &&
        s.substring(0, prefix.length) == prefix);
  }

  function relativizeFile(file) {
    file = unix(file);
    if ('serverAppModel' in window && 'location' in window.serverAppModel) {
      var root = stripTrailing(unix(window.serverAppModel.location));
      if (startsWith(root, file))
        return file.substring(root.length);
      else
        return file;
    } else {
      return file;
    }
  }

  // this regex is used on both the text and html-escaped log line
  var fileLineRegex = new RegExp("^(([^:]+:)?([^:]+)):([0-9]+): ");

  ko.bindingHandlers['compilerMessage'] = {
    // we only implement init, not update, because log lines are immutable anyway
    // and knockout calls update() multiple times (not smart enough to do deep
    // equality on arrays, maybe?)
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
      var o = ko.utils.unwrapObservable(valueAccessor());
      var text = ko.utils.unwrapObservable(o.message);
      var html = escapeHtml(text);
      if ('href' in o && 'file' in o) {
        var link = '<a href="' + escapeHtml(o.href).replace('$', '$$') + '">$1:$4</a>';
        html = html.replace(fileLineRegex, link);
      }
      ko.utils.setHtml(element, html);
    }
  };

  var Log = utils.Class({
    init: function(parameters) {
      var self = this;
      this.entries = ko.observableArray();
      // a subset of entries that had file:line errors
      this.parsedErrorEntries = ko.observableArray();
      this.queue = [];
      this.boundFlush = this.flush.bind(this);
      // on 0 to 1, scrolling state should be saved;
      // on 1 to 0, restored.
      this.scrollFreeze = ko.observable(0);
    },
    _addErrorInfo: function(entry) {
      var m = fileLineRegex.exec(entry.message);
      var file = null;
      var line = null;
      if (m !== null) {
        file = m[1];
        line = m[4];
        // both html-escaped and second-arg-to-replace-escaped
        var relative = relativizeFile(file);
        entry.file = relative;
        entry.line = line;
        entry.href = '#code' + relative + ':' + line;

        this.parsedErrorEntries.push(entry);
      }
    },
    _pushAll: function(toPush) {
      var length = toPush.length;
      if (length == 0)
        return;

      // we don't use ko.utils.arrayPushAll because
      // it replaces the entire array and forces
      // knockout to do a diff. We don't use
      // push() because knockout seems to be able to
      // optimize a bulk splice much better (even though
      // the push is O(1) in theory with Knockout 3.0).
      // the CHUNK stuff is because browsers have some limit
      // on the number of function arguments. The limit is pretty
      // large for some (like MAXSHORT or something) but we
      // keep it lower in case some browser out there is lame.
      var CHUNK = 255;
      var i = 0;
      for (; i < length; i += CHUNK) {
        var spliceParams = [ this.entries().length, 0 ];
        var j = i;
        var stop = Math.min(j + CHUNK, length);
        for (; j < stop; j += 1) {
          var entry = toPush[j];
          this._addErrorInfo(entry);
          spliceParams.push(entry);
        }
        this.entries.splice.apply(this.entries, spliceParams);
      }
    },
    flush: function() {
      if (this.queue.length > 0) {
        this.scrollFreeze(this.scrollFreeze() + 1);

        var toPush = this.queue;
        this.queue = [];
        this._pushAll(toPush);

        this.scrollFreeze(this.scrollFreeze() - 1);
      }
    },
    log: function(level, message) {
      // queuing puts a cap on frequency of the scroll state update,
      // so adding one log message is in theory always cheap.
      this.queue.push({ level: level, message: message });

      if (this.queue.length == 1) {
        // 100ms = threshold for user-perceptible slowness
        // in general but nobody has much expectation for
        // the exact moment a log message appears.
        setTimeout(this.boundFlush, 150);
      }
    },
    debug: function(message) {
      this.log("debug", message);
    },
    info: function(message) {
      this.log("info", message);
    },
    warn: function(message) {
      this.log("warn", message);
    },
    error: function(message) {
      this.log("error", message);
    },
    stderr: function(message) {
      this.log("stderr", message);
    },
    stdout: function(message) {
      this.log("stdout", message);
    },
    clear: function() {
      this.flush(); // be sure we collect the queue
      this.entries.removeAll();
      this.parsedErrorEntries.removeAll();
    },
    moveFrom: function(other) {
      // "other" is another logs widget
      other.flush();
      this.flush();
      var removed = other.entries.removeAll();
      other.parsedErrorEntries.removeAll();
      this._pushAll(removed);
    },
    // returns true if it was a log event
    event: function(event) {
      if (event.type == 'LogEvent') {
        var message = event.entry.message;
        var logType = event.entry.type;
        if (logType == 'message') {
          this.log(event.entry.level, stripAnsiCodes(message));
        } else {
          if (logType == 'success') {
            this.log(logType, stripAnsiCodes(message));
          } else {
            // sometimes we get stuff on stdout/stderr before
            // we've intercepted sbt's logger, so try to parse
            // the log level out of the [info] that sbt prepends.
            var m = parseLogLevel(logType, message);
            this.log(m.level, stripAnsiCodes(m.message));
          }
        }
        return true;
      } else {
        return false;
      }
    },
    leftoverEvent: function(event) {
      if (event.type == 'RequestReceivedEvent' || event.type == 'Started' || event.type == 'TaskComplete') {
        // not interesting
      } else {
        this.warn("ignored event: " + JSON.stringify(event));
      }
    }
  });

  return Log;
});
