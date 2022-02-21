import axios from "axios";
import {from, Observable} from "rxjs";
import {GasType} from "../../models/gasType.enum";
import {PeriodEnum} from "../../models/period.enum";
import {GasRefuelStatsModel} from "../../models/gasRefuelStats.model";

export class refuelAPI{

    private DEV_URL : string = "http://localhost:3001/";
    private CLOUD_URL: string = "https://api-jaket.cleverapps.io/"


    public postRefuel(gas: GasType, quantity: number, date: Date, totalPrice: number, stationID?: number): Observable<any>{

        let data:any;
        if(stationID){
            data = {gas_name: gas, quantity: quantity, date: date, total_price: totalPrice, station_id: stationID};
        }else{
            data = {gas_name: gas, quantity: quantity, date: date, total_price: totalPrice};
        }

        const promise: Promise<any> = new Promise<any>((resolve, reject)=>{
            
            axios.post(this.DEV_URL+"user/fillGas", data, {
                headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imxpc2EiLCJzdWIiOjIsImlhdCI6MTY0NTQ1MDAxNiwiZXhwIjoxNjQ1NTM2NDE2fQ.8na8duIwxw8yn-ht6H3LxtTlX-v1vsxUo9Bfy9GWtSA'}}).then((res)=>{
                if(res){
                    resolve(res);
                } else{
                    reject();
                }
                
            })

        })

        return from(promise);


    }

    public getRefuelStats(period: PeriodEnum = PeriodEnum.ALL): Observable<GasRefuelStatsModel[]>{
        let url = this.DEV_URL+"user/stats/fillGas";
        url += '?period='+period.toString();

        const promise: Promise<GasRefuelStatsModel[]> = new Promise<GasRefuelStatsModel[]>((resolve, reject)=>{

            axios.get(url, {
                headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imxpc2EiLCJzdWIiOjIsImlhdCI6MTY0NTQ1MDAxNiwiZXhwIjoxNjQ1NTM2NDE2fQ.8na8duIwxw8yn-ht6H3LxtTlX-v1vsxUo9Bfy9GWtSA'}}).then((res)=>{
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