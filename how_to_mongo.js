var express = require('express'),
    router = express.Router(),
    pg = require('pg'),
    // moment = require('moment'),
    MongoClient = require('mongodb').MongoClient,
    connectionString = /*process.env.DATABASE_URL ||*/ 'postgres://danny:coder123@localhost:5432/test';
    // mongoConnectionString = process.env.MONGO_URL || 'mongodb://localhost:27017/turnout_results',

// var countTypes = [ 'ballot', 'da', 'anc', 'eff', 'other' ];

router.get('/users', function(req, res, next) {
  pg.connect(connectionString, function(err, client, done) {
    if(err) return next(err);
    var query = client.query("SELECT * FROM users");
    var results = [];
    query.on('row', function(row) {
        results.push(row);
    });
    query.on('end', function() {
      if(results.length === 0) {
        res.send({});
      } else {
        console.log(results);
        res.send(results);
      }
      done();
    });
  });
});

module.exports = router;
//ORIGINAL TAARIQ CODE
// router.post('/latest_counts/:vd_id', checkForAdminGroup, function( req, res, next ) {
//   var vd_id = req.body.vd_id;
//   var data = req.body.count_data;
//   var count_data = {};
//   for (var x = 0; x < data.length; x++) {
//     count_data[data[x].count_type] = { count: data[x].count_value, updatedAt: data[x].updatedAt }
//   }
//   console.log('countapi data', data);
//   alterLatestCounts(vd_id, count_data, function( err ){
//     if ( err ) return res.status(400).send('Error udpating');
//   });
//
// });
//
// router.post('/count_events/', function(req, res, next) {
//   var data = req.body;
//   var vd_id = data.vd_id;
//   var event_type = data.event_type;
//   console.log('data sent:', data);
//   if (!vd_id) return res.status(400).send('missing parameter "vd_id"');
//   if (!event_type) return res.status(400).send('missing parameter "event_type"');
//   if (event_type === "turnoutCount") {
//     var countData = {};
//     for(var x in countTypes) {
//       var count = +data[countTypes[x]];
//       if (count >= 0) {
//         if (data.highCountRateReason) {
//           countData[countTypes[x]] = { newTotalCount: data[countTypes[x]], highCountRateReason: data.highCountRateReason }
//         } else {
//           countData[countTypes[x]] = { newTotalCount: data[countTypes[x]] }
//         }
//       }
//     }
//     console.log('data altered:', countData);
//   }
//
//   pg.connect(connectionString, function(err, client, done) {
//     if(err) return next(err);
//     var query = client.query('INSERT INTO count_events(vd_id, event_type, count_data) values($1, $2, $3)',[vd_id, event_type, countData]);
//     query.on('end', function() {
//         done();
//         if (event_type === "turnoutCount") {
//           updateLatestCounts(vd_id, countData, function(err) {
//             if(err) return next(err);
//           });
//         } else {
//           var finalCounts = data.finalCounts;
//           updateFinalCounts(vd_id, finalCounts, function(err) {
//             if(err) return next(err);
//           });
//         }
//         res.send("Updated");
//     });
//   });
// });
//
// router.get('/latest_counts/:vd_id', function(req, res, next) {
//   pg.connect(connectionString, function(err, client, done) {
//     if(err) return next(err);
//     var query = client.query("SELECT * FROM latest_counts WHERE vd_id = $1", [req.params.vd_id]);
//     var results = [];
//     query.on('row', function(row) {
//         results.push(row);
//     });
//     query.on('end', function() {
//       if(results.length === 0) {
//         res.send({});
//       } else {
//         console.log(results);
//         res.send(results[0]);
//       }
//       done();
//     });
//   });
// });
//
// router.get('/turnout-results', function(req, res, next) {
//   MongoClient.connect(mongoConnectionString, function(err, db) {
//     if (err) console.log(err);
//     var collection = db.collection('hourly_turnout_results');
//     var vd_code = req.query.vd_code;
//     var startDate = moment(req.query.date, 'YYYY-MM-DD').toDate();
//     var endDate = moment(req.query.date, 'YYYY-MM-DD').endOf('day').toDate();
//
//     collection.find({$and: [{vd_code: {$eq:vd_code}}, {date: {$gte: startDate, $lt: endDate} }]}).toArray(function(err, items) {
//       if (err) console.log(err);
//       console.log('found item', items);
//       res.send(items);
//       db.close();
//     });
//   });
// });
//
// router.get('/final-results/:vd_id', function(req, res, next) {
//   MongoClient.connect(mongoConnectionString, function(err, db) {
//     if (err) console.log(err);
//     var collection = db.collection('final_results');
//     collection.find({vd_code:{$eq:req.params.vd_id}}).toArray(function(err, items) {
//       if (err) console.log(err);
//       res.send(items);
//       db.close();
//     });
//   });
// });
//
// function updateFinalCounts(vd_id, data, cb) {
//   MongoClient.connect(mongoConnectionString, function(err, db) {
//     if (err) console.log(err);
//     var collection = db.collection('final_results');
//     var doc = {};
//     var date = moment().toDate();
//     for (var x = 0; x < data.length; x++) {
//       doc[data[x].party] = data[x].count;
//     }
//     var finalCounts = {finalCounts: doc, lastUpdate: date};
//     collection.update({vd_code: vd_id}, {$set: finalCounts}, {upsert: true});
//     db.close();
//   });
// }
//
//
//
// function updateLatestCounts(vd_id, data, cb) {
//   pg.connect(connectionString, function(err, client, done) {
//     if(err) return cb(err);
//     var query = client.query("SELECT * FROM latest_counts WHERE vd_id = $1", [vd_id]);
//     var results = [];
//     query.on('row', function(row) {
//         results.push(row);
//     });
//     query.on('end', function() {
//       if(results.length === 0) {
//         //insert data
//         var prevCount = {};
//         concat(prevCount, data, new Date());
//         insertLatestCounts(vd_id, prevCount, cb);
//       } else {
//         //update latest-count
//         var prevCount = results[0].count_data;
//         concat(prevCount, data, new Date());
//         alterLatestCounts(vd_id, prevCount, cb);
//       }
//       done();
//     });
//   });
// }
//
// function concat(previous, fresh, timestamp) {
//   countTypes.forEach(function(type) {
//     if (fresh[type]) {
//       previous[type] = {
//         count: fresh[type].newTotalCount,
//         updatedAt: timestamp.toISOString()
//       }
//     }
//   });
// }
//
// function insertLatestCounts(vd_id, newCountData, cb) {
//   pg.connect(connectionString, function(err, client, done) {
//     if(err) return cb(err);
//     var query = client.query("INSERT INTO latest_counts(vd_id, count_data) values($1, $2)", [vd_id, newCountData]);
//     query.on('end', function() {
//       done();
//       cb();
//     });
//   });
// }
//
// function alterLatestCounts(vd_id, newCountData, cb) {
//   pg.connect(connectionString, function(err, client, done) {
//     if(err) return cb(err);
//     var query = client.query("UPDATE latest_counts SET count_data = $1 WHERE vd_id = $2", [newCountData, vd_id]);
//     query.on('end', function() {
//       done();
//       cb(null);
//     });
//   });
// }
//
// function checkForAdminGroup(req, res, next) {
//   console.log('checkForAdminGroup', req.user);
//   groupsAPI.isInGroup(req.user.sub, 'CountAdmin', function(err, result) {
//     if (err) {
//       return res.status(500).send("Unable to communicate with groups api");
//     }
//     if (result) {
//       return next();
//     } else {
//       return res.status(401).send("User not in required group");
//     }
//   });
// }
