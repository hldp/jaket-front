import React from "react";
import './List.css';
import { Station } from "../../models/station.model";
import { TableContainer, Paper, Table, TableRow, TableCell, TableBody, Box, TablePagination } from "@mui/material";
import EnhancedTableHead from "./EnhancedTableHead";
import MapService from "../map/Map.service";

interface Data {
    name: string;
    address: string;
    gas_1: number; //gazole
    gas_2: number; // sp95
    gas_3: number; // e85
    gas_4: number; // gpLc
    gas_5: number; // sp95_e10
    gas_6: number; // sp98
    open: boolean;
}

type Order = 'asc' | 'desc';

// Props, state
class List extends React.Component<{ stations: Array<Station> }, { rows: any, order: Order, orderBy: keyof Data, page: number, rowsPerPage: number }> {

    private mapService: MapService;

    constructor(props: any) {
        super(props);

        this.mapService = new MapService();
        this.handleRequestSort = this.handleRequestSort.bind(this);

        let rows: Data[] = [];
        this.props.stations.forEach((station) => {
            let gas: number[] = [];
            station.prices.forEach(price => gas[price.gas_id] = price.price);
            let is_open = this.mapService.isStationOpened(station);
            let data: Data = {
                name: station.name,
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
        this.state = { rows: rows,
            order: 'asc',
            orderBy: 'name',
            page: 0,
            rowsPerPage: 5
        };
    }

    componentDidMount() {

    }

    // Avoid a layout jump when reaching the last page with empty rows.
    private isEmptyRows() {
        return this.state.page > 0 ? Math.max(0, (1 + this.state.page) * this.state.rowsPerPage - this.state.rows.length) : 0
    };

    private ascendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) return 1;
        if (b[orderBy] > a[orderBy]) return -1;
        return 0;
    }

    private descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) return -1;
        if (b[orderBy] > a[orderBy]) return 1;
        return 0;
    }

    public getComparator<Key extends keyof any>(order: Order, orderBy: Key,): (
        a: { [key in Key]: number | string },
        b: { [key in Key]: number | string },
        ) => number {
        return order === 'desc'
            ? (a, b) => this.descendingComparator(a, b, orderBy)
            : (a, b) => this.ascendingComparator(a, b, orderBy);
    }
      
    private handleRequestSort(property: keyof Data) {
        const isAsc = this.state.orderBy === property && this.state.order === 'asc';
        this.setState({ order: isAsc ? 'desc' : 'asc' });
        this.setState({ orderBy: property });
    }
      
    private handleChangePage = (event: unknown, newPage: number) => {
        this.setState({ page: newPage });
    };
    
    private handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
        this.setState({ page: 0 });
    };
      

    render() {
        return (
            <Box sx={{ width: '100%' }}>
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
                            <TableRow hover role="checkbox" tabIndex={-1}key={row.name}>
                                <TableCell component="th" id={labelId} scope="row" padding="none">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.address}</TableCell>
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
            </Box>
            );
    }


}

export default List;