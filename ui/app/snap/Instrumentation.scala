/**
 * Copyright (C) 2014 Typesafe <http://typesafe.com/>
 */
package snap

import java.io._
import play.api.libs.json._
import play.api.libs.json.Json._
import play.api.libs.functional.syntax._

sealed trait Instrumentation

case class NewRelic(configFile: File, agentJar: File, environment: String = "dev") extends Instrumentation

object Instrumentation {
  import AppConfig._

  implicit val NewRelicWrites = Json.writes[NewRelic]

  implicit val NewRelicReads = Json.reads[NewRelic]

  implicit val InstrumentationWrites: Writes[Instrumentation] = new Writes[Instrumentation] {
    def writes(in: Instrumentation): JsValue = in match {
      case x: NewRelic => obj("instrumentation" ->
        obj("newRelic" -> NewRelicWrites.writes(x)))
    }
  }

  implicit val InstrumentationReads: Reads[Instrumentation] =
    ((__ \ "instrumentation").read(
      (__ \ "newRelic").read(NewRelicReads))).asInstanceOf[Reads[Instrumentation]]

}
