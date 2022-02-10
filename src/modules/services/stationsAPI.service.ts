import axios from "axios";
import { Price } from "../../models/price.model";
import { Schedule } from "../../models/schedule.model";
import { Station } from "../../models/station.model";

 export class StationsApi {


    /**
     * Get adresses from a keyword
     * @param keyword 
     * @param limit 
     * @returns 
     */
    public getStations(): Promise<Station[]>{

        const promise : Promise<Station[]> = new Promise<Station[]>((resolve, reject)=>{

            axios.get('https://api-jaket.cleverapps.io/stations', {
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data: {
                    'limit': 5
                }
            }).then((response)=>{
                const result = response.data.data;
                let stations : Station[] = [];
                result.forEach((item:any) => {
                    let schedules: Schedule[] = [];
                    let prices: Price[] = [];

                    if (item.prices) {
                        item.prices.forEach((price_item: any) => {
                            prices.push(new Price(price_item.gaz_id, price_item.gaz_name, price_item.last_update, price_item.price));
                        });
                    }
                    if (item.schedules) {
                        item.schedules.forEach((schedule_item: any) => {
                            schedules.push(new Schedule(schedule_item.schedule_id, schedule_item.day, schedule_item.open, new Date(), new Date()));
                        });
                    }

                    const station = new Station(
                        item.id,
                        item.name,
                        item.position?.latitude,
                        item.position?.longitude,
                        item.address,
                        schedules,
                        prices
                    );
                    stations.push(station);
                });
                resolve(stations);
            }).catch((error)=>{
                reject(error);
            })

        })

        return promise;

    }

 }

 export default StationsApi;