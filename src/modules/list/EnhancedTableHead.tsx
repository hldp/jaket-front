import { TableHead, TableRow, TableCell, TableSortLabel, Box } from "@mui/material";
import React from "react";
import { visuallyHidden } from '@mui/utils';

export interface Data {
    id: number;
    address: string;
    Gazole: number; //gazole
    SP95: number; // sp95
    E85: number; // e85
    GPLc: number; // gpLc
    SP95_e10: number; // sp95_e10
    SP98: number; // sp98
    distance: number;
    open: boolean;
}
interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    sortable?: boolean;
    numeric: boolean;
}

export type Order = 'asc' | 'desc';

class EnhancedTableHead extends React.Component<{
    onRequestSort: (property: keyof Data) => void;
    order: Order;
    orderBy: string;
    rowCount: number; }, {}> {

    public headCells: readonly HeadCell[];

    constructor(props: any) {
        super(props);
        this.headCells = [
            {
                id: 'address',
                numeric: false,
                disablePadding: true,
                sortable: true,
                label: 'Address',
            },
            {
                id: 'Gazole',
                numeric: true,
                disablePadding: false,
                sortable: true,
                label: 'Gazole',
            },
            {
                id: 'SP95',
                numeric: true,
                disablePadding: false,
                sortable: true,
                label: 'SP95',
            },
            {
                id: 'E85',
                numeric: true,
                disablePadding: false,
                sortable: true,
                label: 'E85',
            },
            {
                id: 'GPLc',
                numeric: true,
                disablePadding: false,
                sortable: true,
                label: 'GPLc',
            },
            {
                id: 'SP95_e10',
                numeric: true,
                disablePadding: false,
                sortable: true,
                label: 'SP95_e10',
            },
            {
                id: 'SP98',
                numeric: true,
                disablePadding: false,
                sortable: true,
                label: 'SP98',
            },
            {
                id: 'distance',
                numeric: true,
                disablePadding: false,
                sortable: true,
                label: 'Distance',
            },
            {
                id: 'open',
                numeric: true,
                disablePadding: false,
                sortable: false,
                label: 'Open',
            },
        ];
    }

    public createSortHandler(property: keyof Data) {
        return (event: React.MouseEvent<unknown>) => {
            this.props.onRequestSort(property);
        };
    }

    render() {
        return (
            <TableHead>
                <TableRow>
                    {this.headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={this.props.orderBy === headCell.id ? this.props.order : false}
                        >
                            {headCell.sortable ? (
                                <TableSortLabel
                                    active={this.props.orderBy === headCell.id}
                                    direction={this.props.orderBy === headCell.id ? this.props.order : 'asc'}
                                    onClick={this.createSortHandler(headCell.id)}
                                >
                                    {headCell.label}
                                    {this.props.orderBy === headCell.id ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {this.props.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
                            ) : (<p>{headCell.label}</p>) }
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }
}

export default EnhancedTableHead;
