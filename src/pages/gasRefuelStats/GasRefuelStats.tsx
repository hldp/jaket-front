import React from "react";
import AppBarCustom from "../../modules/appBar/AppBar";
import './GasRefuelStats.css'
import {Subscription} from "rxjs";
import {refuelAPI} from "../../modules/services/refuelAPI.service";
import {PeriodEnum} from "../../models/period.enum";
import {GasRefuelStatsModel} from "../../models/gasRefuelStats.model";
import {Card, Box, Container, Table, TableBody, TableCell, TableRow} from "@mui/material";
import LineGraph from "../../modules/lineGraph/LineGraph";
import {GasDataPrice} from "../../models/gasDataPrice.model";
import {GasType} from "../../models/gasType.enum";
import {useNavigate} from "react-router-dom";
import {connect} from "react-redux";

class GasRefuelStats extends React.Component<{userLogged: any, navigate: any},{gasRefuelStats: GasRefuelStatsModel[], selectedGas: string, gasList: string[], gasData: GasDataPrice[]}> {

    private refuel_stats_request: Subscription | undefined;
    private refuelApi: refuelAPI = new refuelAPI();

    constructor(props:any){
        super(props);
        this.state = {
            gasRefuelStats: [],
            selectedGas: '',
            gasList: [],
            gasData: [],
        }
        this.loadRefuelStats(PeriodEnum.ALL);
        this.changeSelectedGas = this.changeSelectedGas.bind(this);
        this.getLiterPriceAverage = this.getLiterPriceAverage.bind(this);
        this.getNumberRefuel = this.getNumberRefuel.bind(this);
        this.loadGasData = this.loadGasData.bind(this);
        this.getGasRefuelByGasName = this.getGasRefuelByGasName.bind(this);
    }

    componentDidUpdate() {
        if (!this.props.userLogged.isLogged) {
            this.props.navigate('/');
        }
    }

    componentWillUnmount() {
        if (this.refuel_stats_request) this.refuel_stats_request.unsubscribe();
    }

    /**
     * Load refuel stats
     * @param period
     * @private
     */
    private loadRefuelStats(period: string):void{
        this.setState({ gasRefuelStats: [], gasList: [], selectedGas: '', gasData: [] });
        this.refuel_stats_request = this.refuelApi.getRefuelStats(PeriodEnum.ALL).subscribe((gasRefuelStats: GasRefuelStatsModel[]) => {
            const gasList = gasRefuelStats.map((gasRefuelStat: GasRefuelStatsModel) => {return gasRefuelStat.gas_name});
            this.setState({gasList: gasList});
            this.setState({gasRefuelStats: gasRefuelStats});
            this.setState({selectedGas: gasList[0]});
            this.loadGasData(gasList[0]);
        });
    }

    /**
     * Change the selected gas
     * @param event
     * @private
     */
    private changeSelectedGas(event:any):void {
        this.setState({selectedGas:event.target.value});
        this.loadGasData(event.target.value);
    }

    /**
     * Get price average for liter of gas
     * @private
     */
    private getLiterPriceAverage():number {
        const gasRefuel = this.getGasRefuelByGasName(this.state.selectedGas);
        if(gasRefuel) {
            return gasRefuel.averageLiterPrice ?? 0;
        }
        return 0;
    }

    /**
     * Get number of refuel for gas
     * @private
     */
    private getNumberRefuel():number {
        const gasRefuel = this.getGasRefuelByGasName(this.state.selectedGas);
        if(gasRefuel) {
            return gasRefuel.nbFill ?? 0;
        }
        return 0;
    }

    /**
     * Load gas data for chart
     * @private
     */
    private loadGasData(gas_name: string):void {
        const gasRefuel = this.getGasRefuelByGasName(gas_name);
        const gasData: any = [];
        if(gasRefuel) {
            for (const userGasRefuel of gasRefuel.list) {
                const date = new Date(userGasRefuel.date);
                gasData.push({
                    date: date.toDateString(),
                    price: (userGasRefuel.total_price / userGasRefuel.quantity).toFixed(2),
                })
            }
        }

        this.setState({
            gasData: [
                {gas: gas_name as GasType, data: gasData},
            ]
        });
    }

    /**
     * Fin gas refuel by gas name
     * @param gas_name
     * @private
     */
    private getGasRefuelByGasName(gas_name: string) : GasRefuelStatsModel | null {
        for(const gasRefuel of this.state.gasRefuelStats) {
            if(gasRefuel.gas_name === gas_name) {
                return gasRefuel;
            }
        }
        return null;
    }

    render()  {
        const options: any[] = [];
        this.state.gasList.forEach((gas_name)=> {
            options.push(<option key={gas_name} value={gas_name}>{gas_name}</option>)
        });

        return (
            <Box  sx={{
                bgcolor: 'background.default',
                color: 'text.primary',
                height: '100%',
            }}>
                <AppBarCustom/>
                <Container>
                    <h1>Gas refuel statistics</h1>
                    <Table size="small" sx={{
                        bgcolor: 'background.default',
                    }}>
                        <TableBody>
                            <TableRow>
                                <TableCell>Number of refuel</TableCell>
                                <TableCell>{this.getNumberRefuel()}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Liter average price</TableCell>
                                <TableCell>{this.getLiterPriceAverage().toFixed(2)}€</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Gas</TableCell>
                                <TableCell>
                                    <select value={this.state.selectedGas} onChange={this.changeSelectedGas}>
                                        {options}
                                    </select>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    {(this.state.gasData.length > 0) ?
                        <Card className="infoCard">
                            <LineGraph gasData={this.state.gasData}/>
                        </Card>
                        : ''}
                </Container>
            </Box >
        );
    }
}

const userLoggedToProps = (state: any) => {
    return {
        userLogged: state.userLogged
    }
}

function WithHooks(props: any) {
    let navigate = useNavigate();
    return <GasRefuelStats {...props} navigate={navigate} />
}

export default connect(userLoggedToProps)(WithHooks);
