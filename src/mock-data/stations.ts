import { Station } from "../models/station.model"

let stations: Array<Station> = [{    
    id: 1,
    name: 'name_1',
    latitude: 43.552550,
    longitude: 7.022886,
    address: "75 rue d'antibes",
    schedules: [{
        id: 1,
        day: 'monday',
        open: true,
        opening: new Date(),
        closing: new Date()
    }],
    prices: [{
        gas_id: 1,
        gas_name: 'SP98',
        last_update: new Date(),
        price: 1.999
    }]
}]

export default stations
