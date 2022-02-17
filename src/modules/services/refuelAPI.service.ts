import axios from "axios";
import { resolve } from "path/posix";
import { from, Observable } from "rxjs";
import { GasType } from "../../models/gasType.enum";

export class refuelAPI{

    private DEV_URL : string = "http://localhost:3001/";
    private CLOUD_URL: string = "https://api-jaket.cleverapps.io/"


    public postRefuel(gas: GasType, quantity: number, date: Date, totalPrice: number, stationID?: number): Observable<any>{

        let data:any;
        if(stationID){
            data = {gas: gas, quantity: quantity, date: date, totalPrice: totalPrice, station_id: stationID};
        }else{
            data = {gas: gas, quantity: quantity, date: date, totalPrice: totalPrice};
        }

        const promise: Promise<any> = new Promise<any>((resolve, reject)=>{
            
            axios.post(this.DEV_URL+"user/fillGas", data, {
                headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pY29sYXMiLCJzdWIiOjEsImlhdCI6MTY0NTA5MDA1OSwiZXhwIjoxNjQ1MTc2NDU5fQ.E07VRlegyBmzwYDh1_0odPGwYx03ljLEqzB8H9ly6eA'}}).then((res)=>{
                if(res){
                    resolve(res);
                } else{
                    reject();
                }
                
            })

        })

        return from(promise);


    }
}