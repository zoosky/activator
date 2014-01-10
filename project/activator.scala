import sbt._
import Keys._
import play.Project._
import com.typesafe.sbt.SbtScalariform
import com.typesafe.sbt.SbtScalariform.ScalariformKeys
import com.typesafe.sbt.SbtGit
import com.typesafe.sbt.SbtPgp
import com.typesafe.sbt.SbtPgp.PgpKeys

object ActivatorBuild {
  // Don't calculate versions EVERYWHERE, just in global...
  def baseVersions: Seq[Setting[_]] = SbtGit.versionWithGit

  def formatPrefs = {
    import scalariform.formatter.preferences._
    FormattingPreferences()
      .setPreference(IndentSpaces, 2)
  }

  val typesafeIvyReleases = Resolver.url("typesafe-ivy-private-releases", new URL("http://private-repo.typesafe.com/typesafe/ivy-releases/"))(Resolver.ivyStylePatterns)
  // TODO - When SBT 0.13 is out we won't need this...
  val typesafeIvySnapshots = Resolver.url("typesafe-ivy-private-snapshots", new URL("http://private-repo.typesafe.com/typesafe/ivy-snapshots/"))(Resolver.ivyStylePatterns)

  private val fixWhitespace = TaskKey[Seq[File]]("fix-whitespace")

  private def makeFixWhitespace(config: Configuration): Setting[_] = {
    fixWhitespace in config <<= (unmanagedSources in config, streams) map { (sources, streams) =>
      for (s <- sources) {
        Fixer.fixWhitespace(s, streams.log)
      }
      sources
    }
  }

  def activatorDefaults: Seq[Setting[_]] =
    SbtScalariform.scalariformSettings ++
    Seq(
      organization := "com.typesafe.activator",
      version <<= version in ThisBuild,
      crossPaths := false,
      resolvers += "typesafe-mvn-releases" at "http://repo.typesafe.com/typesafe/releases/",
      resolvers += Resolver.url("typesafe-ivy-releases", new URL("http://repo.typesafe.com/typesafe/releases/"))(Resolver.ivyStylePatterns),
      // TODO - This won't be needed when SBT 0.13 is released...
      resolvers += typesafeIvyReleases,
      resolvers += typesafeIvySnapshots,
      // TODO - Publish to ivy for sbt plugins, maven central otherwise?
      publishTo := Some(typesafeIvyReleases),
      publishMavenStyle := false,
      publish := { throw new RuntimeException("use publishSigned instead of plain publish") },
      scalacOptions <<= (scalaVersion) map { sv =>
        Seq("-unchecked", "-deprecation") ++
          { if (sv.startsWith("2.9")) Seq.empty else Seq("-feature") }
      },
      javacOptions in Compile := Seq("-target", "1.6", "-source", "1.6"),
      javacOptions in (Compile, doc) := Seq("-source", "1.6"),
      libraryDependencies += Dependencies.junitInterface % "test",
      scalaVersion := Dependencies.scalaVersion,
      scalaBinaryVersion := "2.10",
      ScalariformKeys.preferences in Compile := formatPrefs,
      ScalariformKeys.preferences in Test    := formatPrefs,
      makeFixWhitespace(Compile),
      makeFixWhitespace(Test),
      compileInputs in (Compile, compile) <<= (compileInputs in (Compile, compile)) dependsOn (fixWhitespace in Compile),
      compileInputs in (Test, compile) <<= (compileInputs in (Test, compile)) dependsOn (fixWhitespace in Test)
    ) ++ JavaVersionCheck.javacVersionCheckSettings ++ SbtPgp.settings

  def sbtShimPluginSettings: Seq[Setting[_]] =
    activatorDefaults ++
    Seq(
      scalaVersion := Dependencies.sbtPluginScalaVersion,
      scalaBinaryVersion := Dependencies.sbtPluginScalaVersion,
      sbtPlugin := true,
      publishMavenStyle := false
    )

  implicit class NoAutoPgp(val project: Project) extends AnyVal {
    def noAutoPgp: Project = {
      // the default is autoSettings(userSettings, allPlugins, defaultSbtFiles)
      // userSettings = Project.settings
      // we want to push PGP before userSettings so we can override
      // publishSigned and publishLocalSigned,
      // but we leave other plugins alone to avoid confusing ourselves.
      def isPgp(plugin: Plugin): Boolean =
        plugin.getClass.getName.startsWith("com.typesafe.sbt.SbtPgp")
      import AddSettings._
      project.autoSettings(userSettings,
                           plugins(!isPgp(_)),
                           defaultSbtFiles)
    }
  }

  implicit class DoNotPublish(val project: Project) extends AnyVal {
    def doNotPublish: Project = {
      project.settings(
        // this won't work if the project doesn't have PGP relocated (see above)
        PgpKeys.publishSigned := { streams.value.log(s"publishSigned disabled for ${name.value}") },
        PgpKeys.publishLocalSigned := { streams.value.log(s"publishLocalSigned disabled for ${name.value}") },
        publish := { streams.value.log(s"publish disabled for ${name.value}") },
        publishLocal := { streams.value.log(s"publishLocal disabled for ${name.value}") }
      )
    }
  }

  def toReferences(projects: Seq[Project]): Seq[ProjectReference] =
    NoProjectImplicitsHere.toReferences(projects)

  def ActivatorProject(name: String): Project = (
    Project("activator-" + name, file(name))
    .noAutoPgp
    settings(activatorDefaults:_*)
  )

  def ActivatorPlayProject(name: String): Project = (
    play.Project("activator-" + name, path = file(name))
    .noAutoPgp
    settings(activatorDefaults:_*)
    settings(libraryDependencies += play.Keys.filters)
  )

  def ActivatorJavaProject(name: String): Project = (
    Project("activator-" + name, file(name))
    .noAutoPgp
    settings(activatorDefaults:_*)
    settings(
        autoScalaLibrary := false
    )
  )
}

// The ".project" macro on Project somehow breaks
// if invoked with the DoNotPublish / RelocatePgp
// implicits in scope, so this is a hack.
// Obviously there's some better fix somewhere.
private object NoProjectImplicitsHere {
  def toReferences(projects: Seq[Project]): Seq[ProjectReference] =
    projects.map(_.project)
}
