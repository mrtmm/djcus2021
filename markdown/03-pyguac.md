# PyGuacamole

<!-- Note -->
So! Enter a pure-Python Guacamole client: `PyGuacamole`!


<!-- .slide: data-background-image="images/github-pyguacamole.png" data-background-size="contain" -->

<!-- Note -->
What’s PyGuacamole?

Well, as we just saw, to replace the Java servlet we need a client
that can talk to the Guacamole server, `guacd` on one end and to the browser
on the other end.
So, `PyGuacamole` is a python library that gives us the _client_ for
communicating with `guacd`. And we are going to look at how to use it
in just a bit.

However, we still need to connect a few dots here. We also need the
browser to talk to this client. Our goal is to get a terminal
or a deskdop window to the browser and we want to be able to interact
with it, right? We need to connect to this client in a way that
allows bidirectional communication and for that we'll be using websockets.


<!-- .slide: data-background-iframe="https://channels.readthedocs.io/en/stable/" data-background-size="contain" -->

<!-- Note -->
And so, as all of you probably know, to handle other protocols aside
from HTTP in a Django project, we'll need to use `Channels`. 
`Channels` is built on `ASGI`, Asynchronous Server Gateway Interface,
that supports multiple protocols. The basic unit of `Channels` code 
is a `Consumer` and that's what we need create for our application,
a Consumer.


<!-- .slide: data-background-image="images/student_view.png" data-background-size="contain" -->

<!-- Note -->
Alright, so let's look at the code!

`hastexo.py`:
Let’s start with the view. Our project, the `hastexo-xblock` is a
plugin for `edx-platform`, so the view will be rendered as a part
of one, what we call a "unit" page. So, our view is the `student_view`
in `hastexo.py`. Just to show you really quick, _here_ is where we
render the main template and load the related Javascript files:
the minified `guacamole-common-js` and our `main.js`.

The Javascript part actually stays the same, it works exactly as
it would with the Java servlet. So I won't stop here any more than
to just to show you how we initialise the Javascript client.


<!-- .slide: data-background-image="images/consumer_1.png" data-background-size="contain" -->

<!-- Note -->
Now, let's move on to the most important part, the `consumer.py` file. 
Since we are using websockets here and this communication runs in an
asynchronous manner, we are implementing the `AsyncWebsocketConsumer`
from `Channels` and we are calling it the `GuacamoleWebSocketConsumer`.

So, two things we need to define here, the `client` and a `task`.


<!-- .slide: data-background-image="images/consumer_2.png" data-background-size="contain" -->

<!-- Note -->
And this is where `pyguacamole` comes in. On websocket `connect` we 
import the `GuacamoleClient` from `pyguacamole` and initialize it.

For our target stack, what we want to connect to, we get the information
from the database. Using `database_sync_to_async` from `channels.db`,
we can get the `Stack` object as you can see in our `get_stack` method.


<!-- .slide: data-background-image="images/consumer_3.png" data-background-size="contain" -->

<!-- Note -->
Now, back to the `GuacamoleClient`, we need to provide the _hostname_
and _port_ for `guacd` and we are going to call _handshake_ here. 

Let's go over the parameters for this:
* we need to provide the protocol for the connection with the target,
  in our case this is either `ssh` or `rdp`.
* we need to pass the `hostname`, `port`, `username`, `password` 
  and `private_key` for the target.
* we can customize the size of the window we draw in the browser
  by passing the `width` and `height`, in pixels.
* and we have some additional customization options here: `color_scheme`,
  `font_name` and `font_size`.

There are more options for customization which are all defined and
explained in the `Guacamole` documentation.


<!-- .slide: data-background-image="images/consumer_4.png" data-background-size="contain" -->

<!-- Note -->
Right, so now when we are connected to the client, we are going to create
a _task_, _open_ the communication and _accept_ the connection.


<!-- .slide: data-background-image="images/consumer_5.png" data-background-size="contain" -->

<!-- Note -->
When we `open` the connection here, we start _receiving_ data from the
`GuacamoleClient` and if we get something to send, we _send_ it to
the websocket.

And everything we recieve from the websocket here, we send to the
GuacamoleClient. For example, what one will type in the terminal window
in the browser, will be passed to the `GuacamoleClient` here as a 
`key` event.
We have a use case, where we want to display a terminal window in
`read_only` mode, so this is what you can see here. When switced on,
we just block, or well ignore to be more exact, all mouse and key events.

And the last thing we do here, is _cancel_ the task and _close_ the
client connection when the websocket gets disconnected.

And that's all we need for the consumer, less than a 100 lines of code!


<!-- .slide: data-background-image="images/djcon_code_screen_4.png" data-background-size="contain" -->

<!-- Note -->
What we also need to do, is define the `application` in `routing.py`
and point the websocket to our `GuacamoleWebSocketConsumer`.


<!-- .slide: data-background-image="images/djcon_code_screen_5.png" data-background-size="contain" -->

<!-- Note -->
In `settings.py`, amongst other things, we point to our ASGI application:
`hastexo_guacamole_client.routing.application`. And note that 'channels'
needs to be added to `INSTALLED_APPS`.


<!-- .slide: data-background-image="images/django-docs-daphne.png" data-background-size="contain" -->

<!-- Note -->
OK, so now we have gone through the code but how do we run it?

Well, there is an official ASGI HTTP/Websocket server, called `Daphne`,
which is maintained by the `Channels` project. We really have no reason
_not_ to use it and look for other options, which there are! So for us,
we are using `Daphne`. 
But, in order to scale the number of processes, we are running it
with `supervisord`.


<!-- .slide: data-background-video="videos/djcon_docs_screen.mp4" data-background-size="contain" -->

<!-- Note -->
There is a great example for this in the `Channels` documentation, that
I want to show you here.

(show a scroll through of example setups: https://channels.readthedocs.io/en/2.x/deploying.html#example-setups) 

As you can see here, we have an example setup description, that gives
us the supervisor configuration file and this is what we used as a
referance as well.
