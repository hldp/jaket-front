import {AccountCircle, Logout, Settings, LocalGasStation, QueryStatsSharp} from "@mui/icons-material";
import {
    Box,
    Toolbar,
    IconButton,
    Typography,
    AppBar,
    Tooltip,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    Dialog,
    Slide,
    Snackbar,
    Alert,
    useTheme
} from "@mui/material";
import React , { useContext }from "react";
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';
import LoginForm from "../loginForm/LoginForm";
import RefuelForm from "../refuelForm/refuelForm";
import { ColorModeContext } from "../../App";
import {Location, useLocation, useNavigate} from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

class AppBarCustom extends React.Component<{
    colorMode: any, navigate: any, location: Location, theme: any
}, { anchorEl: null | HTMLElement, dialogOpen: boolean, userLogged: boolean, dialogGasOpen: boolean, snackbarOpen: boolean, canGoBack: boolean }> {


    public snackbarSuccess: any;
    public snackbarMessage: string = "";

    constructor(props : any){
        super(props);

        // Bind functions
        this.handleProfileMenuOpen = this.handleProfileMenuOpen.bind(this);
        this.handleOnAcccountMenuClose = this.handleOnAcccountMenuClose.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.updateLoginStatus = this.updateLoginStatus.bind(this);
        this.handleGasFuelPopup = this.handleGasFuelPopup.bind(this);
        this.handleGasRefuelStatsPage = this.handleGasRefuelStatsPage.bind(this);
        this.logout = this.logout.bind(this);
        this.openSnackbar = this.openSnackbar.bind(this);
        this.closeSnackbar = this.closeSnackbar.bind(this);
        this.changeTheme = this.changeTheme.bind(this);

        // Init state
        this.state = {
            anchorEl: null,
            dialogOpen: false,
            userLogged: false,
            dialogGasOpen: false,
            snackbarOpen: false,
            canGoBack: false
        }
    }

    componentDidMount() {
        if (this.props.location.pathname.split('/')[1] === 'stationDetails') this.setState({ canGoBack: true })
        else this.setState({ canGoBack: false })
    }

    /**
     * Called on profile btn click
     * @param event
     */
    public handleProfileMenuOpen(event: React.MouseEvent<HTMLElement>) {
        this.setState({ anchorEl: event.currentTarget });
    };

    public handleOnAcccountMenuClose() {
        this.setState({ anchorEl: null });
    };

    public handleDialogClose() {
        this.setState({ dialogOpen: false })
    }

    public updateLoginStatus(logged: boolean) {
        this.setState({ userLogged: logged, dialogOpen: false })
    }

    public logout() {
        this.setState({ userLogged: false })
    }

    public handleGasFuelPopup(){
        this.setState({dialogGasOpen: !this.state.dialogGasOpen})
    }

    public handleGasRefuelStatsPage() {
        this.props.navigate('/gasRefuelStats');
    }

    /**
     * Open the snackbar
     * @param success 
     * @param message 
     */
    public openSnackbar(success: boolean, message: string): void{
        this.snackbarMessage = message;
        success ? this.snackbarSuccess = "success" : this.snackbarSuccess = "error";
        this.setState({snackbarOpen:true});
    }

    /**
     * Called when snackbar is closed
     * @param e 
     */    
    public closeSnackbar(e:any):void{
        this.setState({snackbarOpen:false});
    }

    /**
     * Returns the menu when the user is not logged
     * @returns 
     */
    public renderMenuLogged() {
        return(
            [
                <MenuItem key="myaccount">
                    <Avatar /> My account
                </MenuItem>,
                <Divider key="divider" />,
                <MenuItem key="settings">
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>,
                <MenuItem key="logout" onClick={this.logout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            ]
        )
    }

    /**
     * Returns the menu when the user is not logged
     * @returns 
     */
    public renderMenuNotLogged() {
        return(
            [
                <MenuItem key="signup" onClick={() => { this.setState({ dialogOpen: true })}}>
                    <Avatar /> Sign Up
                </MenuItem>
            ]
        )
    }

    /**
     * Change the app theme color
     */
    public changeTheme() {
        this.props.colorMode.toggleColorMode();
    }

    /**
     * Render the component
     * @returns
     */
    render(): React.ReactNode {
        return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" style={{ background: '#fecc00' }}>
                <Toolbar>
                    {(this.state.canGoBack)?
                        <Tooltip title="Go back">
                            <IconButton
                                size="large"
                                edge="start"
                                aria-label="Go back"
                                aria-controls='go-back-button'
                                aria-haspopup="true"
                                onClick={(e) => {this.props.navigate(-1)}}
                                color="inherit"
                                sx={{ color: 'black'}}
                            >
                                <ArrowBackIosIcon/>
                            </IconButton>
                         </Tooltip>

                    :''}

                    <Typography variant="h6" noWrap component="div" sx={{ display: 'block', color: 'black' }}>
                    JAKET
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex' }}>

                    <IconButton sx={{ ml: 1 }} onClick={this.changeTheme} color="inherit">
                        {this.props.theme.palette.mode === 'light' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>

                    {(this.state.userLogged) ?
                        <Tooltip title="Add new gas fuel">
                            <IconButton
                            size="large"
                            edge="end"
                            aria-label="Adding fuel"
                            aria-controls='adding-fuel-button'
                            aria-haspopup="true"
                            onClick={this.handleGasFuelPopup}
                            color="inherit"
                            sx={{ color: 'black'}}
                            >
                                <LocalGasStation/>
                            </IconButton>
                        </Tooltip>
                    : ''}
                        {(this.state.userLogged) ?
                            <Tooltip title="View gas refuel">
                                <IconButton
                                    size="large"
                                    edge="end"
                                    aria-label="View gas refuel"
                                    aria-controls='view-refuel-button'
                                    aria-haspopup="true"
                                    onClick={this.handleGasRefuelStatsPage}
                                    color="inherit"
                                    sx={{ color: 'black'}}
                                >
                                    <QueryStatsSharp/>
                                </IconButton>
                            </Tooltip>
                    : ''}
                    {(this.state.dialogGasOpen) ? <RefuelForm onClose={this.handleGasFuelPopup} openSnackbar={this.openSnackbar}></RefuelForm> : ''}

                        <Tooltip title="Account settings">
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls='primary-search-account-menu'
                                aria-haspopup="true"
                                onClick={this.handleProfileMenuOpen}
                                color="inherit"
                                sx={{ color: 'black'}}
                            >
                                <AccountCircle />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Menu
                        anchorEl={this.state.anchorEl}
                        id="account-menu"
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.handleOnAcccountMenuClose}
                        onClick={this.handleOnAcccountMenuClose}
                        PaperProps={{ elevation: 0,
                            sx: { overflow: 'visible', filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5, '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                                    '&:before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14,
                                        width: 10, height: 10, bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)', zIndex: 0,
                                    },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        {(this.state.userLogged)?this.renderMenuLogged():this.renderMenuNotLogged()}
                    </Menu>

                </Toolbar>
            </AppBar>



            <Dialog fullScreen open={this.state.dialogOpen} onClose={this.handleDialogClose} TransitionComponent={Transition}>
                <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={this.handleDialogClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">Login</Typography>
                </Toolbar>
                </AppBar>
                <LoginForm updateLoginStatus={this.updateLoginStatus}></LoginForm>
            </Dialog>

            <Snackbar
            open={this.state.snackbarOpen}
            autoHideDuration={3000}
            onClose={this.closeSnackbar}
            anchorOrigin={{horizontal: 'center', vertical: 'bottom'}}
            >
            <Alert
            severity={this.snackbarSuccess}>
            {this.snackbarMessage}
            </Alert>
            </Snackbar>

        </Box>


        );
    }

}

function WithHooks(props: any) {
    let colorMode = useContext(ColorModeContext);
    let theme = useTheme();
    let navigate = useNavigate();
    let location = useLocation();
    return <AppBarCustom {...props} theme={theme} colorMode={colorMode} navigate={navigate} location={location} />
}

export default WithHooks;