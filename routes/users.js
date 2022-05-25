const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


//Take user model
const User = require('../models/Users');

router.get('/login', (req, res)=>{
    res.render('login'); 
})

router.post('/login', (req, res)=>{
    const {email, password} = req.body;

    let errors = [];
    if(!email || !password){
        errors.push({msg: "Please fill all the required fields..."});
    }

    if(errors.length > 0){
        res.render('login', {
        errors,
        email,
        password
    })
    }else{
        User.findOne({email: email}).then(user =>{
        if(!user){
            errors.push({msg: "User doesn't exist!!"});
            res.render('login', {
                errors,
                email,
                password
            })  
        }else{
            User.findOne({email:email}).then(user =>{
                console.log(user);
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err){
                        errors.push({msg: "Password doesn't match!!"});
                        res.render('/users/login',{
                            errors,
                            email,
                            password
                        })
                    }else{
                        req.flash("success_msg", "Logged in Successfully!!!");
                        res.redirect('/dashboard/'+user.name);
                    }
                });
            });
        }
      });
    }
  });

router.get('/register', (req, res)=>{
    res.render('register'); 
})

router.post('/register', (req, res)=>{
    const {name, email, password, password2} = req.body;

    let errors = [];
    //Check errorss(required fields)
    if (!name || !email || !password || !password2){
        errors.push({msg: "Please fill all the required fields..."})
    }
    //check password match
    if(password!==password2){
        errors.push({msg: "Passwords doesn't match!!"})
    }
    //check password length
    if(password.length <6){
        errors.push({msg: "Password length should be minimum of 6 charaters.."})
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    }else{
        //Validation of New user email
        User.findOne({email: email}).then(user => {
        if(user){
            errors.push({msg: "Email alreadt exists!!"});
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            })   
        }else{
            const newUser = new User({
                name,
                email,
                password
            })
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser
                    .save()
                    .then(user => {
                      req.flash('success_msg', 'You are now registered and can log in');
                      res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                });
              });
            }
          });
        }
      });


// Logout
router.get('/logout', (req, res) => {
    // req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });

module.exports = router;