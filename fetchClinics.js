const axios = require('axios');
const mongoose = require('mongoose');
const Clinic = require('./model/clinic');
require('dotenv').config();

const apiKey = process.env.GOOGLE_PLACE_API
const dbUri = process.env.MongoDB_URI

//connect to MongoDb
mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Failed to connect to MongoDB', err))

//To fetch details of a place by its ID

async function getPlaceDetails(placeId) {
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website&key=${apiKey}`
    try{
        const response = await axios.get(detailsUrl)
        const data = response.data
        if(data.status === 'OK'){
            return {
                name: data.result.name,
                address: data.result.formatted_address || 'N/A',
                phone: data.result.formatted_phone_number || 'N/A',
                website: data.result.website || 'N/A'
            }
        } else {
            console.error(`Error fetching details for place_id ${placeId}: ${data.status}`)
            return null
        }
    } catch (error) {
        console.error(`Request failed for place_id ${placeId}:`, error)
        return null
    }
}

//function to fetch and store clinic data

async function fetchAndStoreClinics() {
    
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=general+practice+clinics+in+Queensland&key=${apiKey}`
    try {
        const response = await axios.get(searchUrl)
        const data = response.data

        if(data.status === 'OK'){
            const placeIds = data.results.map(result => result.place_id)

            for (const placeId of placeIds) {
                const details = await getPlaceDetails(placeId)
                if(details){
                    await Clinic.create(details)
                }
            }
            console.log('Clinic data saved to the database')
        } else {
            console.error('Error fetching clinics:', data.status)
        }
    } catch(error){
        console.error('Request failed:', error)
    }
}

fetchAndStoreClinics()