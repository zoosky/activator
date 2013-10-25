/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console

import akka.actor.{ ActorSystem, Props }

object ConsoleActorSystem {
  private val system = ActorSystem("ConsoleActorSystem")
  val clientController = system.actorOf(Props[ClientController], "clientController")
}
