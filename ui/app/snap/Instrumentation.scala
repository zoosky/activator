/**
 * Copyright (C) 2014 Typesafe <http://typesafe.com/>
 */
package snap

import java.io._

sealed abstract class InstrumentationTag(val name: String)

sealed abstract class Instrumentation(val tag: InstrumentationTag) {
  def name: String = tag.name
  def jvmArgs: Seq[String]
}

object Instrumentations {
  case object Inspect extends InstrumentationTag("inspect")
  case object NewRelic extends InstrumentationTag("newRelic")

  def fromString(in: String): InstrumentationTag = in.trim() match {
    case Inspect.name => Inspect
    case NewRelic.name => NewRelic
  }

  final val allInstrumentations = Set(Inspect, NewRelic).map(_.name)

  def validate(in: String): InstrumentationTag = {
    val n = in.trim()
    if (allInstrumentations(n)) fromString(n)
    else throw new RuntimeException(s"$n is not a valid instrumentation.  Must be one of: $allInstrumentations")
  }
}

case object Inspect extends Instrumentation(Instrumentations.Inspect) {
  def jvmArgs: Seq[String] = Seq.empty[String]
}

case class NewRelic(configFile: File, agentJar: File, environment: String = "development") extends Instrumentation(Instrumentations.NewRelic) {
  def jvmArgs: Seq[String] = Seq(
    s"-javaagent:${agentJar.getPath()}",
    s"-Dnewrelic.config.file=${configFile.getPath()}",
    s"-Dnewrelic.environment=$environment")
}
