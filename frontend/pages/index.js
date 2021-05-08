import React from 'react';
import Chart from '../components/Chart';
import Numpad from '../components/Numpad';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Humidity from '../components/Humidity'
import Temperature from '../components/Temperature'
import Time from '../components/Time'
import Weather from '../components/Weather'
import Alarms from '../components/Alarms'

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
			<Temperature />
			<Humidity/>
			<Time/>
			<Alarms/>
			<Weather/>
		</Paper>
		//<Numpad pwd="1231231" width={300} height={400} callback={(res) => {console.log(res)}}/>
	);
}
