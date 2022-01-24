import { Price } from "./price.model";
import { Schedule } from "./schedule.model";

export class Station {
    public id: number;
    public name: string;
    public latitude: number;
    public longitude: number;
    public address: string;
    public schedules: Schedule[];
    public prices: Price[];

    constructor(id:number, name: string, latitude: number, longitude: number, address: string, schedules: Schedule[], prices: Price[]){
        this.id= id;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.schedules = schedules;
        this.prices = prices;
    }
}
