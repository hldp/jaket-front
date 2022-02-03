import { AccountCircle } from "@mui/icons-material";
import { Box, Toolbar, IconButton, Typography, AppBar } from "@mui/material";
import React from "react";

class AppBarCustom extends React.Component<{}, { anchorEl: null | HTMLElement }>{

    constructor(props : any){
        super(props);

        // Bind functions
        this.handleProfileMenuOpen = this.handleProfileMenuOpen.bind(this);

        // Init state
        this.state = {
            anchorEl: null
        }
    }

    /**
     * Called on profile btn click
     * @param event 
     */
    public handleProfileMenuOpen(event: React.MouseEvent<HTMLElement>) {
        this.setState({ anchorEl: event.currentTarget });
    };
  
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
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
        );
    }

}
export default AppBarCustom;