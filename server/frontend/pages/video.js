import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Numpad from '../components/Numpad';
import { io } from "socket.io-client";

const socket = io();
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Router from 'next/router';
import ListItem from '@material-ui/core/ListItem';
import { Virtuoso } from 'react-virtuoso'
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';


const useStyles = makeStyles(() => ({
    root: {
        height: "100vh",
        width: "100vw",
        backgroundColor: '#00042b',
    },
    player: {
        width: '800px'
    },
    player_list: {
        height: "100vh",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00042b',
    },
    list: {
        height: '100%',
        marginLeft: 'auto',
        marginRight: 0,
        width: '230px'
    },
    '@media (max-width: 992px)': {
        player_list: {
            flexDirection: 'column',
        },
        player: {
            marginTop: 65,
            width: ' 500'
        },
        list: {
            marginTop: 20,
            margin: '0 auto'
        }
    },
    '@media (max-width: 768px)': {
        player: {
            width: '100vw'
        },
    }
}));

export default function Video() {
    let [vidList, setVidList] = useState([["08-05-2021--14:22:36.avi", "08-05-2021--14:32:37.mp4", "08-05-2021_10:36:58.avi", "08-05-2021_10:41:58.avi", "08-05-2021_10:46:59.avi", "08-05-2021_10:51:59.avi", "08-05-2021_10:56:59.avi", "08-05-2021_11:01:59.avi", "08-05-2021_11:06:59.avi", "08-05-2021_11:11:59.avi", "13-05-2021_19:25:35.avi", "13-05-2021_19:33:04.avi", "13-05-2021_19:40:29.mp4", "13-05-2021_20:14:41.avi", "13-05-2021_20:27:49.avi", "13-05-2021_21:07:43.mkv", "aaaaa.avi", "liberatum.avi", "liberatum2.avi", "liberatum3.avi", "liberatum3333333.avi", "out.avi", "out222.avi", "sample-30s.avi", "sample-5s.avi", "test.avi"], ["08-05-2021--14:22:36.mp4", "08-05-2021_10:36:58.mp4", "08-05-2021_10:41:58.mp4", "08-05-2021_10:46:59.mp4", "08-05-2021_10:51:59.mp4", "08-05-2021_10:56:59.mp4", "08-05-2021_11:01:59.mp4", "08-05-2021_11:06:59.mp4", "08-05-2021_11:11:59.mp4", "13-05-2021_19:25:35.mp4", "13-05-2021_19:33:04.mp4", "13-05-2021_20:14:41.mp4", "13-05-2021_21:07:43.mp4", "aaaaa.mp4", "liberatum.mp4", "liberatum2.mp4", "liberatum3.mp4", "liberatum3333333.mp4", "out.mp4", "out222.mp4", "sample-30s.mp4", "sample-5s.mp4", "test.mp4"]])
    let [video, setVideo] = useState("")
    const classes = useStyles();
    let selectVideo = (name) => {
        let converted = vidList[1];
        let res = []
        for (let i = 0; i < converted.length; i++) {
            res.push(converted[i].slice(0, converted[i].indexOf('.')))
        }
        name = name.slice(0, name.indexOf('.'))
        if (res.includes(name)) {
            setVideo(name + ".mp4")
        } else {
            socket.emit("convert", name);
        }
    }
    useEffect(async () => {
        let res = await fetch('/videos/list')
        res = await res.json()
        setVidList(res)
        socket.on("convert-finished", (name) => {
            setVideo(name + ".mp4")
            console.log(name + ".mp4")
        })
        socket.on("convert-progress", (progress) => {
            console.log("Progress: " + progress)
        })
        socket.on("convert-error", (name) => {
            console.log("convert-error: " + name)
        })
    }, [])
    return (
        <Paper className={classes.root}>
            <KeyboardBackspaceIcon onClick={() => Router.push('/')} style={{ position: 'absolute', fontSize: '70px', marginRight: 0 }} color="primary" />
            <Paper className={classes.player_list}>
                <video className={classes.player} controls autoplay onError={(e) => console.log(e)} url={`/videos/${video}`} type='video/mp4'>
                </video>
                <Virtuoso className={classes.list} totalCount={vidList[0].length} itemContent={index => (
                    <Paper style={{ background: '#00042b' }} onClick={() => selectVideo(vidList[0][index])}>
                        <ListItem button>
                            <ListItemText style={{ color: 'white' }} primary={vidList[0][index]} />
                        </ListItem>
                        <Divider />
                    </Paper>
                )} />
            </Paper>
        </Paper>
    );
}