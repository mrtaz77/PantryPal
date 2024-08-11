'use client';

import { Box, Typography, TextField, Button } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { firestore } from "@/config/firebase";
import {
	createUserWithEmailAndPassword,
	getAuth
} from "firebase/auth";
import { useState } from "react";

const Signup = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	// instantiate the auth service SDK
	const auth = getAuth();

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === "username") setUsername(value);
		if (name === "email") setEmail(value);
		if (name === "password") setPassword(value);
	};

	// Handle user sign up with email and password
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			// create a new user with email and password
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			// Pull out user's data from the userCredential property
			const user = userCredential.user;
			const router = useRouter();
			router.push('/dashboard');
		} catch (err) {
			// Handle errors here
			const errorMessage = err.message;
			const errorCode = err.code;

			setError(true);

			switch (errorCode) {
				case "auth/weak-password":
					setErrorMessage("The password is too weak.");
					break;
				case "auth/email-already-in-use":
					setErrorMessage(
						"This email address is already in use by another account."
					);
				case "auth/invalid-email":
					setErrorMessage("This email address is invalid.");
					break;
				case "auth/operation-not-allowed":
					setErrorMessage("Email/password accounts are not enabled.");
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
				<Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 4, textAlign: 'center' }}>
					Sign Up
				</Typography>
				<form onSubmit={handleSubmit}>
					<TextField
						label="Username"
						variant="outlined"
						fullWidth
						name="username"
						value={username}
						onChange={handleChange}
						sx={{ marginBottom: 2 }}
					/>
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
						Sign Up
					</Button>
					{error && (
						<Typography variant="body2" color="error" sx={{ marginTop: 2, textAlign: 'center' }}>
							{errorMessage}
						</Typography>
					)}
				</form>
				<Box sx={{ textAlign: 'center', marginTop: 2 }}>
					<Typography variant="body2">
						Already have an account?{' '}
						<Link href="/auth/login" sx={{ color: '#00BF56', '&:hover': { textDecoration: 'underline' } }}>
							Sign In
						</Link>
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default Signup;
