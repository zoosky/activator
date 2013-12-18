/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console.handler

import console.RequestHandler

class DeviationsHandler extends RequestHandler {
  type Payload = Any

  def receive = {
    case _ =>
  }

  /*
def handle(receiver: ActorRef, mi: ModuleInformation): (ActorRef, JsValue) = {
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
    (receiver, JsObject(Seq("deviations" -> JsString("todo"))))
}
  */
}
