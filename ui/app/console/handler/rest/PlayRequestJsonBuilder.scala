/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console.handler.rest

import akka.actor.ActorRef
import console.ClientController.Update

class PlayRequestJsonBuilder extends JsonBuilderActor {
  import PlayRequestJsonBuilder._

  def receive = {
    case r: PlayRequestResult => r.receiver ! Update(null)
  }
}

object PlayRequestJsonBuilder {
  case class PlayRequestResult(receiver: ActorRef)
}
