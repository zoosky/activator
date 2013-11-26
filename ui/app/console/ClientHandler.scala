/**
 * Copyright (C) 2013 Typesafe <http://typesafe.com/>
 */
package console

import akka.actor.{ Props, ActorLogging, Actor }
import console.handler._
import console.parser.{ SpanParser, TimeParser, TimeQuery }
import play.api.libs.iteratee.Concurrent
import play.api.libs.json._
import scala.collection.Seq

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
  val oneTimeHandlers = Seq(requestModule, deviationModule)

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
      case overviewModule => overviewHandler ! mi
      case actorsModule => actorsHandler ! mi
      case actorModule => actorHandler ! mi
      case requestsModule => playRequestsHandler ! mi
      case requestModule => playRequestHandler ! mi
      case deviationsModule => deviationsHandler ! mi
      case deviationModule => deviationHandler ! mi
      case _ => log.debug("Unknown module name: {}", mi.name)
    }
  }
}

object ClientHandler {
  val overviewModule = "overview"
  val actorsModule = "actors"
  val actorModule = "actor"
  val requestsModule = "requests"
  val requestModule = "request"
  val deviationsModule = "deviations"
  val deviationModule = "deviation"
}

class JsonHandler extends Actor with ActorLogging {
  import ClientController._
  import JsonHandler._

  implicit val reader = innerModuleReads

  def receive = {
    case HandleRequest(js) => sender ! RegisterModules(parseRequest(js))
  }

  def parseRequest(js: JsValue): Seq[ModuleInformation] = {
    val time = TimeParser.parseTime(
      (js \ "time" \ "start").asOpt[String],
      (js \ "time" \ "end").asOpt[String],
      (js \ "time" \ "rolling").asOpt[String],
      Some(log))

    val span = (js \ "span").asOpt[String].getOrElse(SpanParser.DefaultSpanType)
    val innerModules = (js \ "modules").as[List[InnerModuleInformation]]
    innerModules map { i =>
      ModuleInformation(
        name = i.name,
        scope = i.scope,
        time = time,
        span = span,
        pagingInformation = i.pagingInformation,
        dataFrom = i.dataFrom,
        sortCommand = i.sortCommand,
        traceId = i.traceId)
    }
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
    (__ \ "actor").readNullable[String] and
    (__ \ "playPattern").readNullable[String] and
    (__ \ "playController").readNullable[String])(Scope)

  implicit val pagingReads = (
    (__ \ "offset").read[Int] and
    (__ \ "limit").read[Int])(PagingInformation)

  val innerModuleReads = (
    (__ \ "name").read[String] and
    (__ \ "traceId").readNullable[String] and
    (__ \ "paging").readNullable[PagingInformation] and
    (__ \ "sortCommand").readNullable[String] and
    (__ \ "dataFrom").readNullable[Long] and
    (__ \ "scope").read[Scope])(InnerModuleInformation)
}

case class RegisterModules(moduleInformation: Seq[ModuleInformation])

case class Scope(
  node: Option[String] = None,
  actorSystem: Option[String] = None,
  dispatcher: Option[String] = None,
  tag: Option[String] = None,
  actorPath: Option[String] = None,
  playPattern: Option[String] = None,
  playController: Option[String] = None) {

  import RequestHandler.mapify

  def queryParams: Map[String, String] = {
    Seq(
      "node" -> node,
      "actorSystem" -> actorSystem,
      "dispatcher" -> dispatcher,
      "tag" -> tag,
      "actorPath" -> actorPath,
      "playPattern" -> playPattern,
      "playController" -> playController).
      map(x => mapify(x._1, x._2)).head
  }
}

case class InnerModuleInformation(
  name: String,
  traceId: Option[String],
  pagingInformation: Option[PagingInformation],
  sortCommand: Option[String],
  dataFrom: Option[Long],
  scope: Scope)

case class ModuleInformation(
  name: String,
  scope: Scope,
  time: TimeQuery,
  span: String,
  pagingInformation: Option[PagingInformation] = None,
  sortCommand: Option[String] = None,
  dataFrom: Option[Long] = None,
  traceId: Option[String] = None)

case class PagingInformation(offset: Int, limit: Int)