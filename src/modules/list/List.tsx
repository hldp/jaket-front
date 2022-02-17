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
     */
    private updateDisplayedStations(page: number, rowsPerPage: number) {
        this.setState({ isLoading: true });
        let selectedGas = this.props.stationFilter.selectedGas;
        let area;
        if (this.props.stationFilter.selectedCity != null) {
            area = {
                radius: this.props.stationFilter.radius,
                coordinate: [this.props.stationFilter.selectedCity.latitude, this.props.stationFilter.selectedCity.longitude]
            }
        }

        let offset = page*rowsPerPage;
        this.stations_request = this.stationsApi.getStations(
            [],
            selectedGas,
            area,
            rowsPerPage,
            offset
        ).subscribe((stations: Station[]) => {
            let rows = this.state.rows;
            for(let i = 0; i < rowsPerPage; i++) {
                if (i < stations.length) rows[i+offset] = this.getStationsRows([stations[i]])[0]
            }
            this.setState({ rows: rows, isLoading: false });
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
            let gas: number[] = [];
            station.prices.forEach(price => gas[price.gas_id] = price.price);
            let is_open = this.mapService.isStationOpened(station);
            let data: Data = {
                id: station.id,
                address: station.address,
                gas_1: gas[1],
                gas_2: gas[2],
                gas_3: gas[3],
                gas_4: gas[4],
                gas_5: gas[5],
                gas_6: gas[6],
                open: is_open
            };
            rows.push(data);
        });

        return rows;
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
        const isAsc = this.state.orderBy === property && this.state.order === 'asc';
        this.setState({ order: isAsc ? 'desc' : 'asc' });
        this.setState({ orderBy: property });
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
                                <TableCell align="right">{row.gas_1}</TableCell>
                                <TableCell align="right">{row.gas_2}</TableCell>
                                <TableCell align="right">{row.gas_3}</TableCell>
                                <TableCell align="right">{row.gas_4}</TableCell>
                                <TableCell align="right">{row.gas_5}</TableCell>
                                <TableCell align="right">{row.gas_6}</TableCell>
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