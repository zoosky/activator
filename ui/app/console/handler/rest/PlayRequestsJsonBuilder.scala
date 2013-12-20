/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console.handler.rest

import akka.actor.ActorRef
import console.ClientController.Update

class PlayRequestsJsonBuilder extends JsonBuilderActor {
  import PlayRequestsJsonBuilder._

  def receive = {
    case r: PlayRequestsResult => r.receiver ! Update(null)
  }
}

object PlayRequestsJsonBuilder {
  case class PlayRequestsResult(receiver: ActorRef)
}
