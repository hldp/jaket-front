import axios from "axios";
import {from, Observable} from "rxjs";
import {GasType} from "../../models/gasType.enum";
import {PeriodEnum} from "../../models/period.enum";
import {GasRefuelStatsModel} from "../../models/gasRefuelStats.model";
import {authAPI} from "./authAPI.service";

export class refuelAPI {

    private DEV_URL : string = "http://localhost:3001/";
    private CLOUD_URL: string = "https://api-jaket.cleverapps.io/"

    /**
     * Post an user refuel to the API
     * @param gas 
     * @param quantity 
     * @param date 
     * @param totalPrice 
     * @param stationID 
     * @returns 
     */
    public postRefuel(gas: GasType, quantity: number, date: Date, totalPrice: number, stationID?: number): Observable<any>{

        let data:any;
        if(stationID){
            data = {gas_name: gas, quantity: quantity, date: date, total_price: totalPrice, station_id: stationID};
        }else{
            data = {gas_name: gas, quantity: quantity, date: date, total_price: totalPrice};
        }

        const promise: Promise<any> = new Promise<any>((resolve, reject)=>{
            const token = authAPI.getToken();
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/fillGas`, data, {
                headers: { 'Authorization': 'Bearer ' + token}}).then((res)=>{
                if(res){
                    resolve(res);
                } else{
                    reject();
                }
                
            })

        })

        return from(promise);


    }

    /**
     * Get the refuels stats for the current user and for a period
     * @param period 
     * @returns 
     */
    public getRefuelStats(period: PeriodEnum = PeriodEnum.ALL): Observable<GasRefuelStatsModel[]>{
        let url = `${process.env.REACT_APP_BACKEND_URL}/user/stats/fillGas`;
        url +=`?period=${period.toString()}`;

        const promise: Promise<GasRefuelStatsModel[]> = new Promise<GasRefuelStatsModel[]>((resolve, reject)=>{
            const token = authAPI.getToken();
            axios.get(url, {
                headers: { 'Authorization': 'Bearer ' + token}}).then((res)=>{
                if(res){
                    resolve(res.data);
                } else{
                    reject();
                }
            })

        })

        return from(promise);
    }
}