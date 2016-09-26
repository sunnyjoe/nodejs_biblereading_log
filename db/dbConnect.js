var mysql=require('mysql');

function connectServer(){

    var client=mysql.createConnection({
        host:'localhost',
        port:3306,
        user:'root',
        password:'',
        database:'BibleReading'
    })

    return client;
}


function  selectFun(client,username,callback){
    //client为一个mysql连接对象
    client.query('select password from UserInfo where name="'+username+'"',function(err,results,fields){
        if(err) throw err;

        callback(results);
    });
}

function insertFun(client , username, password,callback){
    client.query('insert into UserInfo values(?,?)', [password, username], function(err,result){
        if( err ){
            console.log( "error:" + err.message);
            return err;
        }
          callback(err);
    });
}


function insertBibleLogFun(client, username, biblelog, callback){
    var current = Date.now() / 1000;
    current = Math.floor(current);
    console.log(username + biblelog + current);
    client.query('insert into Readinglog values(?,?,?)', [username, biblelog, current], function(err,result){
        if( err ){
            console.log( "error:" + err.message);
            return err;
        }
          callback(err);
        });
}

exports.connect = connectServer;
exports.selectFun  = selectFun;
exports.insertFun = insertFun;
exports.insertBibleLogFun = insertBibleLogFun;
