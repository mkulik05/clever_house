import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(() => ({
    temp_block: {
        gridArea: 'temp',
        backgroundColor: '#00042b',
        border: '1px solid #9c9c9c',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    temp: {
        textAlign: 'center',
        fontSize: '100pt',
        color: 'white'
    },
}));
export default function Temperature() {
    const classes = useStyles();
    let [t, setT] = useState(20)
    useEffect(()=>{
        setInterval(async() =>{
            let res = await fetch('https://10.8.0.1:3001/data/temp')
            res = await res.json();
            console.log("A", res)
            setT(res.temp)
        }, 4000)
    }, [])
    return (
        <Paper className={classes.temp_block}>
            <Typography className={classes.temp}>{t}°C</Typography>
        </Paper>
    );
}
