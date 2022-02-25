import axios from "axios";
import { Area } from "../../models/area.model";
import { GasType } from "../../models/gasType.enum";
import { Price } from "../../models/price.model";
import { Schedule } from "../../models/schedule.model";
import { Station } from "../../models/station.model";
import { from, Observable } from "rxjs";

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
    public getStations(columns?: string[], gasAvailables?: GasType[], area?: Area, limit?: number, offset:number = 0, orders: any = {}): Observable<Station[]>{

        const promise : Promise<Station[]> = new Promise<Station[]>((resolve, reject)=>{

            let url = this.DEV_URL+'stations';
            url += '?offset='+offset;
            if (limit) url += '&limit='+limit;
            columns?.forEach((column) => {
                url += '&columns[]='+column;
            })
            gasAvailables?.forEach((gas) => {
                url += '&filters[gasAvailables][]='+gas;
            })
            if (area) {
                url += '&filters[area][coordinate][latitude]='+area.coordinate[0];
                url += '&filters[area][coordinate][longitude]='+area.coordinate[1];
                url += '&filters[area][radius]='+area.radius*1000;
            }
            Object.keys(orders).forEach((key: any) => {
                for (const order of orders[key]) {
                    if (typeof order === 'string') url += `&order[${key}]=${order}`;
                    else  url += `&orders[${key}][${order['type']}]=${order['value']}`;
                }
            })

            axios.get(url, {
                headers: { 'content-type': 'application/json' }
            }).then((response)=>{
                const result = response.data.data;
                let stations : Station[] = [];
                result.forEach((item:any) => {
                    const station = this.adaptStation(item);
                    stations.push(station);
                });
                resolve(stations);
            }).catch((error)=>{
                reject(error);
            })

        })

        return from(promise);
    }

    /**
     * Get station
     * 
     * @param station_id Station ID to get
     * @returns a lists of stations
     */
    public getStation(station_id: number): Observable<Station>{

        const promise : Promise<Station> = new Promise<Station>((resolve, reject)=>{

            let url = this.DEV_URL+'stations/'+station_id;

            axios.get(url, {
                headers: { 'content-type': 'application/json' }
            }).then((response)=>{
                const result = response.data;
                const station = this.adaptStation(result);
                resolve(station);
            }).catch((error)=>{
                reject(error);
            })

        })

        return from(promise);
    }

    /**
     * Adapt an API station object to a local station object
     * @param station 
     */
    private adaptStation(api_station: any): Station {
        let schedules: Schedule[] = [];
        let prices: Price[] = [];

        if (api_station.prices) {
            api_station.prices.forEach((price_item: any) => {
                prices.push(new Price(price_item.gas_id, price_item.gas_name, price_item.last_update, price_item.price));
            });
        }
        if (api_station.schedules) {
            api_station.schedules.forEach((schedule_item: any) => {
                schedules.push(new Schedule(schedule_item.schedule_id, schedule_item.day, schedule_item.open, new Date(), new Date()));
            });
        }

        return new Station(
            api_station.id,
            api_station.name,
            api_station.position?.latitude,
            api_station.position?.longitude,
            api_station.address,
            schedules,
            prices
        );
    }    

    /**
     * Get the gas history for a period and a particular station
     * @param stationID 
     * @param period 
     * @returns 
     */
    public getGasHistoryByStation(stationID: number, period:string = "lastWeek"): Observable<any>{

        const promise : Promise<any> = new Promise<any>((resolve, reject)=>{


            let url = this.DEV_URL+'stations/'+stationID+'/price/history/'+period;

            axios.get(url).then((res:any)=>{
                //console.log(res);
                resolve(res.data)
            })


        });
        return from(promise);

    }

 }

 export default StationsApi;