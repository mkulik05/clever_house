import React from 'react';
import styles from '../styles/Numpad.module.css'
import Paper from '@material-ui/core/Paper';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
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
				height: props.height
			}}
		>
						<Paper
				elevation={0}
				className={[styles.dotParent, props.shuffle ? styles.shuffle : ""].join(' ')}
			>
				{dots.map((_, i) => {
					let color = i + 1 <= pwd.length ? 'black' : 'white';
					return <div className={styles.dots} style={{ backgroundColor: `${color}` }} />;
				})}
			</Paper>

			<Paper
				elevation={0}
				className={styles.keyb}
			>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
					<Button variant="outlined" className={styles.btn} style={{gridArea: `b${num}`}} onClick={() => clicked(num)}>
						{num}
					</Button>
				))}
			</Paper>
		</Paper>
	);
}
