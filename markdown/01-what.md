<!-- .slide: data-background-image="images/cca-start-page.png" data-background-size="contain" -->

<!-- Note -->
OK, so how does that look like exactly? Well, let me show you what I mean.
So, I work in City Network, in the education team, and what my team does 
it that we run these learning platforms, one of which is the City Cloud Academy 
that you see on your screen right now.


<!-- .slide: data-background-image="images/open_edx.png" data-background-size="contain" -->

<!-- Note -->
Our platforms are based on Open edX, which is a free, open source
learning management system that anyone can run. It also happens to be a
big set of django applications itself. But, this is not what I will be
focusing on today. 


<!-- .slide: data-background-image="images/open_edx_events.png" data-background-size="contain" -->

<!-- Note -->
Open edX also has it's own annual conferences 
and there are plenty of talks out there to catch up on if you are interested.


<!-- .slide: data-background-image="images/cca-start-page.png" data-background-size="contain" -->

<!-- Note -->
OK, so let's look at the City Cloud Academy a bit more. So we run this 
learning platform to teach people complex technologies

-- like Ceph, Kubernetes, OpenStack, Terraform, that sort of
thing. And I hope that you agree with us that most people learn best
by doing. So, you don't want to just _read_ about all those things or
look at someone _else_ do them, you of course want to try out everything yourself.

And because all those technologies are inherently distributed, you
want to learn them on distributed systems as well. You want to learn 
them on _Real platforms._ Like a lab that your company might have available in hardware.

But. A hardware lab is expensive. And it's not probably very
easy to get access to that sort of resource. And sometimes that
can be outright impossible.
So, in comes cloud technology. As it happens, I work for a cloud company,
and that does come in handy for providing interactive labs as we do. But that is
also not what I will be focusing on today.

https://academy.citycloud.com


<!-- .slide: data-background-video="videos/screencast-terminal.mp4" data-background-size="contain" -->

<!-- Note -->
OK, as I promised, let me show you what I mean by bringing a shell into your browser. 
So, here we open up a page on the learning management system -- the "LMS" -- 
and it contains this window, an interactive terminal. That is 
your entry point to your own little lab.

So in this case here, what the learner is doing is they drop into the
terminal, they look around a bit, and then they decide that they’re
about to develop and compile something, so they start by installing
the `build-essential` metapackage.

And without a learner knowing it, once they first hit this page, the LMS
made an API call to the cloud platform on their behalf and spun up a 
stack, a lab environment for them -- in this case it’s just one Ubuntu
machine, but it could be 5, could be 10, could be 3 that each
run a number of containers, whatever -- and then the learner was presented with
this terminal, right there in their browser. And as you can see, this terminal is
of course fully interactive.


<!-- .slide: data-background-video="videos/screencast-desktop.mp4" data-background-size="contain" -->

<!-- Note -->
And -- as you can see in the next lab that we’re progressing to here
--, that window doesn't necesarily need to be a terminal, it can be
a full-blown desktop as well. And what you see here is just a demonstration that yes, 
this thing **is** a fully interactive platform, for example we can open
LibreOffice Writer and create some text in it.

Now, I am not here today to talk about all the details of how 
the interaction with this cloud platform works, or how the lab stacks spin up, 
or how they automatically go to sleep, when you don't use them, 
or how they magically wake up, when you come back to them --
because that has already been done by my colleagues and I will share the links in the end of this talk.

Ok, so why _am_ I here today and what _is_ this talk about?
Well, this talk is about zooming in on precisely how this entry point
to your own little lab works. 
How, exactly, you can make a fully interactive terminal or
desktop session pop up in someone's browser -- using Django, of
course.
