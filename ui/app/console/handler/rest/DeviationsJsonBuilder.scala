/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console.handler.rest

import akka.actor.ActorRef
import console.ClientController.Update

class DeviationsJsonBuilder extends JsonBuilderActor {
  import DeviationsJsonBuilder._

  def receive = {
    case r: DeviationsResult => r.receiver ! Update(null)
  }
}

object DeviationsJsonBuilder {
  case class DeviationsResult(receiver: ActorRef)
}
