var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
var RentModel = require("../models/RentModel");

router.use(express.static("public"));


// GET Gas Cars
router.get('/', async function (req, res) {

    let rent_models = await RentModel.find();
    res.render("rent_index.hbs", { models: rent_models });

});



// GET Filtering Electric Cars
router.get('/filter', async function (req, res) {


    // Sorting
    let filtered_models;

    const sortBy = req.query.sortBy;
    console.log(sortBy);

    if (sortBy == 'latest') {
        filtered_models = await RentModel.find().sort({ year: -1 });
    }
    else if (sortBy == 'highprice') {
        filtered_models = await RentModel.find().sort({ price: -1 });
    }
    else if (sortBy == 'lowprice') {
        filtered_models = await RentModel.find().sort({ price: 1 });
    }
    else if (sortBy == 'highrange') {
        filtered_models = await RentModel.find().sort({ mileage: -1 });
    }
    else if (sortBy == 'lowrange') {
        filtered_models = await RentModel.find().sort({ mileage: 1 });
    }
    else if (sortBy == 'highperf') {
        filtered_models = await RentModel.find().sort({ time60: 1 });
    }
    else if (sortBy == 'lowperf') {
        filtered_models = await RentModel.find().sort({ time60: -1 });
    }


    // Price Filtering
    const priceBy = req.query.priceBy;
    console.log(priceBy);
    if (priceBy != undefined) {
        const priceLt = priceBy.slice(5) + '000';
        console.log(priceLt);
        filtered_models = await RentModel.find({ price: { $lte: priceLt } }).sort({ price: -1 });
    }


    // Year Filtering
    var year = req.query.year;
    if (year != undefined) {
        year = year.slice(4);
        console.log(year);
        filtered_models = await RentModel.find({ year: year });
    }

    var yearLt = req.query.yearLt;
    if (yearLt != undefined) {
        yearLt = yearLt.slice(4);
        console.log(yearLt);
        filtered_models = await RentModel.find({ year: { $lte: yearLt } }).sort({ year: -1 });
    }

    // Mileage Filtering
    var mileageLt = req.query.mileageLt;
    if (mileageLt != undefined) {
        console.log(mileageLt);
        filtered_models = await RentModel.find({ mileage: { $lte: mileageLt } }).sort({ mileage: -1 });
    }


    // More Filtering
    var trans = req.query.trans;
    if (trans != undefined) {
        console.log(trans);
        filtered_models = await RentModel.find({ transmission: trans });
    }

    var drive = req.query.drive;
    if (drive != undefined) {
        console.log(drive);
        filtered_models = await RentModel.find({ drivetrain: drive });
    }

    var cyl = req.query.cyl;
    if (cyl != undefined) {
        console.log(cyl);
        filtered_models = await RentModel.find({ cyl: cyl });
    }


    //console.log(filtered_models);
    res.render("gas_index.hbs", { models: filtered_models });

});





// GET Booked Model
router.get('/booknow/:id', async function (req, res) {

    let modelid = req.params.id;
    console.log(modelid);

    let booked_model = await RentModel.findById(modelid);
    //console.log(booked_model);
    res.render("rentbooking.hbs", { model: booked_model });

});

router.get('/filter/booknow/:id', async (req, res) => {
    let modelid = req.params.id;
    res.redirect('/rent/booknow/' + modelid);
});


module.exports = router;