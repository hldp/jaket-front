import { AccountCircle } from "@mui/icons-material";
import { Box, Toolbar, IconButton, Typography, AppBar } from "@mui/material";
import React from "react";

class AppBarCustom extends React.Component<{}, { anchorEl: null | HTMLElement, mobileMoreAnchorEl: null | HTMLElement }>{

    public menuId = 'primary-search-account-menu'
    public mobileMenuId = 'primary-search-account-menu-mobile';
    public isMenuOpen;
    public isMobileMenuOpen;

    constructor(props : any){
        super(props);

        this.state = {
            anchorEl: null,
            mobileMoreAnchorEl: null
        }
        
        this.isMenuOpen = Boolean(this.state.anchorEl);
        this.isMobileMenuOpen = Boolean(this.state.mobileMoreAnchorEl);

        this.handleMobileMenuOpen = this.handleMobileMenuOpen.bind(this);
        this.handleProfileMenuOpen = this.handleProfileMenuOpen.bind(this);
        this.handleMobileMenuClose = this.handleMobileMenuClose.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
    }
  
  
    public handleProfileMenuOpen(event: React.MouseEvent<HTMLElement>) {
        this.setState({ anchorEl: event.currentTarget });
    };
  
    public handleMobileMenuClose() {
      this.setState({ mobileMoreAnchorEl: null });
    };
  
    public handleMenuClose() {
      this.setState({ anchorEl: null });
      this.handleMobileMenuClose();
    };
  
    public handleMobileMenuOpen(event: React.MouseEvent<HTMLElement>) {
      this.setState({ mobileMoreAnchorEl: event.currentTarget });
    };
  
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
                            aria-controls={this.menuId}
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