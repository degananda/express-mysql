var express = require('express');
var mysql = require('mysql');
var routerList = function(connection){
    var router = express.Router();
    // get note
    router.get('/list', function(req, res){
        var query = "SELECT id_note, isi_note, tanggal_note FROM note ORDER BY tanggal_note DESC";
        connection.query(query, function(err, result, fields){
            if(err){
                throw err;
            } else {
                if(result.length > 0){
                    res.status(200).json(result);
                } else {
                    var output = {
                        msg : "tidak ada data note pada database"
                    }
                    res.status(200).json(output);
                }
            }
        });
    });

    // get note details
    router.route('/:id').get(function(req, res){
        var query = "SELECT isi_note, tanggal_note FROM note WHERE id_note = '"+req.params.id+"'";
        connection.query(query, function(err, result, fields){
            if(err){
                throw err;
            } else {
                if(result.length > 0){
                    res.status(400).json(result);
                } else {
                    var output = {
                        msg : "tidak ada data dengan id tersebut"
                    }
                    res.status(200).json(output);
                }
            }
        });
    })
    .put(function(req, res){
        var query = "UPDATE note SET isi_note = '"+req.body.isi_note+"', tanggal_note=NOW() WHERE id_note = '"+req.params.id+"'";
        connection.query(query, function(err, result, fields){
            req.assert('isi_note', 'isi_note belum terdefinisi').notEmpty();
            var errors = req.validationErrors();
            if(!errors){
                if(err){
                    res.status(400).send(err);
                } else{
                    var output = {
                            msg : "berhasil mengubah note"
                    }
                    res.status(200).json(output);
                }
            } else {
                res.status(400).send(errors);
            }
        });
    });

    // post new note
    router.post('/', function(req, res){
        req.assert('isi_note', 'isi_note belum terdefinisi').notEmpty();
        var errors = req.validationErrors();
        if(errors){
            res.status(400).send(errors);
        } else {
            var query = "INSERT INTO NOTE(isi_note,tanggal_note) VALUES('"+req.body.isi_note+"', NOW())";
            connection.query(query, function(err, result, fields){
                if(err){
                    throw err;
                } else {
                    var output = {
                        msg : "berhasil menambahkan note baru"
                    }
                    res.status(200).json(output);
                }
            });
        }
    });

    // delete note
    router.delete('/:id', function(req, res){
        var query = "DELETE FROM note where id_note = '"+req.params.id+"'";
        connection.query(query, function(err, result, fields){
            if(err){
                throw err;
            } else {
                if(fields){
                    var output = {
                        msg : "berhasil menghapus note."
                    }
                    res.status(200).json(output);
                } else {
                    res.status(400).json({
                        msg : "tidak ada data note"
                    });
                }
            }
        });
    });

    return router;
}
module.exports = routerList;