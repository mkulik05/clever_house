import React from 'react';
import Paper from '@material-ui/core/Paper';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
	keyb: {
		height: '100%',
		width: '100%',
		display: 'grid',
		gridTemplateAreas: ` 
		"b1 b2 b3"
		"b4 b5 b6"
		"b7 b8 b9"
		".  b0  ."
		`,
		gridTemplateRows: '1fr 1fr 1fr 1fr',
		gridTemplateColumns: '1fr 1fr 1fr',
		gridGap: '4vw',
	},
	root: {
	},
	b0: {
		gridArea: 'b0'
	},
	b1: {
		gridArea: 'b1'
	},
	b2: {
		gridArea: 'b2'
	},
	b3: {
		gridArea: 'b3'
	},
	b4: {
		gridArea: 'b4'
	},
	b5: {
		gridArea: 'b5'
	},
	b6: {
		gridArea: 'b6'
	},
	b7: {
		gridArea: 'b7'
	},
	b8: {
		gridArea: 'b8'
	},
	b9: {
		gridArea: 'b9'
	},
	dotParent: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	dots: {
		height: '20px',
		width: '20px',
		border: '1px solid black',
		borderRadius: '50%',
		margin: '10px',
		marginBottom: '40px',
		marginTop: '25px'
	}
}));
export default function Numpad(props) {
	const classes = useStyles();
	let [pwd, setPwd] = useState('');
	let clicked = (num) => {
		let currPwd = pwd + num.toString();
		setPwd(currPwd);
		if (currPwd.length >= props.pwd.length) {
			setTimeout(() => {
				setPwd('');
			}, 250);
			props.callback(currPwd === props.pwd);
		}
	};
	let dots = new Array(props.pwd.length);
	dots.fill(0, 0, props.pwd.length);
	let dots_size = props.pwd.length * 27;
	return (
		<Paper
			elevation={0}
			className={classes.root}
			style={{
				width: props.width,
				height: props.height
			}}
		>
			<Paper
				elevation={0}
				className={classes.dotParent}
			>
				{dots.map((_, i) => {
					let color = i + 1 <= pwd.length ? 'black' : 'white';
					return <div className={classes.dots} style={{ backgroundColor: `${color}` }} />;
				})}
			</Paper>
			<Paper
				elevation={0}
				className={classes.keyb}
			>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
					<Button variant="outlined" className={classes.btn} className={classes['b' + num]} onClick={() => clicked(num)}>
						{num}
					</Button>
				))}
			</Paper>
		</Paper>
	);
}
