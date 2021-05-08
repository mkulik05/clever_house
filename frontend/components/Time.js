import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(() => ({
    time_block: {
        gridArea: 'time',
        backgroundColor: '#00042b',
        border: '1px solid #9c9c9c',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    time: {
        textAlign: 'center',
        fontSize: '120pt',
        color: 'white'
    },
}));

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export default function Time() {
    const classes = useStyles();
    return (
        <Paper className={classes.time_block}>
            <Typography className={classes.time}>12:31</Typography>
        </Paper>
    );
}
