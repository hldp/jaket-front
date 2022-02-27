import { Directions } from "@mui/icons-material";
import { CardContent, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Card, CircularProgress, Alert, Box, Container } from "@mui/material";
import React from "react";
import { Station } from "../../models/station.model";
import AppBarCustom from "../../modules/appBar/AppBar";
import Map from "../../modules/map/Map";
import './StationDetails.css'
import { GasDataPrice } from "../../models/gasDataPrice.model";
import LineGraph from "../../modules/lineGraph/LineGraph"
import { useParams } from "react-router-dom";
import { Subscription } from "rxjs";
import StationsApi from "../../modules/services/stationsAPI.service";

class StationDetails extends React.Component<{params: any},{station: Station | null, data: GasDataPrice[], loading: boolean, noData: boolean}> {

    private stations_request: Subscription | undefined;
    private stationsApi: StationsApi = new StationsApi();

    constructor(props:any){
        super(props);
        this.state = {
            station: null,
            data: [],
            loading: true,
            noData: false,
        }
        this.navigateToGoogleMap = this.navigateToGoogleMap.bind(this);
        this.getStationData("lastWeek", this.props.params.id);
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

    /**
     * Get history price data for the station
     * @param period
     * @param stationID
     */
    private getStationData(period: string, stationID: number):void{
        this.setState({loading: true});
        this.stationsApi.getGasHistoryByStation(stationID).subscribe((res)=>{
            this.setState({loading: false});
            if(res.length === 0){
                this.setState({noData: true});
            }
            this.setState({data: this.formatStationData(res)});
        })
    }

    /**
     * Format the station data to be displayed by the graph widget
     * @param res
     * @returns
     */
    private formatStationData(res: GasDataPrice[]): GasDataPrice[] {

        res.forEach(element => {
            for(let i = 0; i<element.data.length; i++){
                if(parseInt(element.data[i].date)!==i){
                    element.data.splice(i, 0, {date: i.toString(), price: null});
                }
            }
            element.data.push(element.data[0]);
            element.data.shift();
        });

        // eslint-disable-next-line array-callback-return
        res.map((priceHistory) => {
            priceHistory.data.forEach((element) => {
                switch (parseInt(element.date)) {
                    case 0:
                        element.date = 'Dimanche';
                        break;
                    case 1:
                        element.date = 'Lundi';
                        break;
                    case 2:
                        element.date = 'Mardi';
                        break;
                    case 3:
                        element.date = 'Mercredi';
                        break;
                    case 4:
                        element.date = 'Jeudi';
                        break;
                    case 5:
                        element.date = 'Vendredi';
                        break;
                    case 6:
                        element.date = 'Samedi';
                        break;
                    default:
                        element.date = 'Inconnu';
                }
            });
        });
        return res;
    }

    render()  {
        return (
            <Box sx={{
                bgcolor: 'background.default',
                color: 'text.primary',
                'min-height': '100%'
            }}>
                <AppBarCustom/>
                <Container sx={{pb: '3vh'}}>
                    {
                        (this.state?.station != null) ?
                            <h1>{this.state.station.address}
                                <IconButton color="primary" size="large" sx={{color: 'text.secondary'}} onClick={this.navigateToGoogleMap}>
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
                                                <TableCell>Fuel</TableCell>
                                                <TableCell>Price / L</TableCell>
                                                <TableCell>Updated at</TableCell>
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
                    <Map height={"30vh"} centerOn={this.state.station} enableStationPopup={false}/>
                    {(!this.state.noData && !this.state.loading) ?
                        <Card className="infoCard">
                            <LineGraph gasData={this.state.data}/>
                        </Card> : ""}
                    {(this.state.loading)?
                        <CircularProgress style={{ height: '70px', width: '70px' }}/>
                        : ""
                    }
                    {(this.state.noData) ?
                        <Alert severity="info"> There is no history for this station for the last week.</Alert> : ""
                    }
                </Container>
            </Box>
        );
    }

}

function WithParams(props: any) {
    let params = useParams();
    return <StationDetails {...props} params={params} />
}

export default WithParams;