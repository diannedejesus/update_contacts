const express = require('express')
const app = express()
const connectDB = require('./config/database')
const homeRoutes = require('./routes/home')
const dashboardRoutes = require('./routes/main')
const updateInfoRoutes = require('./routes/updateInformation')
//routes path
const loginRoutes = require('./routes/login') //import auth routes from local modules
const signupRoutes = require('./routes/signup')
const mongoose = require('mongoose')
const passport = require('passport') // auth middleware
const session = require('express-session') // Keeps users session logged in and creates the cookie
const MongoStore = require('connect-mongo') //saving session data in the db

require('dotenv').config({path: './config/.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
    session({
      secret: process.env.YourSECRECT, //this can be anything you want
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.DB_STRING})
    })
  )

// Passport middleware
app.use(passport.initialize()) //setting up passport
app.use(passport.session())

app.use('/', homeRoutes)
app.use('/dashboard', dashboardRoutes)
app.use('/updateInfo', updateInfoRoutes)
app.use('/login', loginRoutes)
app.use('/signup', signupRoutes)

app.listen(process.env.PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    