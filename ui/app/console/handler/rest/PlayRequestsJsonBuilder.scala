/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console.handler.rest

import akka.actor.ActorRef
import console.ClientController.Update
import activator.analytics.data.PlayRequestSummary
import play.api.libs.json.{ Json, JsObject }

class PlayRequestsJsonBuilder extends JsonBuilderActor {
  import PlayRequestsJsonBuilder._

  def receive = {
    case r: PlayRequestsResult => r.receiver ! Update(createPlayRequestsJson(r.stats))
  }
}

object PlayRequestsJsonBuilder {
  case class PlayRequestsResult(receiver: ActorRef, stats: Seq[PlayRequestSummary])

  def createPlayRequestsJson(stats: Seq[PlayRequestSummary]): JsObject = {
    Json.obj(
      "type" -> "requests",
      "data" ->
        Json.obj(
          "playRequestSummaries" ->
            Json.toJson(stats.map { PlayRequestJsonBuilder.createPlayRequestJson(_) })))
  }
}
