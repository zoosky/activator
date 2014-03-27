/**
 * Copyright (C) 2014 Typesafe <http://typesafe.com/>
 */
package snap

import java.io._
import play.api.libs.json._
import play.api.libs.json.Json._
import play.api.libs.functional.syntax._

sealed trait Instrumentation

case object Inspect extends Instrumentation
case class NewRelic(configFile: File, agentJar: File, environment: String = "development") extends Instrumentation

object Instrumentation {
  import AppConfig._

  implicit val NewRelicWrites = Json.writes[NewRelic]

  implicit val NewRelicReads = Json.reads[NewRelic]

  implicit val InspectWrites: Writes[Inspect.type] = new Writes[Inspect.type] {
    def writes(in: Inspect.type): JsValue = new JsString("inspect")
  }

  implicit val InspectReads: Reads[Inspect.type] = new Reads[Inspect.type] {
    def reads(in: JsValue): JsResult[Inspect.type] = in match {
      case x: JsString if x.value == "inspect" => JsSuccess(Inspect)
      case x => JsError(s"Looking for 'inspect' found $x")
    }
  }

  implicit val InstrumentationWrites: Writes[Instrumentation] = new Writes[Instrumentation] {
    def writes(in: Instrumentation): JsValue =
      obj("instrumentation" -> (in match {
        case x: NewRelic => obj("newRelic" -> NewRelicWrites.writes(x))
        case x @ Inspect => InspectWrites.writes(x)
      }))
  }

  implicit val InstrumentationReads: Reads[Instrumentation] = new Reads[Instrumentation] {
    def reads(in: JsValue): JsResult[Instrumentation] = (in \ "instrumentation") match {
      case setting: JsObject => (setting \ "newRelic") match {
        case nr: JsObject => NewRelicReads.reads(nr)
        case _ => JsError(s"unable to extract New Relic settings from $setting")
      }
      case setting: JsString => InspectReads.reads(setting)
      case _ => JsError(s"unable to extract instrumentation settings from $in")
    }
  }
}
