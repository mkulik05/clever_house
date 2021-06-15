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

import ReactPlayer from 'react-player'

const useStyles = makeStyles(() => ({
    root: {
        height: "100vh",
        width: "100vw",
        backgroundColor: '#00042b',
    },
    player_list: {
        height: "100vh",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00042b',
    }
}));

export default function Video() {
    let [vidList, setVidList] = useState([[], []])
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
                <ReactPlayer height={400} controls autoplay onError={(e) => console.log(e)} url={`/videos/${video}`} type='video/mp4'>
                </ReactPlayer>
                <Virtuoso style={{ height: '100%', marginLeft: 'auto', marginRight: 0, width: '300px' }} totalCount={vidList[0].length} itemContent={index => (
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