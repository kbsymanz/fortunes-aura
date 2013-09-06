# Chaplin Front-end for the Fortunes Server

This is a proof of concept to illustrate the use of [Aura](http://aurajs.com) as a front-end framework for the [Fortunes Server](https://github.com/kbsymanz/fortunes-server). The purpose of this project is to help our team decide on a client-side framework to use internally. If others find this useful, all the better.

In a manner similar to [ToDoMVC](http://todomvc.com/), the goal is to explore [Backbone](http://backbonejs.org/) based front-end client frameworks against a common backend. In this case, the [Fortunes Server](https://github.com/kbsymanz/fortunes-server) is our backend which provides a number of services to the client over [Socket.io](http://socket.io/). We are not interested per se in "fortunes" - the fortunes are data and the server offers services against the data. The server could have been implemented with any other dataset.

Regarding Backbone, unlike Chaplin and Marionette, Aura does not have a dependency upon Backbone, though it certainly is compatible with Backbone.

These front-ends are on the list to be implemented.

- [Chaplin.js](http://chaplinjs.org): [fortunes-chaplin](https://github.com/kbsymanz/fortunes-chaplin)
- [Marionette](http://marionettejs.com/): to be implemented
- [Aura](http://aurajs.com/): (you are looking at it)

## Primary technologies being explored/integrated

- Various Backbone based frameworks (see above)
- [Socket.io](http://socket.io/)
- [Bootstrap](http://twitter.github.io/bootstrap/)
- [Requirejs](http://requirejs.org/)
- [Handlebars](http://handlebarsjs.com/)
- [HTML5 LocalStorage](http://en.wikipedia.org/wiki/Web_storage)

## Installation of the server

See the README on the [fortunes-server](https://github.com/kbsymanz/fortunes-server) project. This has to be done first because the clients are not meant to be run stand-alone.

## Installation of the clients

You installed the server, right? If so, clone each client project that you want into it's own directory.

    git clone https://github.com/kbsymanz/fortunes-chaplin.git

The code to use is in the ```fortunes``` branch so change to that branch with Git if it is not already there.

## Running the server and clients

See the README on the [fortunes-server](https://github.com/kbsymanz/fortunes-server) project on how to start the server, including with various options. Then navigate to __127.0.0.1:9000__ (default unless you changed it with one of those options outlined on the server project).


