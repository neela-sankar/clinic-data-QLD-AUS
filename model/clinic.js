const mongoose = require('mongoose')

const clinicSchema = new mongoose.Schema({
    name: String,
    address: String,
    phone: String,
    website: String,
})

const Clinic = mongoose.model('Clinic', clinicSchema)

module.exports = Clinic