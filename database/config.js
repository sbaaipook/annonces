const mongoose = require('mongoose');
const config =require('config');
const success =require('debug')('annoces-app:db');
const failed =require('debug')('annoces-app:dbErr');

connect()
    .then( _ => success('Connected to mongodb has successfuly !'))
    .catch( err => failed('Error occured. '+err.message));

async function connect(){
    await mongoose.connect(config.get('settings.mongodb_url',{
        useNewUrlParser: true,
    }));
}