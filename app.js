const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const compression = require('compression');
const bodyParser = require("body-parser")

const electricRouter = require('./routes/electric_index');
const gasRouter = require('./routes/gas_index');
const rentRouter = require('./routes/rent_index');
const adminRouter = require('./routes/admin');
var UserModel = require("./models/CustomerModel");
const app = express();

//mongoimport --db car_test --collection rentmodel --drop --file ~/Downloads/Autorizz-Car-Dealership-System-using-NodeJS-Express-MongoDB-master/db_data/gasmodel.json --jsonArray

//Connecting to Mongodb
const db = async () => {
    var url = 'mongodb+srv://gerind:cufotipi@cluster0.j0lux.mongodb.net/car_test?retryWrites=true&w=majority'
    try {
        const conn = await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        console.log("MongoDB connected");

    } catch (err) {
        console.log("MongoDB Error : Failed to connect");
        console.log(err);
        process.exit(1);
    }
}

db();



// view engine setup
app.engine('.hbs', exphbs({
    defaultLayout: 'layout', extname: '.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', '.hbs');


app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());

console.log("App running on Localhost:5000");


// Routing
app.get('/', (req, res) => {
    res.redirect('/home');
});


app.get('/home', function (req, res) {
    res.sendFile(__dirname + "/routes/home.html");
});

app.use('/admin', adminRouter);
app.use('/electric', electricRouter);
app.use('/gas', gasRouter);
app.use('/rent', rentRouter);


//Users
app.post('/customer', async (req, res) => {

    const user = new UserModel({
        name: req.body.username,
        email: req.body.useremail,
        phone: req.body.userphone,
        car: req.body.usercar
    })

    const user_res = await user.save();
    console.log(user_res);
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
