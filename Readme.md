# FF Squad Builder

* http://builder.skewedaspect.com/

This is a squadron builder for the [Fantasy Flight][] [X-Wing Miniatures][] game. It allows you to track your collection,
build/save/edit squads from that collection, preview cards (including unreleased content), and print out a squadron in a
'build mat' style format, for easy play.

[Fantasy Flight]: http://fantasyflightgames.com
[X-Wing Miniatures]: http://fantasyflightgames.com

## Project Goal

The project's goal is to remove the 'card management' aspect of theX-Wing  Miniature's game. I personally own _at least_
one of every expansion, when I want to sit down and play with my friends (who don't have their own collections), it's a
minimum of an hour for us to go through the upgrades, build squads, and get setup. Since most of my friends don't want
to put in the effort to build squads this way, I need something that drastically reduces the time it take to produce a
squad.

Additionally, I find the cards awkward to deal with while playing; typically flat surfaces are at a premium when we
break out the miniatures, so having all my upgrades in a simple to visualize way is very important to me. A 'build mat'
seems a perfect solution to the problem.

## But why another squad builder?

I am aware of both http://xwing-builder.co.uk/ and http://geordanr.github.io/xwing/. I have a few issues with both;
[xwing-builder](http://xwing-builder.co.uk) is _very_ slow for me (I think it's related to my retina display), and
geordanr's project has a ui that I find unpleasant to try an work with. While both sites have the ability to print
squads, the resulting print out is either lacking the card text, or frequently spans to multiple sheets, making it more
awkward to work with.

Technically speaking, I've figured out how to make [xwing-builder](http://xwing-builder.co.uk) do what I want, but it's
awkward enough that  building my own squad builder made sense to me.

### Why not improve Geordanr's project? It's open source.

It is, and I considered doing this. The problem, for me, is that I would want to make such sweeping changes to project
structure, technology (it's a bit of a hodge-podge of various web technology), and UI that it would almost be a new
project. Plus, it's difficult to tell someone you disagree with large amount of their design decisions, without coming
across as an arrogant ass. (Which I am, admittedly.) In the end, I decided to just do my own thing. After all, having
two open source squad builders is hardly the end of the world.

Oh, and it doesn't help that I have a pathological hatred of ruby, and feel
[coffeescript is extremely toxic](http://oscargodson.com/posts/why-i-dont-use-coffeescript.html). I'm not evangelical
about these opinions, however I doubt geordanr would see eye to eye on the removal of SCSS, coffeescript, and the
rewriting of his [x-wing backend project](https://github.com/geordanr/xwing-backend) in [node.js](http://nodejs.org/).
Better if I do my own thing. :)

## Features

As of the current release, this is what squad-builder can do:

* Mobile Device support
    * Specifically designed for use on iPad (Tested on an iPad 4th gen)
    * Specifically designed for use on mobile phones (Tested on a Nexus 5)
* JSON Database of cards
    * Documented json schema.
    * Permissive license to promote reuse of data.
    * Available through a completely open REST API for other developers to leverage, if they wish.
* REST API
    * You can search ships, pilots, and upgrades.
    * Supports filtering through equality, <, >, <=, >=.
* Squads
    * You are disallowed from building flagrantly invalid squads.
    * You can name squads.
    * You can save squads.
    * You can view saved squads.
    * You can print a build mat for a give squad.
    * You can share/link to squads.
* Collection
    * You can track how many of each expansion you own.
* Browser
    * You can search by card name.
    * You can preview cards.
* Account authentication
    * You can use Google to authenticate.

In the future these are the features I'd like to add support for:

* XWS Import/Export
* Card Browser improvements
    * Card images (toggle between build mat format and images)
    * Ability to filter cards by something other than name
* Rules Card support
* Importer improvements
    * 'upsert' mode (current: updates existing models, inserts new ones)
    * 'clean' mode (clears existing db, imports fresh)
    * 'insert' mode (only inserts new records)
* Alternative sources
    * Attack Wing support?
    * Community built cards/ships?

## Card Data

I got my initial data from parsing geordanr's data (as it's in MIT licensed code files), and converting it to my json
format. The project includes an importer (in `/import`), and a readme on how to use it. That being said, my data has
diverged from his, and while I've tried to backport those changes into the import script, I expect the importer to
become increasingly out of date the more changes I make.

I have made significant attempts to format the data in a useful, extensible, and accessible. I _want_ you to use my
data. Do I have a typo? An issue? Please, submit a bug, and/or a pull request to fix it! Am I missing something? Add
it, and submit a pull request.

### REST API

I allow anyone to use the (very basic) REST api I've written for searching cards. My traffic is limited, however, so
please be kind about hitting it. If it gets abused, I will enable a same-origin policy and block public access. Don't be
that guy.

If you expect to be doing a large number of requests (>200/day), please, [contact me](mailto:chris.case@g33xnexus.com).
I will be willing to work out something.

## Contributions

I am open to contributions of all natures. I prefer pull requests, but I'm willing to work with you to get your
improvements in. Keep in mind; Just because you think your change is an improvement doesn't mean I will. I'm always open
to discussion, but at the end of the day, it's my project, so don't be offended if I tell you that I'm not interested in
your change.
