import { GasType } from "./gasType.enum";

export class GasPricePeriod {

    public date: string = "";
    public price: number = 0;

}

export class GasDataPrice {

    public gas: GasType;
    public data: GasPricePeriod[] = [];

    constructor(gas: GasType){
        this.gas = gas;
    }

}