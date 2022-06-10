const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');

//DB connect
mongoose.connect('mongodb://localhost/NodePassword')
let db = mongoose.connection;
db.once('open', ()=>{
    console.log("Connected to MongoDB...");
})

//sdfjsdnvkjbkjsdvdvfdbvjdvb
// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BodyParser
app.use(express.urlencoded({extended: false}));

//Express session
app.use(session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  ); 
app.use(flash());

app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})


//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users')); 









app.listen(3000, ()=>{
    console.log("Server started on port 3000...");
})