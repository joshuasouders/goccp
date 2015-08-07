GOCCP DASHBOARD
===========

To deploy:

* Install node.
* Run a npm install on the top directory of the code.
* Install redis on the system. There's a Windows version out there, this dashboard is being developed with Redis 2.8 on the Windows port. It can be run via a Windows Service, which is probably best in production.
* Install grunt. Execute the command "grunt" on the top directory.
* The node server needs to be started ("node server.js" on the top directory for testing purposes, but in production it should also be a Windows Service).
* You can get to the site locally via localhost:3002.