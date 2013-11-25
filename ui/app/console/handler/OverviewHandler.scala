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
  import RequestHandler._
  import ExecutionContext.Implicits.global

  def handle(receiver: ActorRef, mi: ModuleInformation): Future[(ActorRef, JsValue)] = {
    val params = mi.time.queryParams ++ mapifyF("offset", mi.pagingInformation, { pi: PagingInformation => pi.offset })
    val metadataPromise = call(RequestHandler.metadataURL, params)
    val deviationsPromise = call(RequestHandler.deviationsURL, params)

    for {
      metadata <- metadataPromise
      deviations <- deviationsPromise
    } yield {
      val result = validateResponse(metadata) match {
        case ValidResponse =>
          val data =
            JsObject(Seq("metadata" -> metadata.json)) ++
              JsObject(Seq("deviations" -> deviations.json))

          JsObject(Seq(
            "type" -> JsString("overview"),
            "data" -> data))
        case InvalidLicense(jsonLicense) => jsonLicense
        case ErrorResponse(jsonErrorCodes) => jsonErrorCodes
      }

      (receiver, result)
    }
  }
}
