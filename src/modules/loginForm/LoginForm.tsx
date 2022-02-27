import {Typography, TextField, Button, Grid, Link, Paper, Box, Alert} from "@mui/material";
import React from "react";
import {authAPI} from "../services/authAPI.service";
import {updateIsLogged, updateToken} from "../../store/slices/userLogged";
import {connect} from "react-redux";

class LoginForm extends React.Component<{
    closeLoginPopup: () => void;
    dispatch:any,
}, { username: string, password: string, signIn: boolean, error: string }>{
    private authApi: authAPI;

    constructor(props : any){
        super(props);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.switchSignInOruP = this.switchSignInOruP.bind(this);

        this.authApi = new authAPI();

        // Init state
        this.state = {
            username: "",
            password: "",
            signIn: true,
            error: ""
        }
    }

    public handleUsernameChange(e: any) {
        this.setState({ username: e.currentTarget.value });
    }

    public handlePasswordChange(e: any) {
        this.setState({ password: e.currentTarget.value });
    }

    public handleSubmit() {
        if (this.state.username && this.state.password) {
            if (this.state.signIn) {
                this.authApi.signIn(this.state.username, this.state.password).subscribe((res)=>{
                    console.log("res");
                    if(res){
                        console.log(res);
                        this.props.dispatch(updateIsLogged(true));
                        this.props.dispatch(updateToken(res.data.access_token));
                        this.props.closeLoginPopup();
                    }
                },err => this.handleError(err));
            } else {
                this.authApi.signUp(this.state.username, this.state.password).subscribe((res)=>{
                    if(res){
                        this.switchSignInOruP();
                        this.handleSubmit();
                    }
                },err => this.handleError(err));
            }
        }
    }

    public handleError(error: any) {
        const errorMsg = error.data.message ?? "Unknown error";
        this.setState({ error: errorMsg });
    }

    public switchSignInOruP() {
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
                <Paper elevation={10} style={{padding :20,height:'50vh',width:300, margin:"40px auto"}}>
                    <Grid alignSelf={'center'}>
                        <h2>{this.state.signIn ?'Sign In':'Sign Up'}</h2>
                    </Grid>
                    <Box component={Grid} item xs={12} sx={{ pb: "1vh" }}>
                        {(this.state.error !== "") ? <Alert severity="error">{this.state.error}</Alert>:''}
                    </Box>
                    <TextField label='Username' placeholder='Enter username' fullWidth required sx={{ marginBottom: '10px' }} onChange={this.handleUsernameChange}/>
                    <TextField label='Password' placeholder='Enter password' type='password' fullWidth required onChange={this.handlePasswordChange}/>
                    <Button type='submit' color='primary' variant="contained" style={{margin:'8px 0'}} fullWidth onClick={this.handleSubmit}>{this.state.signIn ?'Sign In':'Sign Up'}</Button>
                    <Typography > {this.state.signIn ?"You don't have an account ? ":"Do you have an account ? "}
                        <Link href="#" sx={{ color: 'text.primary'}} onClick={this.switchSignInOruP}>{this.state.signIn ?'Sign Up':'Sign In'}</Link>
                    </Typography>
                </Paper>
            </Grid>
        );
    }
}

const userLoggedToProps = (state: any) => {
    return {
        userLogged: state.userLogged
    }
}

export default connect(userLoggedToProps)(LoginForm);