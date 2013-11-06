/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console.handler

import console.{ ModuleInformation, RequestHandler }
import akka.actor.ActorRef
import scala.concurrent.{ ExecutionContext, Future }
import play.api.libs.json.{ JsString, JsObject, JsValue }
import console.Responses._

class PlayRequestsHandler extends RequestHandler {
  import ExecutionContext.Implicits.global

  def call(receiver: ActorRef, mi: ModuleInformation): Future[(ActorRef, JsValue)] = {
    val timeFilter = mi.time.queryParams
    val scopeFilter = "&" + mi.scope.queryParams
    val offset = for { pi ← mi.pagingInformation } yield pi.offset
    val offsetFilter =
      if (offset.isDefined) "&offset=" + offset.get
      else ""
    val limit = for { pi ← mi.pagingInformation } yield pi.limit
    val limitFilter = "&limit=" + limit.getOrElse("")
    val playRequestsPromise = call(RequestHandler.playRequestsURL, timeFilter + scopeFilter + offsetFilter + limitFilter)
    for {
      playRequests ← playRequestsPromise
    } yield {
      val result = validateResponse(playRequests) match {
        case ValidResponse ⇒
          val data = JsObject(Seq("playRequestSummaries" -> playRequests.json))
          JsObject(Seq(
            "type" -> JsString("requests"),
            "data" -> data))
        case InvalidLicense(jsonLicense) ⇒ jsonLicense
        case ErrorResponse(jsonErrorCodes) ⇒ jsonErrorCodes
      }

      (receiver, result)
    }
  }
}
