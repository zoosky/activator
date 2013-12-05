package snap

import play.api._
import play.api.mvc._
import play.filters.csrf._
import play.api.libs.iteratee._

object WebSocketUtil {

  private val TokenParam = "token"

  // differences from the regular CSRFCheck are:
  //  - we check the token always (don't allow bypass if certain headers are present)
  //  - we work on WebSocket not Action
  // See https://github.com/playframework/playframework/issues/1788
  // for a future official replacement.
  private def csrfCheckedWebSocket[A](tokenProvider: CSRF.TokenProvider,
    wrapped: WebSocket[A]): WebSocket[A] = {
    def checkedF(request: RequestHeader): (Enumerator[A], Iteratee[A, Unit]) => Unit = {
      for {
        cookieToken <- CSRF.getToken(request)
        queryToken <- request.getQueryString(TokenParam)
        if (tokenProvider.compareTokens(queryToken, cookieToken.value))
      } yield wrapped.f(request)
    } getOrElse {
      throw new RuntimeException("Bad CSRF token for websocket")
    }

    WebSocket(f = checkedF)(wrapped.frameFormatter)
  }

  // unfortunately we have a cut-and-pasted default for this config option
  // because Play has defaults in code rather than in reference.conf
  private def signTokens(implicit app: Application): Boolean =
    app.configuration.getBoolean("csrf.sign.tokens").getOrElse(true)

  def socketCSRFCheck[A](ws: WebSocket[A]): WebSocket[A] = {
    import play.api.Play.current

    csrfCheckedWebSocket(if (signTokens) CSRF.SignedTokenProvider else CSRF.UnsignedTokenProvider,
      ws)
  }

  def webSocketURLWithCSRF[A](socketCall: Call)(implicit request: RequestHeader): String = {
    import snap.EnhancedURI._
    val token =
      CSRF.getToken(request).getOrElse(throw new RuntimeException("Can't get CSRF token for websocket")).value
    (new java.net.URI(socketCall.webSocketURL()))
      .addQueryParameter(TokenParam, token)
      .toASCIIString
  }
}
