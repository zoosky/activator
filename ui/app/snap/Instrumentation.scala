/**
 * Copyright (C) 2014 Typesafe <http://typesafe.com/>
 */
package snap

import java.io._

sealed abstract class Instrumentation(val name: String) {
  def jvmArgs: Seq[String]
}

object Instrumentations {
  final val inspect: String = "inspect"
  final val newRelic: String = "newRelic"
  final val allInstrumentations = Set(inspect, newRelic)
  def validate(in: String): String = {
    val n = in.trim()
    if (allInstrumentations(n)) n
    else throw new RuntimeException(s"$n is not a valid instrumentation.  Must be one of: $allInstrumentations")
  }
}

case object Inspect extends Instrumentation(Instrumentations.inspect) {
  def jvmArgs: Seq[String] = Seq.empty[String]
}

case class NewRelic(configFile: File, agentJar: File, environment: String = "development") extends Instrumentation(Instrumentations.newRelic) {
  def jvmArgs: Seq[String] = Seq(
    s"-javaagent:${agentJar.getPath()}",
    s"-Dnewrelic.config.file=${configFile.getPath()}",
    s"-Dnewrelic.environment=$environment")
}
