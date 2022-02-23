import React from "react";
import './List.css';
import { Station } from "../../models/station.model";
import { TableContainer, Paper, Table, TableRow, TableCell, TableBody, TablePagination, CircularProgress } from "@mui/material";
import EnhancedTableHead, { Data, Order } from "./EnhancedTableHead";
import MapService from "../map/Map.service";
import { ListService } from "./List.service";
import { connect } from "react-redux";
import StationsApi from "../services/stationsAPI.service";
import { Subscription } from "rxjs";
import { useNavigate } from "react-router-dom";
import { LatLng } from "leaflet";

// Props, state
class List extends React.Component<{
    stationFilter: any,
    dispatch: any,
    navigate: any
}, { rows: any,
     order: Order,
     orderBy: keyof Data,
     page: number,
     rowsPerPage: number,
     isLoading: boolean }> {

    private mapService: MapService;
    private listService: ListService;
    private stationsApi: StationsApi = new StationsApi();
    private stations_request: Subscription | undefined;

    constructor(props: any) {
        super(props);

        // Init attributes
        this.mapService = new MapService();
        this.listService = new ListService();

        // Bind functions
        this.handleRequestSort = this.handleRequestSort.bind(this);
        this.onStationClick = this.onStationClick.bind(this);
        
        // Init state
        this.state = { 
            rows: [],
            order: 'asc',
            orderBy: 'address',
            page: 0,
            rowsPerPage: 5,
            isLoading: false
        };
    }

    componentDidMount() {
        this.loadStations();
    }

    componentWillUnmount() {
        if (this.stations_request) this.stations_request.unsubscribe();
    }

    componentDidUpdate(previousProps: any, previousState: any){
        if (previousProps.stationFilter !== this.props.stationFilter) {
            this.loadStations();
        }
    }

    /**
     * Get the stations from the API
     */
    private loadStations() {
        this.setState({ rows: [], isLoading: true });
        let selectedGas = this.props.stationFilter.selectedGas;
        let area;
        if (this.props.stationFilter.selectedCity != null) {
            area = {
                radius: this.props.stationFilter.radius,
                coordinate: [this.props.stationFilter.selectedCity.latitude, this.props.stationFilter.selectedCity.longitude]
            }
        }
        this.stations_request = this.stationsApi.getStations(
            ["position"],
            selectedGas,
            area
        ).subscribe((stations: Station[]) => {
            this.setState({ rows: this.getStationsRows(stations) });
            this.updateDisplayedStations(this.state.page, this.state.rowsPerPage);
        });
    }

    /**
     * Get the stations details for current displayed stations on the list
     * @param page
     * @param rowsPerPage
     * @param orderBy
     * @param order
     */
    private updateDisplayedStations(page: number, rowsPerPage: number, orderBy?: keyof Data, order?: Order) {
        this.setState({ isLoading: true });
        let selectedGas = this.props.stationFilter.selectedGas;
        let area;
        if (this.props.stationFilter.selectedCity != null) {
            area = {
                radius: this.props.stationFilter.radius,
                coordinate: [this.props.stationFilter.selectedCity.latitude, this.props.stationFilter.selectedCity.longitude]
            }
        }
        let orders: any = {};
        if (!orderBy && !order) {
            orderBy = this.state.orderBy;
            order = this.state.order;
        }
        if (orderBy && order) {
            if (orderBy === 'distance') {
                orders[orderBy] = [{
                    type: 'latitude',
                    value: this.props.stationFilter.selectedCity.latitude,
                },{
                    type: 'longitude',
                    value: this.props.stationFilter.selectedCity.longitude,
                }];
            }
            else if (orderBy === 'address') {
                orders[orderBy] = [order];
            }
            else {
                orders['gas'] = [{
                    type: orderBy,
                    value: order
                }];
            }
        }

        let offset = page*rowsPerPage;
        this.stations_request = this.stationsApi.getStations(
            [],
            selectedGas,
            area,
            rowsPerPage,
            offset,
            orders
        ).subscribe((stations: Station[]) => {
            let rows = this.state.rows;
            for(let i = 0; i < rowsPerPage; i++) {
                if (i < stations.length) rows[i+offset] = this.getStationsRows([stations[i]])[0]
            }
            this.setState({ rows: rows, isLoading: false });
            if (orderBy && order) this.setState({  order: order, orderBy: orderBy });
        });
    }

    /**
     * Get all list rows for each stations in props
     * @param stations 
     * @returns 
     */
    private getStationsRows(stations: Station[]): Data[] {
        let rows: Data[] = [];

        stations.forEach((station) => {
            let gas: any = {};
            station.prices.forEach(price => gas[price.gas_name] = price.price);
            let is_open = this.mapService.isStationOpened(station);
            let data: Data = {
                id: station.id,
                address: station.address,
                Gazole: gas['Gazole'],
                SP95: gas['SP95'],
                E85: gas['E85'],
                GPLc: gas['GPLc'],
                SP95_e10: gas['SP95_e10'],
                SP98: gas['SP98'],
                distance: this.getDistance(station),
                open: is_open
            };
            rows.push(data);
        });

        return rows;
    }

    /**
     * Get the distance between the station and the user position
     * @param station 
     */
    private getDistance(station: Station): number {
        let stationPosition = new LatLng(station.latitude, station.longitude);
        let currentPosition = new LatLng(this.props.stationFilter.selectedCity.latitude, this.props.stationFilter.selectedCity.longitude);
        return currentPosition.distanceTo(stationPosition);
    }

    /** 
     * Avoid a layout jump when reaching the last page with empty rows.
    */
    private isEmptyRows() {
        return this.state.page > 0 ? Math.max(0, (1 + this.state.page) * this.state.rowsPerPage - this.state.rows.length) : 0
    }

    /**
     * Get the correct comparator to order the list
     * @param order 
     * @param orderBy 
     * @returns 
     */
    public getComparator<Key extends keyof any>(order: Order, orderBy: Key,): (
        a: { [key in Key]: number | string },
        b: { [key in Key]: number | string },
        ) => number {
        return order === 'desc'
            ? (a, b) => this.listService.descendingComparator(a, b, orderBy)
            : (a, b) => this.listService.ascendingComparator(a, b, orderBy);
    }
    
    /**
     * Called when the list order is updated
     * @param property the property to order
     */
    private handleRequestSort(property: keyof Data) {
        let isAsc = this.state.orderBy === property && this.state.order === 'asc';
        if (property === 'distance') {
            isAsc = false;
        }
        this.updateDisplayedStations(this.state.page, this.state.rowsPerPage, property, isAsc ? 'desc' : 'asc');
    }
    
    /**
     * Called when the user wants to change the list page
     * @param event 
     * @param newPage 
     */
    private handleChangePage = (event: unknown, newPage: number) => {
        this.setState({ page: newPage });
        this.updateDisplayedStations(newPage, this.state.rowsPerPage);
    };
    
    /**
     * Called when the user wants to change the number of row displayed on the list
     * @param event 
     */
    private handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
        this.setState({ page: 0 });
        this.updateDisplayedStations(this.state.page, parseInt(event.target.value, 10));
    };

    /**
     * Called when a station is clicked on the list
     * @param id
     */
    public onStationClick(id: number) {
        this.props.navigate(`/stationDetails/${id}`);
    }
      
    /**
     * Render the component
     * @returns 
     */
    render() {
        return (
            <div className='list-container' data-testid="list-container">
                <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
                    <EnhancedTableHead
                        order={this.state.order}
                        orderBy={this.state.orderBy}
                        onRequestSort={this.handleRequestSort}
                        rowCount={this.state.rows.length}
                    />
                    <TableBody>
                        {this.state.rows.slice().sort(this.getComparator(this.state.order, this.state.orderBy))
                        .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                        .map((row: any, index: number) => {
                            const labelId = `enhanced-table-checkbox-${index}`;
        
                            return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={index} onClick={() => this.onStationClick(row.id)} style={{ cursor: 'pointer' }}>
                                <TableCell component="th" id={labelId} scope="row" padding="none">
                                    {row.address}
                                </TableCell>
                                <TableCell align="right">{row.Gazole}</TableCell>
                                <TableCell align="right">{row.SP95}</TableCell>
                                <TableCell align="right">{row.E85}</TableCell>
                                <TableCell align="right">{row.GPLc}</TableCell>
                                <TableCell align="right">{row.SP95_e10}</TableCell>
                                <TableCell align="right">{row.SP98}</TableCell>
                                <TableCell align="right">{(Math.floor(row.distance/1000) !== 0)?((row.distance/1000).toFixed(2)+' km'):(Math.floor(row.distance)+' m')}</TableCell>
                                <TableCell align="right">{row.open?'Yes':'No'}</TableCell>
                            </TableRow>
                            );
                        })}
                        {this.isEmptyRows() > 0 && (
                        <TableRow style={{ height: (53) * this.isEmptyRows() }}>
                            <TableCell colSpan={6} />
                        </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={this.state.rows.length}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.page}
                    onPageChange={this.handleChangePage}
                    onRowsPerPageChange={this.handleChangeRowsPerPage}
                />
                </Paper>

                {(this.state.isLoading) ?
                    <div className="loading-container"><CircularProgress style={{ height: '70px', width: '70px' }}/></div>
                : ''}
            </div>
            );
    }


}

function WithNavigate(props: any) {
    let navigate = useNavigate();
    return <List {...props} navigate={navigate} />
}

const mapStateToProps = (state: any) => {
    return {
      stationFilter: state.stationFilter
    }
}
export default connect(mapStateToProps)(WithNavigate);