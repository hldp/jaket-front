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
},
{    
    id: 2,
    name: 'name_2',
    latitude: 43.549504,
    longitude: 7.026163,
    address: "Bd de la Croisette",
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
},
{    
    id: 3,
    name: 'name_3',
    latitude: 43.551254,
    longitude: 7.010539,
    address: "15-11 Rue Coste Corail",
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
},
{    
    id: 4,
    name: 'name_4',
    latitude: 43.554801,
    longitude: 7.017060,
    address: "6 Bd Carnot",
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
