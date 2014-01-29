/**
 * Copyright (C) 2014 Typesafe <http://typesafe.com/>
 */
package console
package handler

import akka.actor.ActorRef

object LifecycleHandler {
  case class LifecycleModuleInfo(command: Command) extends ModuleInformationBase

  sealed trait Command
  case object ResetCommand extends Command

  def extractCommand(command: String): Command = command match {
    case _ => ResetCommand
  }
}

trait LifecycleHandlerBase extends RequestHandler[LifecycleHandler.LifecycleModuleInfo] {
  import LifecycleHandler._

  def onModuleInformation(sender: ActorRef, mi: LifecycleModuleInfo): Unit = {
    mi.command match {
      case ResetCommand =>
        repository.lifecycleRepository.clear()
      case _ => log.error(s"Unknown lifecycle command: ${mi.command}")
    }
  }
}

class LifecycleHandler extends LifecycleHandlerBase {
}
