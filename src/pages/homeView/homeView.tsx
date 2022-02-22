import React from 'react';
import Search from '../../modules/search/Search';
import AppBarCustom from '../../modules/appBar/AppBar';
import { Alert, Box, Button, Grid } from '@mui/material';
import './homeView.css';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

class HomeView extends React.Component<{stationFilter:any, dispatch:any, navigate?: any},{displayAlert: boolean}> {

  constructor(props: any) {
    super(props);
    this.state = {
        displayAlert: false
    }
    this.onSearch = this.onSearch.bind(this);
  }

  /**
   * Called on search btn click
   */
  public onSearch() {
    if (this.props.stationFilter.selectedCity == null) {
        this.setState({ displayAlert: true })
    } else {
        this.setState({ displayAlert: false })
        if (this.props.navigate) this.props.navigate('/home');
    }
  }

  render() {
    return (
      <Box component={Grid} container spacing={2} height={'100%'} style={{ background: 'black' }}>
        <Box component={Grid} item xs={12} height={'81px'}>
          <AppBarCustom></AppBarCustom>
        </Box>
        <Box component={Grid} item xs={12} sx={{ paddingBottom: 2 }} className='search-container'>
            <Box component={Grid} container boxShadow={5} className='search-subcontainer'>
                <Box component={Grid} item xs={12} className='alert-container'>
                    {(this.state.displayAlert)?
                        <Alert severity="error">Please select a city or use your geolocation !</Alert>:''}
                </Box>
                <Box component={Grid} item xs={12} sx={{ marginTop: '65px' }}>
                    <Search isOnFirstPage={true} ></Search>
                </Box>
                <Box component={Grid} item xs={12}>
                    <Button variant="contained" onClick={this.onSearch} className='button'>Search</Button>
                </Box>
            </Box>
        </Box>
      </Box>
    );
  }
}

function WithNavigate(props: any) {
    let navigate = useNavigate();
    return <HomeView {...props} navigate={navigate} />
}

const mapStateToProps = (state: any) => {
    return {
      stationFilter: state.stationFilter
    }
}
export default connect(mapStateToProps)(WithNavigate);