import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(() => ({
    weather: {
        gridArea: 'weather',
        backgroundColor: '#00042b',
        border: '1px solid #9c9c9c'
    },
}));



export default function Alarms() {
    const classes = useStyles();
    return (
        <Paper className={classes.weather}/>
    );
}
