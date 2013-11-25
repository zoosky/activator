/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console.handler

import console.{ ModuleInformation, RequestHandler }
import scala.concurrent.{ Future, ExecutionContext }
import akka.actor.ActorRef
import play.api.libs.json.{ JsString, JsObject, JsValue }
import console.Responses.{ ErrorResponse, InvalidLicense, ValidResponse }
import scala.collection.immutable.Map

class DeviationHandler extends RequestHandler {
  import ExecutionContext.Implicits.global

  def handle(receiver: ActorRef, mi: ModuleInformation): Future[(ActorRef, JsValue)] = {
    val deviationPromise = call(RequestHandler.traceTreeURL + mi.traceId.get, Map.empty[String, String])
    for {
      deviation <- deviationPromise
    } yield {
      val result = validateResponse(deviation) match {
        case ValidResponse =>
          val data = JsObject(Seq("deviation" -> deviation.json))
          JsObject(Seq(
            "type" -> JsString("deviation"),
            "data" -> data))
        case InvalidLicense(jsonLicense) => jsonLicense
        case ErrorResponse(jsonErrorCodes) => jsonErrorCodes
      }

      (receiver, result)
    }
  }
}
