export class UserRefuelGas {
    station_id: number;
    date: Date;
    quantity: number;
    total_price: number;


    constructor(station_id: number, date: Date, quantity: number, total_price: number) {
        this.station_id = station_id;
        this.date = date;
        this.quantity = quantity;
        this.total_price = total_price;
    }
}