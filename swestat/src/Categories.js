import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Map from './Map.js'

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    overflow: "auto",
    height: "100%",
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
});


function PermanentDrawerRight(props) {
  const { classes } = props;
  const [count, setCount] = useState('/salary');

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <img id="sweep" src="./sweep.png" alt="Sweep Logo" />
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <Map mapDataEndPoint={count} />
      </main>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="right"
      >
        <div className={classes.toolbar}>
        </div>
        <Divider />
        <List>
          {
            <div>
              <ListItem button key="population" onClick={() => {
                setCount('/population')
              }}>
                <ListItemIcon  >
                  <img className="icons" src="./buy.png" alt="Population" />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  style={{ color: 'white' }} primary='Average yearly salary' />
              </ListItem>

              <ListItem button key='salary' onClick={() => {
                setCount('/salary')
              }}>
                <ListItemIcon>
                  <img className="icons" src="./team.png" alt="Salary" />

                </ListItemIcon>
                <ListItemText
                  disableTypography
                  style={{ color: 'white' }} primary='Population' />
              </ListItem>


            </div>
          }
        </List>
      </Drawer>
    </div>
  );
}

PermanentDrawerRight.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PermanentDrawerRight);