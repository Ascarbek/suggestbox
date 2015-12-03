/**
 * Created by Ascarbek on 01.12.2015.
 */
var connect = require('connect');
var serveStatic = require('serve-static');
var path = require('path');
var envConfig = require('./env.config.json');

connect().use(serveStatic(path.resolve(__dirname, '..', envConfig.envDir) )).listen(8085);
console.log('server listening at port 8085');
console.log('demo page available at http://localhost:8085/demo.html');
