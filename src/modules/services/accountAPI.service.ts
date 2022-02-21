import axios from "axios";
import { from, Observable } from "rxjs";

 export class AccountApi {

    private DEV_URL : string = "http://localhost:3001/";
    private CLOUD_URL: string = "https://api-jaket.cleverapps.io/"

    /**
     * Register an user
     * 
     * @param username
     * @param password
     */
    public register(username: string, password: string): Observable<void>{

        const promise : Promise<void> = new Promise<void>((resolve, reject)=>{

            let url = this.DEV_URL+'account/';

            axios.post(url, {
                headers: { 'content-type': 'application/json' },
                data: {
                    username: username,
                    password: password
                }
            }).then(()=>{
                resolve();
            }).catch((error)=>{
                reject(error);
            })

        })

        return from(promise);
    }

 }

 export default AccountApi;