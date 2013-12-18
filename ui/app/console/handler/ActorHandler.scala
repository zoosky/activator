/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console
package handler

class ActorHandler extends RequestHandler {
  type Payload = Any

  def receive = {
    case _ =>
  }

  /*
def handle(receiver: ActorRef, mi: ModuleInformation): (ActorRef, JsValue) = {
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
    (receiver, JsObject(Seq("actor" -> JsString("todo"))))
}
  */
}
