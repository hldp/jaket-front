import { TableHead, TableRow, TableCell, TableSortLabel, Box } from "@mui/material";
import React from "react";
import { visuallyHidden } from '@mui/utils';

export interface Data {
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
interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
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
              id: 'name',
              numeric: false,
              disablePadding: true,
              label: 'Name',
            },
            {
              id: 'address',
              numeric: true,
              disablePadding: false,
              label: 'Address',
            },
            {
              id: 'gas_1',
              numeric: true,
              disablePadding: false,
              label: 'Gazole',
            },
            {
              id: 'gas_2',
              numeric: true,
              disablePadding: false,
              label: 'SP95',
            },
            {
              id: 'gas_3',
              numeric: true,
              disablePadding: false,
              label: 'E85',
            },
            {
              id: 'gas_4',
              numeric: true,
              disablePadding: false,
              label: 'GPLc',
            },
            {
              id: 'gas_5',
              numeric: true,
              disablePadding: false,
              label: 'SP95_e10',
            },
            {
              id: 'gas_6',
              numeric: true,
              disablePadding: false,
              label: 'SP98',
            },
            {
              id: 'open',
              numeric: true,
              disablePadding: false,
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
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
        );
    }                                                    
}
  
export default EnhancedTableHead;
