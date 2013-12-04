package activator

import scala.concurrent._
import java.net._
import scala.util.control.NonFatal

object TemplatePopularityContest {
  def recordCloned(name: String)(implicit ec: ExecutionContext): Future[Int] = {
    // we use this constructor because it would escape any
    // chars in "name" though in theory name is an url-friendly
    // name to begin with.
    val uri = new URI("https", null, "typesafe.com", -1,
      s"/activator/template/$name/record-cloned", null, null)
    Future {
      val url = uri.toURL()
      url.openConnection() match {
        case c: HttpURLConnection =>
          c.setRequestMethod("POST")
          c.connect()
          val code = c.getResponseCode()
          c.disconnect()
          code
      }
    }
  }

  def recordClonedIgnoringErrors(name: String)(implicit ec: ExecutionContext): Future[Unit] =
    recordCloned(name) map { _ => () } recover {
      case NonFatal(e) =>
        Future.successful(())
    }
}
