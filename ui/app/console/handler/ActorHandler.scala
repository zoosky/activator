/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console
package handler

import akka.actor.ActorRef
import play.api.libs.json._
import scala.concurrent.{ ExecutionContext, Future }

class ActorHandler extends RequestHandler {
  import Responses._
  import ExecutionContext.Implicits.global
  import RequestHandler._

  def handle(receiver: ActorRef, mi: ModuleInformation): Future[(ActorRef, JsValue)] = {
    val params = mi.time.queryParams ++ mi.scope.queryParams
    val actorStatsPromise = call(RequestHandler.actorURL, params)
    for {
      actorStats <- actorStatsPromise
    } yield {
      val result = validateResponse(actorStats) match {
        case ValidResponse =>
          val data = JsObject(Seq("actor" -> actorStats.json))
          JsObject(Seq(
            "type" -> JsString("actor"),
            "data" -> data))
        case InvalidLicense(jsonLicense) => jsonLicense
        case ErrorResponse(jsonErrorCodes) => jsonErrorCodes
      }

      (receiver, result)
    }
  }
}
