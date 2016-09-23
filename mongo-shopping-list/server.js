//Express app, handle request bodies, and middleware to serve the static assets
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var config = require('./config');

var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
///////////////////////////////////////////////////////

//coordinates both the connection to the database and running HTTP
var runServer = function(callback) {
    //using Mongoose to connect to database using the URL
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }
        //listen for any new connections
        app.listen(config.PORT, function() {
            //says it works :D
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};
//makes this file executable script, and a module
if (require.main === module) {
    //if called by 'node server.js' then the runServer function runs
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};
/////////////////////////////////////////////////
var Item = require('./models/item');
////////////////////LETS YOU READ THINGS/////////////
app.get('/items', function(req, res) {
    //gets list of all items from database
    Item.find(function(err, items) {
        if (err) {
            //if error, returns 500
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.json(items);
    });
});
/////////////////////ALLOWSEDTING////////////////////
app.post('/items', function(req, res) {
    //creates a new item
    Item.create({
        name: req.body.name
    }, function(err, item) {
        if (err) {
            //if error, returns 500
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
    });
});

//////////////////EXTERMINATION/////////////////
app.delete('/items/:id', function(req, res) {
    //deletes stuffz
    Item.remove({
        _id: req.params.id
    }, function(err, item) {
        if (err) {
            //if error, returns 500
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
       res.status(200).json(item);
        });
});

///////////////////I WANT CHANGE////////////////////
app.put('/items/:id', function(req, res) {
    //deletes stuffz
    Item.update(
        {_id: req.params.id},
        {name: req.body.name},
        function(err, item) {
        if (err) {
            //if error, returns 500
            return res.status(500).json({
                message: err
            });
        }
       res.status(200).json(item);
       
    });
    console.log(req.body.name);
});

/////////////////////////////////////////////////////

app.use('*', function(req, res) {
    //if neither endpoints were hit
    res.status(404).json({
        message: 'Not Found'
    });
});

exports.app = app;
exports.runServer = runServer;