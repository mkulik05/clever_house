import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Numpad from '../components/Numpad';


const useStyles = makeStyles(() => ({
    root: {
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    nump: {
    }
}));

export default function Login() {
    let verify = async (pwd) => {
        let res = await fetch('/api/login', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pwd: pwd })
        });
        res = await res.json();
        console.log(res)
        res = res.status
        if (res === 'OK') {
            alert("logined successfully")
        } else {
            setDeny(1)
            setTimeout(() => {
                setDeny(0)
            }, 700)
        }
    }

    let [pwdL, setPwdL] = useState(0)
    let [deny, setDeny] = useState(0)
    const classes = useStyles();
    useEffect(async () => {
        let res = await fetch('/api/login')
        console.log(res)
        res = await res.json();
        setPwdL(parseInt(res))
    }, [])
    return (
        <Paper className={classes.root}>
            <Numpad shuffle={deny} pwdL={pwdL} className={classes.nump} width={300} height={450} callback={(pwd) => { verify(pwd) }} />
        </Paper>
    );
}