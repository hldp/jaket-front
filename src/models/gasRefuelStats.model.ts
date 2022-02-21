import {UserRefuelGas} from "./userRefuelGas.model";

export class GasRefuelStatsModel {
    gas_name: string;
    nbFill: number;
    averageLiterPrice: number;
    list: UserRefuelGas[];


    constructor(gas_name: string, nbFill: number, averageLiterPrice: number, list: UserRefuelGas[]) {
        this.gas_name = gas_name;
        this.nbFill = nbFill;
        this.averageLiterPrice = averageLiterPrice;
        this.list = list;
    }
}