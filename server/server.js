/**
 * Created by Ascarbek on 01.12.2015.
 */
var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname + '/../dist')).listen(8085);
