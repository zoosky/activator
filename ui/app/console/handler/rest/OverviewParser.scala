package console.handler.rest

import akka.actor.ActorRef
import activator.analytics.data._
import play.api.libs.json._
import console.ClientController.Update
import play.api.libs.json.JsObject
import activator.analytics.data.MetadataStats

class OverviewParser extends ParserActor {
  import OverviewParser._

  def receive = {
    case r: Result => r.receiver ! Update(createJson(r))
    /*
        JsObject(Seq(
          "type" -> JsString("overview"),
          "data" -> JsObject(
            Seq("metadata" -> JsObject(Seq(
              "playPatternCount" -> JsNumber(metadata.head.metrics.playPatterns.size),
              "actorPathCount" -> JsNumber(metadata.head.metrics.paths.size)))) ++
              Seq("deviations" -> JsObject(Seq(
                "deviationCount" -> JsNumber(deviations.head.metrics.counts.total))))))))
                */
  }

  def createJson(r: Result): JsObject = {
    Json.obj(
      "type" -> "overview",
      "data" ->
        Json.obj(
          "metadata" ->
            Json.obj(
              "playPatternCount" -> r.metadata.metrics.playPatterns.size,
              "actorPathCount" -> r.metadata.metrics.paths.size,
              "deviations" -> Json.obj(
                "deviationCount" -> r.deviations.metrics.counts.total))))
  }
}

object OverviewParser {
  case class Result(receiver: ActorRef, metadata: MetadataStats, deviations: ErrorStats)
}
