import { Directions } from "@mui/icons-material";
import { CardContent, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Card, CircularProgress } from "@mui/material";
import React from "react";
import { Station } from "../../models/station.model";
import AppBarCustom from "../../modules/appBar/AppBar";
import Map from "../../modules/map/Map";
import './StationDetails.css'
import { GasType } from "../../models/gasType.enum";
import { GasDataPrice } from "../../models/gasDataPrice.model";
import LineGraph from "../../modules/lineGraph/LineGraph"
import { useParams } from "react-router-dom";
import { Subscription } from "rxjs";
import StationsApi from "../../modules/services/stationsAPI.service";

class StationDetails extends React.Component<{params: any},{station: Station | null, data: GasDataPrice[]}> {

    private stations_request: Subscription | undefined;
    private stationsApi: StationsApi = new StationsApi();

   /*  private dataTemp: GasDataPrice[] = [
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
    ] */

    constructor(props:any){
        super(props);
        this.state = {
            station: null,
            data: []
        }
        this.navigateToGoogleMap = this.navigateToGoogleMap.bind(this);
        this.getStationData("month", this.props.params.id);
    }

    componentDidMount() {
        this.loadStation();
    }

    componentWillUnmount() {
        if (this.stations_request) this.stations_request.unsubscribe();
    }

    /**
     * Get the station from the API
     */
    private loadStation() {
        this.setState({ station: null });
        this.stations_request = this.stationsApi.getStation(this.props.params.id).subscribe((station: Station) => {
            this.setState({ station });
        });

    }

    /**
     * Format the date to be displayed
     * @param date 
     * @returns the date formated
     */
    private dateToString(date: Date): string{
        let real_date = new Date(date);
        let dateToReturn: string = "";

        let tempDate: string[] = real_date.toLocaleDateString().split("/").slice(0,2);
        dateToReturn = tempDate[0]+ "/" + tempDate[1];

        let tempTime: string[] = real_date.toLocaleTimeString().split(":").slice(0,2);
        dateToReturn += " - " + tempTime[0]+":"+tempTime[1];
        return dateToReturn;
    }

    /**
     * Open Google Map to navigate to the station
     */
    public navigateToGoogleMap(): void {
        if (this.state.station != null) {
            const url = "https://www.google.com/maps/dir/?api=1&destination="+this.state.station.latitude+" "+this.state.station.longitude
            window.open(url);
        }
    }

    private getStationData(period: string, stationID: number):void{
        this.stationsApi.getGasTrendsByStation(stationID).subscribe((res)=>{
            this.setState({data: res});
        })
    }



    render()  {
        return (

            <div>
                <AppBarCustom></AppBarCustom>
                {
                    (this.state?.station != null) ? 
                    <h1>{this.state.station.address}      
                    <IconButton color="primary" size="large" onClick={this.navigateToGoogleMap}>
                        <Directions/>
                    </IconButton></h1>
                    : <CircularProgress style={{ height: '70px', width: '70px' }}/>
                }
                {
                    (this.state.station != null) ? 
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
                    : <CircularProgress style={{ height: '70px', width: '70px' }}/>
                }
                <Map height={"300px"} centerOn={this.state.station} enableStationPopup={false}></Map>
                {(this.state.data.length>0) ? 
                <Card className="infoCard">
                    <LineGraph gasData={this.state.data}></LineGraph>
                </Card>
                : <CircularProgress style={{ height: '70px', width: '70px' }}/>}
            </div>
        );
    }

}

function WithParams(props: any) {
    let params = useParams();
    return <StationDetails {...props} params={params} />
}

export default WithParams;