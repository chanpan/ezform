const sqlite = require('sqlite-cipher');
const path = require('path');
const fs = require('fs');
 
var sq = module.exports = {

    connected:()=>{
        return sqlite.connect("./assets/db/ezform.enc", 'Q2hhbnBhbjA3', 'aes-256-ctr');    
    },
    careateTable:(sql)=>{
        //sql = `CREATE TABLE tbdata_1500628215069381400 (id TEXT PRIMARY KEY ,varfirstname TEST, varlastname TEXT , varaddress TEXT)`;
        //let sqli="create TABLE IF NOT EXISTS nut (id Text Primary key, fname Test)";
        return sq.connected().run(sql,function(data){
            console.log(data);
        });
    },
    create:(table, values)=>{

        return sq.connected().insert(table,values, function(inserid){
            console.log(inserid);
        });
    },
    test:(table)=>{
        console.log(sq.connected().run(`SELECT * FROM ${table}`));
    },
    reader:(table)=>{
         return sq.connected().run(`SELECT * FROM ${table}`);
    }
}