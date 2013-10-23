define ->

  $viewCode = noir.Template ->
    @div ".code-editor", kobind:  "ace: { contents: contents, dirty: isDirty, highlight: highlight, file: file }", ->
