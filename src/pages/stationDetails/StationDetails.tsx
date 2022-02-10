import { Directions } from "@mui/icons-material";
import { CardContent, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Card } from "@mui/material";
import React from "react";
import { Adress } from "../../models/adress.model";
import { Station } from "../../models/station.model";
import AppBarCustom from "../../modules/appBar/AppBar";
import Map from "../../modules/map/Map";
import './StationDetails.css'
import { GasType } from "../../models/gasType.enum";
import { GasDataPrice } from "../../models/gasDataPrice.model";
import LineGraph from "../../modules/lineGraph/LineGraph"

class StationDetails extends React.Component<{station: Station},{station: Station}> {


      private dataTemp: GasDataPrice[] = [
        { gas: GasType.DIESEL, data: [
            {date: "Lundi", price: 1.56},
            {date: "Mardi", price: 1.56},
            {date: "Mecredi", price: 1.58},
            {date: "Jeudi", price: 1.59},
            {date: "Vendredi", price: 1.60},
            {date: "Samedi", price: 1.60},
            {date: "Dimanche", price: 1.60},
            
        ]},
        { gas: GasType.SP98, data: [
            {date: "Lundi", price: 1.87},
            {date: "Mardi", price: 1.89},
            {date: "Mecredi", price: 1.90},
            {date: "Jeudi", price: 1.91},
            {date: "Vendredi", price: 1.89},
            {date: "Samedi", price: 1.92},
            {date: "Dimanche", price: 1.93},
            
        ]},
    ]

    constructor(props:any){
        super(props);
        this.state = {
            station: props.station,
        }
        this.navigate = this.navigate.bind(this);
        this.getStationData("month");
    }

    /**
     * Format the date to be displayed
     * @param date 
     * @returns the date formated
     */
    private dateToString(date:Date): string{
        let dateToReturn: string = "";
        let tempDate: string[] = date.toLocaleDateString().split("/").slice(0,2);
        dateToReturn = tempDate[0]+ "/" + tempDate[1];

        let tempTime: string[] = date.toLocaleTimeString().split(":").slice(0,2);
        dateToReturn += " - " + tempTime[0]+":"+tempTime[1];

        return dateToReturn;
    }

    private getStationAdress(): Adress{
        console.log(this.state.station.latitude, this.state.station.longitude, this.state.station.address)
        return new Adress(this.state.station.latitude, this.state.station.longitude, this.state.station.address);
    }

    public navigate(): void{
        const url = "https://www.google.com/maps/dir/?api=1&destination="+this.state.station.latitude+" "+this.state.station.longitude
        window.open(url);
    }

    private getStationData(period: string):void{
    }



    render()  {
        return (

            <div>
                <AppBarCustom></AppBarCustom>
                <h1>{this.state.station.name}      
                <IconButton color="primary" size="large" onClick={this.navigate}>
                  <Directions/>
                </IconButton></h1>
                <Card className="infoCard">
                    <CardContent>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Carburant</TableCell>
                                <TableCell>Prix / L</TableCell>
                                <TableCell>Mise à jour</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.station.prices.map((row)=>{
                                return(
                                <TableRow key={row.gas_id}>
                                    <TableCell>{row.gas_name}</TableCell>
                                    <TableCell>{row.price}</TableCell>
                                    <TableCell>{this.dateToString(row.last_update)}</TableCell>
                                </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>
                <Map stations={[this.state.station]} height={"300px"} centerOn={this.getStationAdress()} enableStationPopup={false}></Map>
                <Card className="infoCard">
                    <LineGraph gasData={this.dataTemp}></LineGraph>
                </Card>
            </div>
        );
    }

}

export default StationDetails;