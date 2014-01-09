/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console

import scala.language.implicitConversions
import akka.actor.{ Props, ActorLogging, Actor, ActorRef }
import console.handler._
import play.api.libs.iteratee.Concurrent
import play.api.libs.json._
import scala.collection.Seq
import activator.analytics.data.{ TimeRange, Scope }
import scala.reflect.ClassTag
import activator.analytics.rest.http.SortingHelpers.{ Descending, Ascending, SortDirection }
import scala.util.{ Failure, Success, Try }

object ClientHandlerBase {
  import OverviewHandler.OverviewModuleInfo, ActorHandler.ActorModuleInfo, ActorsHandler.ActorsModuleInfo, DeviationHandler.DeviationModuleInfo
  import DeviationsHandler.DeviationsModuleInfo, PlayRequestHandler.PlayRequestModuleInfo, PlayRequestsHandler.PlayRequestsModuleInfo
  import activator.analytics.rest.http.SortingHelpers._

  implicit def toOverviewModuleInfo(in: RawModuleInformation): Try[OverviewModuleInfo] =
    Try {
      OverviewModuleInfo(in.scope,
        in.modifiers,
        in.time,
        in.pagingInformation,
        OverviewHandler.extractSortOn(in.sortCommand),
        in.sortDirection.getOrElse(Descending),
        in.dataFrom,
        in.traceId)
    }

  implicit def toActorModuleInfo(in: RawModuleInformation): Try[ActorModuleInfo] =
    Try {
      ActorModuleInfo(in.scope,
        in.modifiers,
        in.time,
        in.dataFrom,
        in.traceId)
    }

  implicit def toActorsModuleInfo(in: RawModuleInformation): Try[ActorsModuleInfo] =
    Try {
      ActorsModuleInfo(in.scope,
        in.modifiers,
        in.time,
        in.pagingInformation,
        ActorsHandler.extractSortOn(in.sortCommand),
        in.sortDirection.getOrElse(Ascending),
        in.dataFrom,
        in.traceId)
    }

  implicit def toDeviationModuleInfo(in: RawModuleInformation): Try[DeviationModuleInfo] =
    Try {
      DeviationModuleInfo(in.scope,
        in.modifiers,
        in.time,
        in.dataFrom,
        in.traceId)
    }

  implicit def toDeviationsModuleInfo(in: RawModuleInformation): Try[DeviationsModuleInfo] =
    Try {
      DeviationsModuleInfo(in.scope,
        in.modifiers,
        in.time,
        in.pagingInformation,
        DeviationsHandler.extractSortOn(in.sortCommand),
        in.sortDirection.getOrElse(Ascending),
        in.dataFrom,
        in.traceId)
    }

  implicit def toPlayRequestModuleInfo(in: RawModuleInformation): Try[PlayRequestModuleInfo] =
    Try {
      PlayRequestModuleInfo(in.scope,
        in.modifiers,
        in.time,
        in.dataFrom,
        in.traceId)
    }

  implicit def toPlayRequestsModuleInfo(in: RawModuleInformation): Try[PlayRequestsModuleInfo] =
    Try {
      PlayRequestsModuleInfo(in.scope,
        in.modifiers,
        in.time,
        in.pagingInformation,
        PlayRequestsHandler.extractSortOn(in.sortCommand),
        in.sortDirection.getOrElse(Ascending),
        in.dataFrom,
        in.traceId)
    }
}

trait ClientHandlerBase extends Actor with ActorLogging {
  import ClientController._
  import ClientHandler._
  import ClientHandlerBase._

  def jsonHandlerProps: Props
  def overviewHandlerProps: Props
  def actorsHandlerProps: Props
  def actorHandlerProps: Props
  def playRequestsHandlerProps: Props
  def playRequestHandlerProps: Props
  def deviationsHandlerProps: Props
  def deviationHandlerProps: Props

  var modules = Seq.empty[RawModuleInformation]
  val (enum, channel) = Concurrent.broadcast[JsValue]

  val jsonHandler = context.actorOf(jsonHandlerProps, "jsonHandler")
  val overviewHandler = context.actorOf(overviewHandlerProps, "overviewHandler")
  val actorsHandler = context.actorOf(actorsHandlerProps, "actorsHandler")
  val actorHandler = context.actorOf(actorHandlerProps, "actorHandler")
  val playRequestsHandler = context.actorOf(playRequestsHandlerProps, "playRequestsHandler")
  val playRequestHandler = context.actorOf(playRequestHandlerProps, "playRequestHandler")
  val deviationsHandler = context.actorOf(deviationsHandlerProps, "deviationsHandler")
  val deviationHandler = context.actorOf(deviationHandlerProps, "deviationHandler")

  // Add the name of handlers that should only be invoked once to this collection
  val oneTimeHandlers = Seq(RequestModule, DeviationModule)

  def receive = {
    case Tick => modules filter { m => !oneTimeHandlers.contains(m.module) } foreach callHandler
    case Update(js) => channel.push(js)
    case r: HandleRequest => jsonHandler ! r
    case mi: RawModuleInformation => callHandler(mi)
    case InitializeCommunication => sender ! Connection(self, enum)
    case RegisterModules(newModules) =>
      modules = newModules
      for { mi <- newModules } self ! mi
  }

  def callHandler(mi: RawModuleInformation) {
    mi.module match {
      case OverviewModule => mi.sendAs[OverviewHandler.OverviewModuleInfo](overviewHandler, log)
      case ActorsModule => mi.sendAs[ActorsHandler.ActorsModuleInfo](actorsHandler, log)
      case ActorModule => mi.sendAs[ActorHandler.ActorModuleInfo](actorHandler, log)
      case RequestsModule => mi.sendAs[PlayRequestsHandler.PlayRequestsModuleInfo](playRequestsHandler, log)
      case RequestModule => mi.sendAs[PlayRequestHandler.PlayRequestModuleInfo](playRequestHandler, log)
      case DeviationsModule => mi.sendAs[DeviationsHandler.DeviationsModuleInfo](deviationsHandler, log)
      case DeviationModule => mi.sendAs[DeviationHandler.DeviationModuleInfo](deviationHandler, log)
      case _ => log.debug("Unknown module name: {}", mi.module)
    }
  }
}

class ClientHandler(val jsonHandlerProps: Props,
  val overviewHandlerProps: Props,
  val actorsHandlerProps: Props,
  val actorHandlerProps: Props,
  val playRequestsHandlerProps: Props,
  val playRequestHandlerProps: Props,
  val deviationsHandlerProps: Props,
  val deviationHandlerProps: Props) extends ClientHandlerBase

object ClientHandler {

  sealed class Handler(val name: String) {
    override def toString: String = name
  }

  case object OverviewModule extends Handler("overview")
  case object ActorsModule extends Handler("actors")
  case object ActorModule extends Handler("actor")
  case object RequestsModule extends Handler("requests")
  case object RequestModule extends Handler("request")
  case object DeviationsModule extends Handler("deviations")
  case object DeviationModule extends Handler("deviation")

  def fromString(in: String): Option[Handler] = in match {
    case "overview" => Some(OverviewModule)
    case "actors" => Some(ActorsModule)
    case "actor" => Some(ActorModule)
    case "requests" => Some(RequestsModule)
    case "request" => Some(RequestModule)
    case "deviations" => Some(DeviationsModule)
    case "deviation" => Some(DeviationModule)
    case _ => None
  }
}

class JsonHandler extends Actor with ActorLogging {
  import ClientController._
  import JsonHandler._

  implicit val reader = innerModuleReads

  def receive = {
    case HandleRequest(js) => sender ! RegisterModules(parseRequest(js))
  }

  def parseRequest(js: JsValue): Seq[RawModuleInformation] = {
    val time = toTimeRange((js \ "time" \ "rolling").asOpt[String])

    val innerModules = (js \ "modules").as[List[InnerModuleInformation]]
    innerModules map { i =>
      ClientHandler.fromString(i.name) match {
        case Some(name) => RawModuleInformation(
          module = name,
          scope = toScope(i.scope),
          time = time,
          pagingInformation = i.pagingInformation,
          dataFrom = i.dataFrom,
          sortCommand = i.sortCommand,
          sortDirection = i.sortDirection,
          traceId = i.traceId)
        case None => sys.error(s"Could not find requested module: ${i.name}")
      }
    }
  }

  def toScope(i: InternalScope): Scope =
    Scope(
      path = i.actorPath,
      tag = i.tag,
      node = i.node,
      dispatcher = i.dispatcher,
      actorSystem = i.actorSystem,
      playPattern = i.playPattern,
      playController = i.playController)

  def toTimeRange(rolling: Option[String]): TimeRange = rolling match {
    case RollingMinutePattern(value) => TimeRange.minuteRange(System.currentTimeMillis, value.toInt)
    case x =>
      log.warning("Can not use parsed time range (using default 20 minutes instead): %s", x)
      TimeRange.minuteRange(System.currentTimeMillis, 20)
  }
}

object JsonHandler {
  import play.api.libs.json._
  import play.api.libs.functional.syntax._
  import SortDirections._

  implicit val scopeReads = (
    (__ \ "node").readNullable[String] and
    (__ \ "actorSystem").readNullable[String] and
    (__ \ "dispatcher").readNullable[String] and
    (__ \ "tag").readNullable[String] and
    (__ \ "actorPath").readNullable[String] and
    (__ \ "playPattern").readNullable[String] and
    (__ \ "playController").readNullable[String])(InternalScope)

  implicit val pagingReads = (
    (__ \ "offset").read[Int] and
    (__ \ "limit").read[Int])(PagingInformation)

  val innerModuleReads = (
    (__ \ "name").read[String] and
    (__ \ "traceId").readNullable[String] and
    (__ \ "paging").readNullable[PagingInformation] and
    (__ \ "sortCommand").readNullable[String] and
    (__ \ "sortDirection").readNullable[SortDirection] and
    (__ \ "dataFrom").readNullable[Long] and
    (__ \ "scope").read[InternalScope])(InnerModuleInformation)

  final val RollingMinutePattern = """^.*rolling=([1-9][0-9]?)minute[s]?.*""".r
}

case class RegisterModules(moduleInformation: Seq[RawModuleInformation])

case class ScopeModifiers(
  anonymous: Boolean = false,
  temporary: Boolean = false)

case class InternalScope(
  node: Option[String] = None,
  actorSystem: Option[String] = None,
  dispatcher: Option[String] = None,
  tag: Option[String] = None,
  actorPath: Option[String] = None,
  playPattern: Option[String] = None,
  playController: Option[String] = None) {
}

case class InnerModuleInformation(
  name: String,
  traceId: Option[String],
  pagingInformation: Option[PagingInformation],
  sortCommand: Option[String],
  sortDirection: Option[SortDirection],
  dataFrom: Option[Long],
  scope: InternalScope)

trait ModuleInformationBase {
  def scope: Scope
  def modifiers: ScopeModifiers
  def time: TimeRange
  def dataFrom: Option[Long]
  def traceId: Option[String]
}

object SortDirections {
  implicit val reads: Reads[SortDirection] = Reads {
    case JsString(s) => JsSuccess(SortDirection(s))
    case x @ _ => JsError(s"invalid input value for sort direction: $x")
  }

  implicit class SortDirectionsHelpers(in: activator.analytics.rest.http.SortingHelpers.SortDirection) {
    def toLegacy: activator.analytics.data.Sorting.SortDirection = in match {
      case Ascending => activator.analytics.data.Sorting.ascendingSort
      case Descending => activator.analytics.data.Sorting.descendingSort
      case x @ _ => sys.error(s"Unable to convert $x to a legacy sort value")
    }
  }
}

trait MultiValueModuleInformation[S] extends ModuleInformationBase {
  def pagingInformation: Option[PagingInformation]
  def sortOn: S
  def sortDirection: SortDirection
}

case class RawModuleInformation(
  module: ClientHandler.Handler,
  scope: Scope,
  modifiers: ScopeModifiers = ScopeModifiers(),
  time: TimeRange,
  pagingInformation: Option[PagingInformation] = None,
  sortCommand: Option[String],
  sortDirection: Option[SortDirection],
  dataFrom: Option[Long] = None,
  traceId: Option[String] = None) extends ModuleInformationBase {
  def toModuleInformation[T <: ModuleInformationBase](implicit conv: RawModuleInformation => Try[T]): Try[T] = conv(this)
  def sendAs[T <: ModuleInformationBase](to: ActorRef, log: akka.event.LoggingAdapter)(implicit conv: RawModuleInformation => Try[T], ct: ClassTag[T]): Unit =
    this.toModuleInformation[T] match {
      case Success(x) => to ! x
      case Failure(f) => log.error(s"could not convert $this into a value of type ${ct.toString}. Error: ${f.getMessage}")
    }
}

case class PagingInformation(offset: Int, limit: Int)

trait WithPaging[S <: MultiValueModuleInformation[_]] {
  def defaultLimit: Int
  lazy val defaultOffset: Int = 0

  def withPagingDefaults[B](moduleInformation: S, defaultLimit: Int = defaultLimit, defaultOffset: Int = defaultOffset)(body: (Int, Int) => B): B = {
    val (offset, limit) = moduleInformation.pagingInformation.map(x => (x.offset, x.limit)).getOrElse((defaultOffset, defaultLimit))
    body(offset, limit)
  }
}
