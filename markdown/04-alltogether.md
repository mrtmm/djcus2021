# Putting It All Together

<!-- Note -->
Now finally, how does this all work together? You may have noticed
that we run one application -- Open edX's LMS -- that is all classic
HTTP and Django and Gunicorn and WSGI, together with another -- the
Guacamole client -- that runs with websockets, async Django, Channels,
Daphne, and ASGI.

And what we do here is something that's ubiquitous in Open edX all
over the place, which is to run everything behind nginx. Open edX has
a bunch of separate services *besides* the LMS, such as Open edX Studio
-- a course authoring tool -- and a certificate verification service
and several others. So, to unify things like SSL certificate
management and even having one IP address for all services, we just
throw everything behind nginx.


<!-- .slide: data-background-video="videos/rdp-event.mp4" data-background-size="contain" -->

<!-- Note -->
So to sum it all up, let's follow the track of how an RDP or SSH
session ends up in an interactive browser window, one more time:


<!-- .slide: data-background-image="images/guacamole-nginx-01.svg" data-background-size="contain" -->

<!-- Note -->
* RDP traffic originates with the upstream server, anywhere in the
  world.


<!-- .slide: data-background-image="images/guacamole-nginx-02.svg" data-background-size="contain" -->

<!-- Note -->
* guacd receives that traffic, translates it into generic event stream
  and encodes it in the Guacamole protocol. This happens in a C
  binary.


<!-- .slide: data-background-image="images/guacamole-nginx-03.svg" data-background-size="contain" -->

<!-- Note -->
* A guacamole client, running on the same server as guacd, takes that
  event stream and translates it into a websocket stream. This is an
  async Django app running in Daphne with ASGI, using PyGuacamole.


<!-- .slide: data-background-image="images/guacamole-nginx-04.svg" data-background-size="contain" -->

<!-- Note -->
* nginx proxies the websocket stream into a URL path hierarchy shared
  with other Open edX services, themselves synchronous Django apps
  running in Gunicorn.


<!-- .slide: data-background-image="images/guacamole-nginx-05.svg" data-background-size="contain" -->

<!-- Note -->
* Your browser receives the mixed HTTP/websocket content received from
  nginx. One of the things your browser receives is the statically
  served Guacamole web client JavaScript library.
* Your browser takes that library, and uses it to interpret the web
  socket stream and displays it in your browser window.


<!-- .slide: data-background-video="videos/rdp-click.mp4" data-background-size="contain" -->

<!-- Note -->
Now you hit a key or click in the window on your browser.


<!-- .slide: data-background-image="images/guacamole-nginx-06.svg" data-background-size="contain" -->

<!-- Note -->
* A JavaScript event listener notices the key strike or pointer click.
* It sends a Websocket request up to nginx.


<!-- .slide: data-background-image="images/guacamole-nginx-07.svg" data-background-size="contain" -->

<!-- Note -->
* nginx proxies that event to the ASGI listener exposed by Daphne.
* The listener takes the web socket event and translates it into a
  Guacamole protocol event.


<!-- .slide: data-background-image="images/guacamole-nginx-08.svg" data-background-size="contain" -->

<!-- Note -->
* PyGuacamole passes the event on to guacd.


<!-- .slide: data-background-image="images/guacamole-nginx-09.svg" data-background-size="contain" -->

<!-- Note -->
* guacd translates it into an RDP event.
* guacd's RDP client library (linked to freerdp2) sends the RDP event
  on to the upstream server.


<!-- .slide: data-background-image="images/guacamole-nginx-01.svg" data-background-size="contain" -->

<!-- Note -->
The server processes the event, sends an update back down the wire,...


<!-- .slide: data-background-image="images/guacamole-nginx-02.svg" data-background-size="contain" -->

<!-- Note -->
And that's how you put a desktop -- or a terminal session -- in any
browser, with Django!
