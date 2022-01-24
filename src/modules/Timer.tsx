import React from "react";

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
            <button onClick={this.reset}></button>
            </div>
        );
    }

}

export default Timer;