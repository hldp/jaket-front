import { Button } from "@mui/material";
import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';

// Props, state
class Timer extends React.Component<{ defaultTimer: number }, {timer: number}> {

    constructor(props: any) {
        super(props);
        this.state = { timer: this.props.defaultTimer };
        this.reset = this.reset.bind(this);
    }

    componentDidMount() {
        setInterval(() => {
            this.setState(state => ({
                timer: state.timer + 1
              }));
        }, 1000)
    }

    public reset(): void{
        this.setState(state=>({
            timer: 0
        }))
    }
    
    render(): React.ReactNode {
        return(
            <div>
            <div>
                {this.state.timer}
            </div>
            <Button variant="contained" endIcon={<DeleteIcon />}onClick={this.reset}>Reset</Button>
            </div>
        );
    }

}

export default Timer;