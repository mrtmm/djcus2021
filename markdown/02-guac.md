<!-- .slide: data-background-image="https://svn.apache.org/repos/asf/comdev/project-logos/originals/guacamole.svg" data-background-size="contain" -->
# Apache Guacamole <!-- .element class="hidden" -->

<!-- Note -->
So the technology that this all revolves around is Apache
Guacamole. And I am going to do a bit of a refresher on Guacamole
terms and technology here. If you are not familiar with it, this should be 
enough to give you a general ovewrview. If you are already familiar 
with Apache Guacamole, as I said this is just a bit of a refresher.

So from here on out I am going to assume two things.


<!-- .slide: data-background-image="images/guacamole-overview-01.svg" data-background-size="contain" -->

<!-- Note -->
1. You're a learner on our platform, and you've opened up a page in a course that contains a lab. 
   That lab has now successfully spun up a random box somewhere in the cloud 
   (like you just saw). So, "there is something for us to work with".


<!-- .slide: data-background-image="images/guacamole-overview-02.svg" data-background-size="contain" -->

<!-- Note -->
2. We’re able to connect to an IP address that's been exposed on that   box, and to two TCP ports: one
   for secure shell (usually port 22), and one for RDP (usually port
   3389).
   
   We could also be using VNC, but the same principle applies. So
   I'll just stick with SSH and RDP for now.


<!-- .slide: data-background-image="images/guacamole-overview-03.svg" data-background-size="contain" -->

<!-- Note -->
OK, so, the first thing we'll look at is the Guacamole
**server**, or `guacd`. This is a server binary that's written in C,
so it's very fast and efficient, and it connects to upstream SSH or RDP 
services using **protocol plugins**.

So, to the services running on your box, to the SSH or RDP daemon, the 
guacd *server* acts as an SSH or RDP *client*. I am mentioning this because 
the terms can get a bit confusing here as you'll see shortly so just  stay with me.


<!-- .slide: data-background-image="images/guacamole-overview-04.svg" data-background-size="contain" -->

<!-- Note -->
The guacd server's job is to take all these various upstream protocols
and translate them into a unified event stream using what's called the
Guacamole **protocol**. The idea is that whatever comes down the pipe,
whether it's SSH or RDP or VNC or whatever, is translated into one event
stream that's always the Guacamole protocol.

OK but your browser of course doesn't _speak_ the Guacamole
protocol. It speaks HTTP and Websockets. So we do need another
translation engine.


<!-- .slide: data-background-image="images/guacamole-overview-05.svg" data-background-size="contain" -->

<!-- Note -->
And here's where the naming gets more confusing, because in
Guacamole's documentation this thing is called the Guacamole _client,_
even though it's very much a _server_ to your browser. But the naming
is correct in a sense that it is indeed the _client_ part of the communication
between two endpoints _speaking the Guacamole protocol,_ the server
being guacd.


<!-- .slide: data-background-image="images/guacamole-overview-06.svg" data-background-size="contain" -->

<!-- Note -->
So the Guacamole "client" is the thing that speaks the Guacamole
protocol on one end -- to the guacd server --, and Websockets on the
other -- to your browser. And then to complete the picture you've got
some JavaScript on the browser that is responsible for rendering what
it gets from the websocket stream.


<!-- .slide: data-background-image="images/guacamole-overview.svg" data-background-size="contain" -->

<!-- Note -->
So this is the general architecture we're talking about. Keep this
picture in mind; I'll come back to it a few more times during this talk.


<!-- .slide: data-background-iframe="https://player.vimeo.com/video/116207678" -->

<!-- Note -->
Now, the Guacamole "client" which those of you who know Guacamole
already will be most familiar with is a Java servlet application. Most
of the time, what people do is

* deploy guacd
* deploy the guacamole servlet application

And what they get is a nice remote-desktop manager. 

And this bit here is an admittedly really old version of Guacamole
being showcased in a little video that you can find on the Guacamole
website, where you can see how you can connect, from that
remote-desktop manager application, to some Windows hosts and Linux
hosts and anything that speaks one of the protocols that `guacd` can
understand.


<!-- .slide: data-background-iframe="https://guacamole.apache.org/doc/gug/writing-you-own-guacamole-app.html" -->

<!-- Note -->
Now if you don't need the standard Guacamole remote-desktop manager,
and you want to incorporate Guacamole into your own application, the
developers give you a nice how-to for [how to build your
own](https://guacamole.apache.org/doc/1.3.0/gug/writing-you-own-guacamole-app.html)
-- again, using a Java servlet stack.


<!-- .slide: data-background-image="images/guacamole-overview-java-tomcat.svg" data-background-size="contain" -->

<!-- Note -->
OK, but now **what if** you don't want to take the Java detour? For
example, what if you already have some data in Django models that you
can nicely access in the Django ORM, that you somehow want to make
accessible to Guacamole.

As a simple example: you may be generating one-time SSH keys for
connecting to your labs. You create these keys when you spin up a
new lab and that you delete them when you throw away the lab away. So every key
is always for one lab only and you never reuse those keys. So, you 
want to store that data in Django somewhere, like, two FileFields
pointing to the private and public key files. 

So when you tear down the lab environment you'll throw the keys away, 
but while the lab is alive you want to grab that data from your database 
and use it to create a Guacamole connection.


<!-- .slide: data-background-image="images/guacamole-overview-python-django.svg" data-background-size="contain" -->

<!-- Note -->
So, what if you could bypass the Java servlet bits altogether? 

Maybe you don't want to add a Java runtime environment and servlet
container to your deployment chain? Maybe you're a pure-Python shop
and simply don't have Java development capacity on your team? Maybe
you just really, really like using Django?

What if you could write a Guacamole client, in
Python, using Django, that has access to everything that's in your
data model and that you can just plug into your Django deployment
pipeline? Well as it turns out I have some good news for you,
you can do exactly that.
