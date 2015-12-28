/**
 * Created by Ascarbek on 28.12.2015.
 */
var connect = require('connect');
var serveStatic = require('serve-static');
var path = require('path');

connect().use(serveStatic(path.resolve(__dirname, '..'))).listen(8086);
console.log('server listening at port 8086');
console.log('demo page available at http://localhost:8086/index.html');
