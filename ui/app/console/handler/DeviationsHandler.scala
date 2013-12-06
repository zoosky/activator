/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console.handler

import console.{ ModuleInformation, RequestHandler }
import scala.concurrent.{ Future, ExecutionContext }
import akka.actor.ActorRef
import play.api.libs.json.{ JsString, JsObject, JsValue }
import console.Responses.{ ErrorResponse, InvalidLicense, ValidResponse }

class DeviationsHandler extends RequestHandler {
  import ExecutionContext.Implicits.global

  def handle(receiver: ActorRef, mi: ModuleInformation): Future[(ActorRef, JsValue)] = {
    val params = mi.time.queryParams ++ mi.scope.queryParams
    val url =
      if (mi.scope.actorPath.isDefined) RequestHandler.actorURL
      else RequestHandler.deviationsURL
    val deviationsPromise = call(url, params)
    for {
      deviations <- deviationsPromise
    } yield {
      val result = validateResponse(deviations) match {
        case ValidResponse =>
          val data = JsObject(Seq("deviations" -> deviations.json))
          JsObject(Seq(
            "type" -> JsString("deviations"),
            "data" -> data))
        case InvalidLicense(jsonLicense) => jsonLicense
        case ErrorResponse(jsonErrorCodes) => jsonErrorCodes
      }

      (receiver, result)
    }
  }
}
