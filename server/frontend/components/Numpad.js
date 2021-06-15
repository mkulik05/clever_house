import React from 'react';
import styles from '../styles/Numpad.module.css'
import Paper from '@material-ui/core/Paper';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export default function Numpad(props) {
	let [pwd, setPwd] = useState('');
	let clicked = (num) => {
		let currPwd = pwd + num.toString();
		setPwd(currPwd);
		if (currPwd.length >= props.pwdL) {
			setTimeout(() => {
				setPwd('');
			}, 250);
			props.callback(currPwd);
		}
	};
	let dots = new Array(props.pwdL);
	dots.fill(0, 0, props.pwdL);
	return (
		<Paper
			elevation={0}
			className={styles.root}
			style={{
				width: props.width,
				height: props.height,
				backgroundColor: props.backgroundColor
			}}
		>
			<Paper
				elevation={0}
				className={[styles.dotParent, props.shuffle ? styles.shuffle : ""].join(' ')}
				style={{ backgroundColor: props.backgroundColor }}
			>
				{dots.map((_, i) => {

					let color = i + 1 <= pwd.length ? 'white' : props.backgroundColor;
					return <div className={styles.dots} style={{ backgroundColor: `${color}`, border: `1px solid ${props.borderColor}` }} />;
				})}
			</Paper>
			<Paper
				elevation={0}
				className={styles.keyb}
				style={{
					backgroundColor: props.backgroundColor,
				}}
			>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
					<Button variant="" className={styles.btn} style={{ gridArea: `b${num}`, backgroundColor: props.backgroundColor, color: props.borderColor, border: `1px solid ${props.borderColor}` }} onClick={() => clicked(num)}>
						{num}
					</Button>
				))}
			</Paper>
		</Paper>
	);
}
