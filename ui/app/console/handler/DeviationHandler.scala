/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console
package handler

import akka.actor.{ ActorRef, Props }
import com.typesafe.trace.uuid.UUID
import com.typesafe.trace.TraceEvent
import console.handler.rest.DeviationJsonBuilder.{ DeviationResult, ValidResult, InvalidResult }
import console.handler.rest.DeviationJsonBuilder
import console.AnalyticsRepository

object DeviationHandler {
  def props(repository: AnalyticsRepository,
    builderProps: Props = DeviationJsonBuilder.props()): Props =
    Props(classOf[DeviationHandler], repository, builderProps)

  case class DeviationModuleInfo(eventID: UUID) extends ModuleInformationBase
}

trait DeviationHandlerBase extends RequestHandlerLike[DeviationHandler.DeviationModuleInfo] {
  import DeviationHandler._

  def useNoDeviation(sender: ActorRef, eventId: UUID): Unit

  def useDeviation(sender: ActorRef, eventId: UUID, event: TraceEvent, traces: Seq[TraceEvent]): Unit

  def onModuleInformation(sender: ActorRef, mi: DeviationModuleInfo): Unit = {
    println(s">>>>>>>>>>>>>>   $mi")
    val aei = repository.traceRepository.allEventIds
    println(s">> Looking for: ${mi.eventID}")
    aei.foreach { eid =>
      if (eid == mi.eventID) println(s">>   $eid -- MATCHED!")
    }
    println(">> ----------------")
    (for {
      event <- repository.traceRepository.event(mi.eventID)
      traces: Seq[TraceEvent] = repository.traceRepository.trace(event.trace)
    } yield {
      useDeviation(sender, mi.eventID, event, traces)
    }) getOrElse (useNoDeviation(sender, mi.eventID))
  }
}

class DeviationHandler(val repository: AnalyticsRepository,
  builderProps: Props) extends RequestHandler[DeviationHandler.DeviationModuleInfo] with DeviationHandlerBase {
  val builder = context.actorOf(builderProps, "deviationBuilder")

  def useNoDeviation(sender: ActorRef, eventId: UUID): Unit = {
    println(s"  >>>>>>>>>>>>>>   InvalidResult!")
    builder ! InvalidResult(sender, eventId)
  }

  def useDeviation(sender: ActorRef, eventId: UUID, event: TraceEvent, traces: Seq[TraceEvent]): Unit = {
    println(s"  >>>>>>>>>>>>>>   ValidResult!")
    builder ! ValidResult(sender, eventId, event, traces)
  }
}
