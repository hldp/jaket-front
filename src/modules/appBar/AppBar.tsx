import { AccountCircle, Logout, Settings } from "@mui/icons-material";
import { Box, Toolbar, IconButton, Typography, AppBar, Tooltip, Avatar, Menu, MenuItem, Divider, ListItemIcon, Dialog, Slide } from "@mui/material";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';
import LoginForm from "../loginForm/LoginForm";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

class AppBarCustom extends React.Component<{}, { anchorEl: null | HTMLElement, dialogOpen: boolean, userLogged: boolean }>{

    constructor(props : any){
        super(props);

        // Bind functions
        this.handleProfileMenuOpen = this.handleProfileMenuOpen.bind(this);
        this.handleOnAcccountMenuClose = this.handleOnAcccountMenuClose.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.updateLoginStatus = this.updateLoginStatus.bind(this);
        this.logout = this.logout.bind(this);
        
        // Init state
        this.state = {
            anchorEl: null,
            dialogOpen: false,
            userLogged: false
        }
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
     * Render the component
     * @returns 
     */
    render(): React.ReactNode {
        return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" style={{ background: '#fecc00' }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ display: 'block', color: 'black' }}>
                    JAKET
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex' }}>
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
        </Box>
        );
    }

}
export default AppBarCustom;