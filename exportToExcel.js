const ExcelJS = require('exceljs')
const Clinic = require('./model/clinic')
const mongoose = require('mongoose')
require('dotenv').config();

const dbUri = process.env.MongoDB_URI

// Connect to MongoDB
mongoose.connect(dbUri)
        .then(() => console.log('Connected to MongoDB for exporting data'))
        .catch(err => console.error('Failed to connect to MongoDB', err));

async function exportToExcel(){
    try {
        const clinics = await Clinic.find()
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Clinics')

        //Add header row
        worksheet.columns = [
            {header: 'Name', key: 'name', width: 30},
            {header: 'Address', key: 'address', width: 30},
            {header: 'Phone', key: 'phone', width: 20},
            {header: 'Website', key: 'website', width: 30},
        ]

        // Add rows from the clinic data

        clinics.forEach(clinic => {
            worksheet.addRow({
                name: clinic.name,
                address: clinic.address,
                phone: clinic.phone,
                website: clinic.website
            })
        })

        //Write to file
        await workbook.xlsx.writeFile('clinic_data.xlsx')
        console.log('Data exported to clinic_data.xlsx')
    }
    catch(error){
        console.error('Failed to export data:', error);
    }
}

exportToExcel()