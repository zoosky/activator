/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console
package handler

import akka.actor.ActorRef
import play.api.libs.json._
import scala.concurrent.{ ExecutionContext, Future }

class OverviewHandler extends RequestHandler {
  import Responses._
  import ExecutionContext.Implicits.global

  def call(receiver: ActorRef, mi: ModuleInformation): Future[(ActorRef, JsValue)] = {
    val timeFilter = mi.time.queryParams
    val limit = for { pi ← mi.pagingInformation } yield pi.limit
    val limitFilter = "&limit=" + limit.getOrElse("")
    val query = timeFilter + limitFilter

    val metadataPromise = call(RequestHandler.metadataURL, query)

    for {
      metadata ← metadataPromise
    } yield {
      val result = validateResponse(metadata) match {
        case ValidResponse ⇒
          val data = metadata.json
          JsObject(Seq(
            "type" -> JsString("overview"),
            "data" -> data))
        case InvalidLicense(jsonLicense) ⇒ jsonLicense
        case ErrorResponse(jsonErrorCodes) ⇒ jsonErrorCodes
      }

      (receiver, result)
    }
  }
}
