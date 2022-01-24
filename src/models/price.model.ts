export class Price {
    public gas_id: number;
    public gas_name: string;
    public last_update: Date;
    public price: number;

    constructor(gas_id: number, gas_name: string, last_update: Date, price:number){
        this.gas_id = gas_id;
        this.gas_name = gas_name;
        this.last_update = last_update;
        this.price = price;
    }

}