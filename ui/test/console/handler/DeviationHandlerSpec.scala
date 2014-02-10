package console.handler

import activator.analytics.rest.http.LocalMemoryRepository
import com.typesafe.trace.{ TraceEvent, TraceEvents, Batch }
import akka.actor.ActorRef
import org.specs2.mutable.Specification
import com.typesafe.trace.uuid.UUID

object DeviationHandlerSpec {
  import Generators._

  val traceId = new UUID()
  val traces = genTraceEvents(randomFlatten(genNMessageTraceAnnotations(20)), traceId)

  lazy val repository: LocalMemoryRepository = {
    val r = new LocalMemoryRepository(null)
    val tr = r.traceRepository
    tr.store(Batch(Seq(TraceEvents(traces))))
    r
  }

  def deviationHandler(repo: LocalMemoryRepository)(body: (ActorRef, UUID, Seq[TraceEvent]) => Unit): DeviationHandlerBase = new DeviationHandlerBase {
    val repository: LocalMemoryRepository = repo

    def useDeviation(sender: ActorRef, eventId: UUID, traces: Seq[TraceEvent]): Unit = body(sender, eventId, traces)
  }
}

class DeviationHandlerSpec extends Specification {
  import DeviationHandlerSpec._

  "Deviation Handler" should {
    "Find data" in {
      var resultSender: ActorRef = null
      var resultTraces: Seq[TraceEvent] = null
      var resultEventID: UUID = null

      val h = deviationHandler(repository) { (ar, uuid, events) =>
        resultSender = ar
        resultTraces = events
        resultEventID = uuid
      }

      forall(repository.traceRepository.allEventIds) { (eventID: UUID) =>
        resultSender = null
        resultTraces = null
        resultEventID = null
        h.onModuleInformation(ActorRef.noSender, DeviationHandler.DeviationModuleInfo(eventID))

        resultSender must equalTo(ActorRef.noSender)
        resultEventID must equalTo(eventID)
        resultTraces must equalTo(traces)
      }
    }
    "Not find data for unknown event IDs" in {
      var resultSender: ActorRef = null
      var resultTraces: Seq[TraceEvent] = null
      var resultEventID: UUID = null

      val h = deviationHandler(repository) { (ar, uuid, events) =>
        resultSender = ar
        resultTraces = events
        resultEventID = uuid
      }

      val uniqueUUID = Generators.uniqueUUID(repository.traceRepository.allEventIds.toSet)

      h.onModuleInformation(ActorRef.noSender, DeviationHandler.DeviationModuleInfo(uniqueUUID))

      resultEventID must equalTo(uniqueUUID)
      resultSender must equalTo(ActorRef.noSender)
      resultTraces must equalTo(Seq.empty[TraceEvent])
    }
  }

}
