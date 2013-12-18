/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console.handler

import console.RequestHandler

class DeviationHandler extends RequestHandler {
  type Payload = Any

  def receive = {
    case _ =>
  }

  /*
def handle(receiver: ActorRef, mi: ModuleInformation): (ActorRef, JsValue) = {
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
    (receiver, JsObject(Seq("deviation" -> JsString("todo"))))
}
  */
}
