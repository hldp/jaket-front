import axios from "axios";
import { Adress } from "../../models/adress.model";

 export class AdressesApi {


    /**
     * Get adresses from a keyword
     * @param keyword 
     * @param limit 
     * @returns 
     */
    public getAdresses(keyword : String, limit: number = 10): Promise<Adress[]>{

        const promise : Promise<Adress[]> = new Promise<Adress[]>((resolve, reject)=>{

            axios.get('https://api-adresse.data.gouv.fr/search/?q='+keyword+'&limit='+limit).then((response)=>{
                const result = response.data.features;
                let adresses : Adress[] = [];
                result.forEach((adress:any) => {
                    const temp = new Adress(adress.geometry.coordinates[1], adress.geometry.coordinates[0], adress.properties.label);
                    adresses.push(temp);
                });
                resolve(adresses);
            }).catch((error)=>{
                reject(error);
            })

        })

        return promise;

    }

    public getAddressFromPosition(position: number[]): Promise<string>{

        const promise : Promise<string> = new Promise<string>((resolve, reject)=>{

            axios.get(`https://api-adresse.data.gouv.fr/reverse/?lat=${position[0]}&lon=${position[1]}`).then((response)=>{
                const adresses = response.data.features;
                if (adresses.length) resolve(adresses[0].properties.label);
                else resolve('');
            }).catch((error)=>{
                reject(error);
            })

        })

        return promise;

    }

 }

 export default AdressesApi;