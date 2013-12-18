/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console

import akka.actor.{ Props, ActorLogging, Actor }
import console.handler._
import play.api.libs.iteratee.Concurrent
import play.api.libs.json._
import scala.collection.Seq
import activator.analytics.data.{ TimeRange, Scope }

class ClientHandler extends Actor with ActorLogging {
  import ClientController._
  import ClientHandler._

  var modules = Seq.empty[ModuleInformation]
  val (enum, channel) = Concurrent.broadcast[JsValue]

  val jsonHandler = context.actorOf(Props[JsonHandler], "jsonHandler")
  val overviewHandler = context.actorOf(Props[OverviewHandler], "overviewHandler")
  val actorsHandler = context.actorOf(Props[ActorsHandler], "actorsHandler")
  val actorHandler = context.actorOf(Props[ActorHandler], "actorHandler")
  val playRequestsHandler = context.actorOf(Props[PlayRequestsHandler], "playRequestsHandler")
  val playRequestHandler = context.actorOf(Props[PlayRequestHandler], "playRequestHandler")
  val deviationsHandler = context.actorOf(Props[DeviationsHandler], "deviationsHandler")
  val deviationHandler = context.actorOf(Props[DeviationHandler], "deviationHandler")

  // Add the name of handlers that should only be invoked once to this collection
  val oneTimeHandlers = Seq(RequestModule, DeviationModule)

  def receive = {
    case Tick => modules filter { m => !oneTimeHandlers.contains(m.name) } foreach callHandler
    case Update(js) => channel.push(js)
    case r: HandleRequest => jsonHandler ! r
    case mi: ModuleInformation => callHandler(mi)
    case InitializeCommunication => sender ! Connection(self, enum)
    case RegisterModules(newModules) =>
      modules = newModules
      for { mi <- newModules } self ! mi
  }

  def callHandler(mi: ModuleInformation) {
    mi.name match {
      case OverviewModule => overviewHandler ! mi
      case ActorsModule => actorsHandler ! mi
      case ActorModule => actorHandler ! mi
      case RequestsModule => playRequestsHandler ! mi
      case RequestModule => playRequestHandler ! mi
      case DeviationsModule => deviationsHandler ! mi
      case DeviationModule => deviationHandler ! mi
      case _ => log.debug("Unknown module name: {}", mi.name)
    }
  }
}

object ClientHandler {
  val OverviewModule = "overview"
  val ActorsModule = "actors"
  val ActorModule = "actor"
  val RequestsModule = "requests"
  val RequestModule = "request"
  val DeviationsModule = "deviations"
  val DeviationModule = "deviation"
}

class JsonHandler extends Actor with ActorLogging {
  import ClientController._
  import JsonHandler._

  implicit val reader = innerModuleReads

  def receive = {
    case HandleRequest(js) => sender ! RegisterModules(parseRequest(js))
  }

  def parseRequest(js: JsValue): Seq[ModuleInformation] = {
    val time = toTimeRange((js \ "time" \ "rolling").asOpt[String])

    val innerModules = (js \ "modules").as[List[InnerModuleInformation]]
    innerModules map { i =>
      ModuleInformation(
        name = i.name,
        scope = toScope(i.scope),
        time = time,
        pagingInformation = i.pagingInformation,
        dataFrom = i.dataFrom,
        sortCommand = i.sortCommand,
        traceId = i.traceId)
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
    (__ \ "dataFrom").readNullable[Long] and
    (__ \ "scope").read[InternalScope])(InnerModuleInformation)

  final val RollingMinutePattern = """^.*rolling=([1-9][0-9]?)minute[s]?.*""".r
}

case class RegisterModules(moduleInformation: Seq[ModuleInformation])

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
  dataFrom: Option[Long],
  scope: InternalScope)

case class ModuleInformation(
  name: String,
  scope: Scope,
  time: TimeRange,
  pagingInformation: Option[PagingInformation] = None,
  sortCommand: Option[String] = None,
  dataFrom: Option[Long] = None,
  traceId: Option[String] = None)

case class PagingInformation(offset: Int, limit: Int)
