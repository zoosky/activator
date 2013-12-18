/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console.handler

import console.RequestHandler

class PlayRequestsHandler extends RequestHandler {
  type Payload = Any

  def receive = {
    case _ =>
  }

  /*
def handle(receiver: ActorRef, mi: ModuleInformation): (ActorRef, JsValue) = {
  val params =
    mi.time.queryParams ++
      mi.scope.queryParams ++
      mapifyF("offset", mi.pagingInformation, { pi: PagingInformation => pi.offset }) ++
      mapifyF("limit", mi.pagingInformation, { pi: PagingInformation => pi.limit })
  val playRequestsPromise = call(RequestHandler.playRequestsURL, params)
  for {
    playRequests <- playRequestsPromise
  } yield {
    val result = validateResponse(playRequests) match {
      case ValidResponse =>
        val data = JsObject(Seq("playRequestSummaries" -> playRequests.json))
        JsObject(Seq(
          "type" -> JsString("requests"),
          "data" -> data))
      case InvalidLicense(jsonLicense) => jsonLicense
      case ErrorResponse(jsonErrorCodes) => jsonErrorCodes
    }

    (receiver, result)
  }
    (receiver, JsObject(Seq("playRequestSummaries" -> JsString("todo"))))
}
  */
}
