import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

export default function Chart(props) {
	const theme = useTheme();
	return (
		<Card>
			<Typography>{props.title}</Typography>
			<LineChart
				height={props.height}
				width={props.width}
				data={props.data}
				margin={{ top: 5, right: 30, bottom: 5, left: 30 }}
			>
				<Line type="monotone" dataKey={props.dataKey} stroke="#8884d8" dot={false} />
				<CartesianGrid stroke="#ccc" />
				<XAxis
					interval={props.interval}
					dataKey="time"
					stroke={theme.palette.text.secondary}
				/>
				<YAxis
					domain={props.y_range}
				/>
			</LineChart>
		</Card>
	);
}
