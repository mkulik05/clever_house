import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Numpad from '../components/Numpad';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Router from 'next/router';

const useStyles = makeStyles(() => ({
    root: {
        height: "100vh",
        width: "100vw",
        backgroundColor: '#00042b'
    },
    nump: {
        margin: 'auto'
    },
    numpParent: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: '#00042b'
    },
    dialog: {
        width: "100vw",
        height: "100vh",
        position: "absolute",
        backgroundColor: '#00042b',
        opacity: 0.9,
        zIndex: 50,
        color: 'white',
        fontSize: '40px',
        textAlign: 'center',
        paddingTop: '100px'
    },
    backBtn: {
        position: 'absolute',
        fontSize: '70px',
        zIndex: 100
    }
}));

export default function Login() {
    const classes = useStyles();

    let [pwdL, setPwdL] = useState(0)
    let [deny, setDeny] = useState(0)
    let [blocked, block] = useState(0)

    let verify = async (pwd) => {
        let res = await fetch('/api/login', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pwd: pwd })
        });
        let status = res.status
        if (status === 200) {
            Router.push('/video')
        } else if (status === 423) {
            res = await res.json()
            res = res.status
            res = parseInt(res.slice(res.indexOf(':') + 1))
            setSeconds(res)
            block(1)
            localStorage.setItem('blocked_for', res.toString())
            localStorage.setItem('last_updated', new Date())
        } else {
            setDeny(1)
            setTimeout(() => {
                setDeny(0)
            }, 700)
        }
    }
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (blocked) {
            if (seconds > 0) {
                setTimeout(() => {
                    setSeconds(seconds - 1)
                    localStorage.setItem('blocked_for', (seconds - 1).toString())
                    localStorage.setItem('last_updated', new Date())
                }, 1000);
            } else {
                setSeconds(0);
                block(0)
            }
        }
    });



    useEffect(async () => {
        let res = await fetch('/api/login')
        res = await res.json();
        setPwdL(parseInt(res))
        let b = localStorage.getItem('blocked_for')
        let last_date = localStorage.getItem('last_updated')
        if (last_date !== null) {
            last_date = new Date(last_date)
            let now = new Date()
            let diff = (now - last_date) / 1000
            if (b !== null) {
                b = parseInt(b)
                if (diff < b) {
                    setSeconds(b || 0 ? b - Math.round(diff) : 0)
                    block(1)
                }
            }
        }

    }, [])

    return (
        <Paper className={classes.root}>
            <KeyboardBackspaceIcon className={classes.backBtn} onClick={() => Router.push('/')} color="primary" />
            <Paper className={classes.numpParent}>
                <Paper className={classes.dialog} style={{ display: blocked ? 'block' : 'none' }}>Вы заблокированы на {seconds} секунд(ы)</Paper>

                <Numpad shuffle={deny} pwdL={pwdL} backgroundColor='#00042b' borderColor='#9c9c9c' boclassName={classes.nump} width={300} height={450} callback={(pwd) => { verify(pwd) }} />
            </Paper>
        </Paper>
    );
}