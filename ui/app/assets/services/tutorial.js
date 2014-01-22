define(function() {
  return {

    getTutorial: function() {
      return {
        name: "Tutorial Name",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae lorem at neque mollis viverra eu eu tortor. Vivamus at viverra risus. Quisque scelerisque felis purus, a tempor elit vulputate tempor. Sed pharetra condimentum elementum. Aliquam lobortis, metus ut luctus commodo, neque justo cursus diam, eu semper augue dui a erat. Praesent eget augue dignissim, aliquet erat lobortis, feugiat dui.",
        source: "http://github.com/johndoe/activator-akka-spray",
        author: {
          name: "John Does",
          twitter: "johndoe"
        },
        partner: {
          url: "http://partner.com",
          logo: "http://dommkopfq6m1m.cloudfront.net/public/1387589794721/images/partners/svcs/chariot.png",
          summary: "Maecenas lorem arcu, tristique ut accumsan ac, ultricies non nulla. Pellentesque adipiscing venenatis risus at faucibus. In vehicula fermentum enim et placerat."
        }
      };
    },

    getTable: function() {
      return ['Source code', 'Define our Messages', 'Define our Actor', 'Create our Actor', 'Tell the Actor (to do something)', 'Replying to an Actor', 'Using Inbox', 'Test the App', 'Run the App', 'Typesafe Console', 'Next Steps'];
    },

    getPage: function(number) {
      return {
        title: "Explore the Code, page " + number,
        page: "<p>You've just created a Scala application!  This is a basic \"Hello, World\"\n     application.   Let's look at the <a href=\"#code/src/main/scala/Hello.scala\"\n    class=\"shortcut\">src/main/scala/Hello.scala</a> file.</p>\n\n  <p>This file consists of a single object called <code>Hello</code>.  This\n     object defines a <code>main</code> method, which denotes that it can be run as a\n     standalone application.  Let's look into the definition of the main method:</p>\n<pre><code>def main(args: Array[String]): Unit = </code></pre>\n  <p> The method definition starts with the keyword \"<code>def</code>\".   This is used to define all\n     methods in scala.  After def comes the name of the method, in this case \"main\".</p>\n  <p>Following the name is the argument list, denoting input parameters to the method.  In\n     the case of the \"<code>main</code>\" method, it takes a single parameter called \"<code>args</code>\".\n     When the application is executed, any command line arguments will be bundled into an array \n     of string values (or \"<code>Array[String]</code>\") and passed into the \"<code>main</code>\" method.</p>\n  <p>Following the argument list is the return type of the method.  For main, this is \"<code>Unit</code>\" which\n     denotes \"uninteresting\" return type.   It is similar to the \"void\" type of Java/C/C++ in that we aren't\n     interesting in calling the \"<code>main</code>\" method for a return value.\n  <p>Following the return type is an \"<code>=</code>\" character and then the method implementation.\n     For the <code>Hello.main</code> method, the implementation is the following block of code:\n  </p>\n  <pre><code>{\nprintln(\"Hello, World\")\n}</code></pre>\n\n  <p>This block of code uses the <code>println</code> method to display the string\n     literal \"Hello, world!\" on the console.  We can see this output by\n     clicking on the <a class=\"shortcut\" href=\"#run\">Run</a> tab.\n  </p>"
      }
    }

  }
});
