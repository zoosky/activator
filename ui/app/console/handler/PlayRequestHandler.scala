/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console.handler

import console.{ ModuleInformation, RequestHandler }
import scala.concurrent.{ Future, ExecutionContext }
import akka.actor.{ Actor, ActorRef }

class PlayRequestHandler extends RequestHandler {

  type Payload = Any

  def receive = {
    case _ =>
  }

  /*
  def handle(receiver: ActorRef, mi: ModuleInformation): (ActorRef, JsValue) = {

    val params = mi.scope.queryParams
    val playRequestPromise = call(RequestHandler.playRequestURL + mi.traceId.get, params)
    for {
      playRequests <- playRequestPromise
    } yield {
      val result = validateResponse(playRequests) match {
        case ValidResponse =>
          val data = JsObject(Seq("playRequestSummary" -> playRequests.json))
          JsObject(Seq(
            "type" -> JsString("request"),
            "data" -> data))
        case InvalidLicense(jsonLicense) => jsonLicense
        case ErrorResponse(jsonErrorCodes) => jsonErrorCodes
      }

      (receiver, result)
    }

  (receiver, JsObject(Seq("playRequestSummary" -> JsString("todo"))))
}
    */

}
