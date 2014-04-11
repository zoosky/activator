/**
 * Copyright (C) 2014 Typesafe <http://typesafe.com/>
 */
package snap

import java.io._
import play.api.libs.json._
import play.api.libs.functional.syntax._

sealed abstract class InstrumentationTag(val name: String)

sealed abstract class Instrumentation(val tag: InstrumentationTag) {
  def name: String = tag.name
  def jvmArgs: Seq[String]
}

case object Inspect extends Instrumentation(Instrumentations.InspectTag) {
  def jvmArgs: Seq[String] = Seq.empty[String]
}

case class NewRelic(configFile: File, agentJar: File, environment: String = "development") extends Instrumentation(Instrumentations.NewRelicTag) {
  def jvmArgs: Seq[String] = Seq(
    s"-javaagent:${agentJar.getPath()}",
    s"-Dnewrelic.config.file=${configFile.getPath()}",
    s"-Dnewrelic.environment=$environment")
}

object NewRelic {
  sealed abstract class CheckResult(val message: String)
  case object MissingConfigFile extends CheckResult("Missing configuration file")
  case object MissingInstrumentationJar extends CheckResult("Missing instrumentation jar")
}

object Instrumentations {
  import JsonHelper._

  case object InspectTag extends InstrumentationTag("inspect")
  case object NewRelicTag extends InstrumentationTag("newRelic")

  def fromString(in: String): InstrumentationTag = in.trim() match {
    case InspectTag.name => InspectTag
    case NewRelicTag.name => NewRelicTag
  }

  final val allInstrumentations = Set(InspectTag, NewRelicTag).map(_.name)

  def validate(in: String): InstrumentationTag = {
    val n = in.trim()
    if (allInstrumentations(n)) fromString(n)
    else throw new RuntimeException(s"$n is not a valid instrumentation.  Must be one of: $allInstrumentations")
  }

  implicit val inspectWrites: Writes[Inspect.type] =
    emitTagged("type", InspectTag.name)(_ => Json.obj())

  implicit val newRelicWrites: Writes[NewRelic] =
    emitTagged("type", NewRelicTag.name) {
      case NewRelic(configFile, agentJar, environment) =>
        Json.obj("configFile" -> configFile,
          "agentJar" -> agentJar,
          "environment" -> environment)
    }

  implicit val inspectReads: Reads[Inspect.type] =
    extractTagged("type", InspectTag.name)(Reads(_ => JsSuccess(Inspect)))

  implicit val newRelicReads: Reads[NewRelic] =
    extractTagged("type", NewRelicTag.name) {
      ((__ \ "configFile").read[File] and
        (__ \ "agentJar").read[File] and
        (__ \ "environment").read[String])(NewRelic.apply _)
    }

  implicit val instrumentationWrites: Writes[Instrumentation] =
    Writes(_ match {
      case Inspect => inspectWrites.writes(Inspect)
      case x: NewRelic => newRelicWrites.writes(x)
    })

  implicit val instrumentationReads: Reads[Instrumentation] =
    inspectReads.asInstanceOf[Reads[Instrumentation]] orElse newRelicReads.asInstanceOf[Reads[Instrumentation]]

  private def fileExists(dir: File, in: String): Boolean = new File(dir, in).exists()

  def examineNewRelicReady(config: AppConfig): Either[Set[NewRelic.CheckResult], NewRelic] =
    (fileExists(config.location, "conf/newrelic.yml"), config.availableInstrumentations.find(_.isInstanceOf[NewRelic])) match {
      case (true, Some(r)) => Right(r.asInstanceOf[NewRelic])
      case (true, None) => Left(Set(NewRelic.MissingInstrumentationJar))
      case (false, None) => Left(Set(NewRelic.MissingInstrumentationJar, NewRelic.MissingConfigFile))
      case (false, Some(_)) => Left(Set(NewRelic.MissingConfigFile))
    }

}
