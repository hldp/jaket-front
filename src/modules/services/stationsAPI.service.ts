import axios from "axios";
import { Area } from "../../models/area.model";
import { GasType } from "../../models/gasType.enum";
import { Price } from "../../models/price.model";
import { Schedule } from "../../models/schedule.model";
import { Station } from "../../models/station.model";

 export class StationsApi {

    private DEV_URL : string = "http://localhost:3001/";
    private CLOUD_URL: string = "https://api-jaket.cleverapps.io/"

/**
 * Get stations
 * 
 * @param columns Columns wanted in response
 * @param gasAvailables Filter stations by availbale gas
 * @param area Filter stations by an area
 * @param limit limit the number of returned stations
 * @param offset offset 
 * @returns a lists of stations
 */
    public getStations(columns?: string[], gasAvailables?: GasType[], area?: Area, limit?: number, offset:number = 0): Promise<Station[]>{

        let params = {
            offset : offset,
            limit: limit,
            columns: columns,
            filters: {
                gasAvailables: gasAvailables,
                area: area
            }
        };
        const promise : Promise<Station[]> = new Promise<Station[]>((resolve, reject)=>{

            axios.get(this.DEV_URL+'stations', {
                headers: { 'content-type': 'application/json' },
                params: params
            }).then((response)=>{
                const result = response.data.data;
                let stations : Station[] = [];
                result.forEach((item:any) => {
                    let schedules: Schedule[] = [];
                    let prices: Price[] = [];

                    if (item.prices) {
                        item.prices.forEach((price_item: any) => {
                            prices.push(new Price(price_item.gaz_id, price_item.gas_name, price_item.last_update, price_item.price));
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