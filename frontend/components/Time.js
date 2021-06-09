import React, { useEffect, useState } from 'react';
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
        fontSize: '12vw',
        color: 'white'
    },
}));

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export default function Time() {
    const classes = useStyles();
    let [time, setTime] = useState("00:00")
    useEffect(()=>{
        setInterval(async() =>{
            let t = new Date()
            let h = t.getHours();
            let m = t.getMinutes();
            setTime((h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m))
        }, 60 * 1000)
    }, [])
    return (
        <Paper className={classes.time_block}>
            <Typography className={classes.time}>{time}</Typography>
        </Paper>
    );
}
