import { Card, CardContent, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import React from "react";
import { Adress } from "../../models/adress.model";
import { Station } from "../../models/station.model";
import AppBarCustom from "../../modules/appBar/AppBar";
import Map from "../../modules/map/Map";
import './StationDetails.css'

class StationDetails extends React.Component<{station: Station},{station: Station}> {


    constructor(props:any){
        super(props);
        this.state = {
            station: props.station,
        }
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


    render()  {
        return (

            <div>
                <AppBarCustom></AppBarCustom>
                <h1>{this.state.station.name}</h1>
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
                <Map stations={[this.state.station]} height={"300px"} centerOn={this.getStationAdress()}></Map>
            </div>
        );
    }

}

export default StationDetails;