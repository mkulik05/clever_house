import React from 'react';
import Chart from '../components/Chart';
import Numpad from '../components/Numpad';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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
	temp_block: {
		gridArea: 'temp',
		backgroundColor: '#00042b',
		border: '1px solid #9c9c9c',
		textAlign: 'center',
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column'
	},
	hum_block: {
		gridArea: 'hum',
		backgroundColor: '#00042b',
		border: '1px solid #9c9c9c',
		textAlign: 'center',
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column'
	},
	alarms: {
		gridArea: 'alarm',
		backgroundColor: '#00042b',
		border: '1px solid #9c9c9c'
	},
	weather: {
		gridArea: 'weather',
		backgroundColor: '#00042b',
		border: '1px solid #9c9c9c'
	},
	header: {
		gridArea: 'header',
		backgroundColor: '#00095e'
	},
	time_block: {
		gridArea: 'time',
		backgroundColor: '#00042b',
		border: '1px solid #9c9c9c',
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column'
	},
	time: {
		textAlign: 'center',
		fontSize: '80pt',
		color: 'white'
	},
	temp: {
		textAlign: 'center',
		fontSize: '120pt',
		color: 'white'
	},
	hum: {
		textAlign: 'center',
		fontSize: '120pt',
		color: 'white'
	}
}));

export default function Main() {
	const classes = useStyles();
	return (
		<Paper className={classes.root}>
			<Paper className={classes.temp_block}>
				<Typography className={classes.temp}>26°C</Typography>
			</Paper>
			<Paper className={classes.hum_block}>
				<Typography className={classes.hum}>82%</Typography>
			</Paper>
			<Paper className={classes.time_block}>
				<Typography className={classes.time}>12:31</Typography>
			</Paper>
			<Paper className={classes.alarms}>D</Paper>
			<Paper className={classes.weather}>E</Paper>
		</Paper>
	);
}
