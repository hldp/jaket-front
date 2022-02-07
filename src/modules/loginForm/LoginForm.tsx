import { Typography, TextField, Button, Grid, Link, Paper } from "@mui/material";
import React from "react";


class LoginForm extends React.Component<{
    updateLoginStatus: (logged: boolean) => void;
}, { username: string, password: string, signIn: boolean }>{

    constructor(props : any){
        super(props);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.login = this.login.bind(this);
        this.signIn = this.signIn.bind(this);
        
        // Init state
        this.state = {
            username: "",
            password: "",
            signIn: false
        }
    }

    public handleUsernameChange(e: any) {
        this.setState({ username: e.currentTarget.value });
    }

    public handlePasswordChange(e: any) {
        this.setState({ password: e.currentTarget.value });
    }

    public login() {
        // login with API
        this.props.updateLoginStatus(true);
    }

    public signIn() {
        const signIn = this.state.signIn;
        this.setState({ signIn: !signIn });
    }
  
    /**
     * Render the component
     * @returns 
     */
    render(): React.ReactNode {
        return (
            <Grid>
                <Paper elevation={10} style={{padding :20,height:'50vh',width:280, margin:"40px auto"}}>
                    <Grid alignSelf={'center'}>
                        <h2>{this.state.signIn ?'Sign In':'Sign Up'}</h2>
                    </Grid>
                    <TextField label='Username' placeholder='Enter username' fullWidth required sx={{ marginBottom: '10px' }}/>
                    <TextField label='Password' placeholder='Enter password' type='password' fullWidth required/>
                    <Button type='submit' color='primary' variant="contained" style={{margin:'8px 0'}} fullWidth onClick={this.login}>{this.state.signIn ?'Sign In':'Sign Up'}</Button>
                    <Typography > {this.state.signIn ?"Do you have an account ?":"You don't have an account ?"}
                        <Link href="#" onClick={this.signIn}>{this.state.signIn ?'Sign Up':'Sign In'}</Link>
                    </Typography>
                </Paper>
            </Grid>
        );
    }

}
export default LoginForm;