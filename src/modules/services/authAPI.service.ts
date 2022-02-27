import axios from "axios";
import {from, Observable} from "rxjs";

export class authAPI {

    /**
     * Sign In to the application
     * @param username
     * @param password
     */
    public signIn(username: string, password: string): Observable<any>{
        const promise: Promise<any> = new Promise<any>((resolve, reject)=>{
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, {username: username, password: password}).then((res)=>{
                if(res){
                    resolve(res);
                } else{
                    reject("Empty response");
                }
            }).catch(error => {
                reject(error.response);
            });
        })
        return from(promise);
    }

    /**
     * Sign Up to the application
     * @param username
     * @param password
     */
    public signUp(username: string, password: string): Observable<any>{
        const promise: Promise<any> = new Promise<any>((resolve, reject)=>{
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`, {username: username, password: password}).then((res)=>{
                if(res) {
                    resolve(res);
                } else{
                    reject(res);
                }
            }).catch(error => {
                reject(error.response);
            });
        })
        return from(promise);
    }

    public static getToken() {
        const state = localStorage.getItem("persistantState");
        if (state) {
            return JSON.parse(state).userLogged.token;
        }
    }
}