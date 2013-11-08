/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console
package handler

import akka.actor.ActorRef
import play.api.libs.json._
import scala.concurrent.{ ExecutionContext, Future }

class ActorsHandler extends RequestHandler {
  import Responses._
  import ExecutionContext.Implicits.global
  import RequestHandler._

  def handle(receiver: ActorRef, mi: ModuleInformation): Future[(ActorRef, JsValue)] = {
    val params =
      mi.time.queryParams ++
        mi.scope.queryParams ++
        mapifyF("offset", mi.pagingInformation, { pi: PagingInformation => pi.offset }) ++
        mapifyF("limit", mi.pagingInformation, { pi: PagingInformation => pi.limit }) ++
        mapify("sortOn", mi.sortCommand)
    val actorsStatsPromise = call(RequestHandler.actorsURL, params)
    for {
      actorsStats <- actorsStatsPromise
    } yield {
      val result = validateResponse(actorsStats) match {
        case ValidResponse =>
          val data = JsObject(Seq("actors" -> actorsStats.json))
          JsObject(Seq(
            "type" -> JsString("actors"),
            "data" -> data))
        case InvalidLicense(jsonLicense) => jsonLicense
        case ErrorResponse(jsonErrorCodes) => jsonErrorCodes
      }

      (receiver, result)
    }
  }
}
