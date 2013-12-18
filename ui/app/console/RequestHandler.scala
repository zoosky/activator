/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console

import akka.actor.{ ActorLogging, Actor }
import activator.analytics.rest.http.LocalMemoryRepository

trait RequestHandler extends Actor with ActorLogging {
  val repository = new LocalMemoryRepository(context.system)
}
