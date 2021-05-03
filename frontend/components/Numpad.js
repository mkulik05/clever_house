import React from 'react';
import Paper from '@material-ui/core/Paper';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
	keyb: {
		display: 'flex',
		flexDirection: 'column'
	},
	root: {
		display: 'flex',
		justifyСontent: 'center',
		flexDirection: 'column'
	},
	btn: {
		margin: '5px',
		flex: 2,
		borderRadius: '50%'
	},
	line: {
		flex: 2,
		display: 'flex'
	},
	dot: {
		width: '20px',
		height: '20px',
		border: '1px solid black',
		margin: '2px',
		borderRadius: '50%'
	},
	dotParent: {
		display: 'flex',
		flex:1
	}
}));
export default function Numpad(props) {
	const classes = useStyles();
	let [ pwd, setPwd ] = useState('');
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
				width: props.width + dots_size,
				height: props.height + 100
			}}
		>
			<Paper
				elevation={0}
				style={{
					width: dots_size,
					height: 100
				}}
				className={classes.dotParent}
			>
				{dots.map((_, i) => {
					let color = i + 1 <= pwd.length ? 'black' : 'white';
					return <div className={classes.dot} id={`dot${i}`} style={{ backgroundColor: `${color}` }} />;
				})}
			</Paper>
			<Paper
				elevation={0}
				className={classes.keyb}
				style={{
					width: props.width,
					height: props.height
				}}
			>
				{[ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ], [ '', 0, '' ] ].map((num_arr) => (
					<div className={classes.line}>
						{num_arr.map((num) => {
							if (num === '') {
								return <div className={classes.btn} />;
							} else {
								return (
									<Button variant="outlined" className={classes.btn} onClick={() => clicked(num)}>
										{num}
									</Button>
								);
							}
						})}
					</div>
				))}
			</Paper>
		</Paper>
	);
}
