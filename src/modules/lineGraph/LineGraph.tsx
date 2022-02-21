import React from "react";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GasDataPrice } from "../../models/gasDataPrice.model";
import { GasType } from "../../models/gasType.enum";
import './LineGraph.css'

class LineGraph extends React.Component<{gasData: GasDataPrice[]},{gasData: GasDataPrice[]}>{

    constructor(props:any){
        super(props);
        this.state = {
            gasData : props.gasData,
        }
    }

    componentDidUpdate(prevProps: any, prevState: any, snapshot?: any) {
        if(prevProps.gasData !== this.props.gasData) {
            this.setState({gasData: this.props.gasData});
        }
    }

    private getColorPerGas(gaz : GasType): string{
        if(gaz === GasType.DIESEL) return "#ff7300";
        if(gaz === GasType.SP98) return "#3232a8";
        if(gaz === GasType.SP95) return "#6464a3";
        if(gaz === GasType.ETHANOL) return "#c7c114";
        if(gaz === GasType.GPL) return "#45a2c4";
        return "#000000";
    }

    render(){
        return (
            <div>
                 <ResponsiveContainer width="100%" height={300}>
                    <LineChart margin={{ top: 10, right: 10, left: 5, bottom: 10 }}>
                        <XAxis dataKey="date" type="category" allowDuplicatedCategory={false}  
                        style={{
                            fontSize: '0.7rem',
                            fontFamily: 'Arial'
                        }}/>
                        <YAxis width={40} dataKey="price" type="number" unit="€" domain={['auto', 'auto']} 
                        style={{
                            fontSize: '0.7rem',
                            fontFamily: 'Arial',
                        }}></YAxis>
                        <Tooltip/>
                        <Legend />
                        {this.state.gasData.map(s => (
                            <Line stroke={this.getColorPerGas(s.gas)} dataKey="price" data={s.data} name={s.gas} key={s.gas} />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        )
    }
    

}

export default LineGraph;