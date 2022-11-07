const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://Bafana:PRO123@currency.0huohhr.mongodb.net/currencyratehub' , {useNewUrlParser : true , useUnifiedTopology : true})

const connection = mongoose.connection

connection.on('error', err => console.log(err))

connection.on('connected' , () => console.log('Connection made successfully'))