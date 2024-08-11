'use client';

import { Box, Typography, TextField, Button } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { firestore } from "@/config/firebase";
import {
	signInWithEmailAndPassword,
	getAuth
} from "firebase/auth";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");


	// Instantiate the auth service SDK
	const auth = getAuth();

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === "email") setEmail(value);
		if (name === "password") setPassword(value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			// Sign in with email and password in firebase auth service
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);

			const user = userCredential.user;
			const router = useRouter();
			router.push('/dashboard');

		} catch (err) {
			// Handle Errors here.
			const errorMessage = err.message;
			const errorCode = err.code;

			setError(true);

			switch (errorCode) {
				case "auth/invalid-email":
					setErrorMessage("This email address is invalid.");
					break;
				case "auth/user-disabled":
					setErrorMessage(
						"This email address is disabled by the administrator."
					);
					break;
				case "auth/user-not-found":
					setErrorMessage("This email address is not registered.");
					break;
				case "auth/wrong-password":
					setErrorMessage("The password is invalid or the user does not have a password.")
					break;
				default:
					setErrorMessage(errorMessage);
					break;
			}
		}
	};

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				height: '100vh',
				backgroundColor: '#f5f5f5',
			}}
		>
			<Box
				sx={{
					width: '100%',
					maxWidth: '400px',
					padding: '24px',
					backgroundColor: 'white',
					borderRadius: '8px',
					boxShadow: 3,
				}}
			>
				<Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 4 }}>
					Login
				</Typography>
				<form onSubmit={handleSubmit}>
					<TextField
						label="Email"
						variant="outlined"
						fullWidth
						name="email"
						value={email}
						onChange={handleChange}
						sx={{ marginBottom: 2 }}
					/>
					<TextField
						label="Password"
						type="password"
						variant="outlined"
						fullWidth
						name="password"
						value={password}
						onChange={handleChange}
						sx={{ marginBottom: 2 }}
					/>
					<Button
						type="submit"
						variant="contained"
						fullWidth
						sx={{
							backgroundColor: '#00BF56',
							color: 'white',
							'&:hover': {
								backgroundColor: '#2D7CEE',
							},
							marginBottom: 2,
						}}
					>
						Login
					</Button>
					{error && (
						<Typography variant="body2" color="error" sx={{ marginTop: 2, textAlign: 'center' }}>
							{errorMessage}
						</Typography>
					)}
				</form>
				<Box sx={{ textAlign: 'center', marginTop: 2 }}>
					<Typography variant="body2">
						Need to create an account?{' '}
						<Link href="/auth/signup" sx={{ color: '#00BF56', '&:hover': { textDecoration: 'underline' } }}>
							Sign up
						</Link>
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}