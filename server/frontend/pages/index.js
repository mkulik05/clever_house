import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import Humidity from '../components/Humidity'
import Temperature from '../components/Temperature'
import Time from '../components/Time'
import Weather from '../components/Weather'
import Alarms from '../components/Alarms'
import Router from 'next/router';

const useStyles = makeStyles(() => ({
	root: {
		height: '100vh',
		width: '100vw',
		display: 'grid',
		gridTemplateRows: '1fr 1fr 1fr 1fr',
		gridTemplateColumns: '1fr 1fr 1fr',
		gridGap: '10px',
		gridTemplateAreas: `
		"temp hum time"
		"temp hum weather"
		"alarm alarm weather"
		"alarm alarm weather"
		`,
		backgroundColor: '#00042b'
	},

}));

export default function Main() {
	const classes = useStyles();
	return (
		<Paper className={classes.root}>
			<VideoLibraryIcon onClick={() => Router.push('/login')} style={{ position: 'absolute', fontSize: '30px' }} color='primary'/>
			<Temperature/>
			<Humidity/>
			<Time/>
			<Alarms/>
			<Weather/>
		</Paper>
	);
}
