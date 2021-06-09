import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(() => ({
	hum_block: {
		gridArea: 'hum',
		backgroundColor: '#00042b',
		border: '1px solid #9c9c9c',
		textAlign: 'center',
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column'
	},
	hum: {
		textAlign: 'center',
        fontSize: '12vw',
		color: 'white'
	},
}));


export default function Humidity() {
	const classes = useStyles();
	let [h, setH] = useState(50)
	useEffect(() => {

		setInterval(async () => {
			let res = await fetch('https://10.8.0.1:3001/data/hum')
			res = await res.json();
			setH(res.hum)
		}, 4000)
	}, [])
	return (
		<Paper className={classes.hum_block}>
			<Typography className={classes.hum}>{h}%</Typography>
		</Paper>
	);
}
