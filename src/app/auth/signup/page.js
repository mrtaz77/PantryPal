'use client';

import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, firestore } from "@/config/firebase";
import { getDocs, collection, query, where, orderBy, limit, addDoc, doc } from "firebase/firestore";
import {
	createUserWithEmailAndPassword,
	updateProfile
} from "firebase/auth";
import { useState } from "react";

const Signup = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const router = useRouter();


	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === "username") setUsername(value);
		if (name === "email") setEmail(value);
		if (name === "password") setPassword(value);
	};

	const checkIfUserNameExists = async (userName) => {
		const usersRef = collection(firestore, "users");
		const q = query(usersRef, where("userName", "==", userName));
		const querySnapshot = await getDocs(q);
		if(!querySnapshot.empty) return true;
		return false;
	}
	const addNewUser = async (userName) => {
		const usersRef = collection(firestore, "users");
	
		// Get the max documentId
		const q = query(usersRef, orderBy("userId", "desc"), limit(1));
		const querySnapshot = await getDocs(q);
		
		let newUserId = 1;
		if (!querySnapshot.empty) {
			const doc = querySnapshot.docs[0];
			newUserId = doc.data().userId + 1;
		}

		// Add a new user
		await addDoc(usersRef, {
			userId: newUserId,
			userName: userName
		});
	}

	// Handle user sign up with email and password
	const handleSubmit = async (e) => {
		e.preventDefault();
		const userExists = await checkIfUserNameExists(username);

		if(userExists) {
			setError(true);
			setErrorMessage("Cannot use this username");
			return;
		}

		try {
			// create a new user with email and password
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			await updateProfile(userCredential.user, {
				displayName: username,
			});
			await addNewUser(username);
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
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								backgroundColor: '#F8D7DA', // Light red background
								color: '#D32F2F', // Dark red text
								padding: '24px',
								borderRadius: '8px',
								width: '100%',
								maxWidth: '350px',
								justifyContent: 'space-between', // Space between text and close button
								position: 'relative',
								textAlign: 'left',
							}}
						>
							<Typography variant="body2" sx={{ flex: 1 }}>
								{errorMessage}
							</Typography>
							<IconButton
								size="small"
								onClick={() => setError(false)} // Function to close the error message
								sx={{
									color: '#D32F2F',
									padding: 0,
									marginLeft: '10px',
								}}
							>
								<CloseIcon />
							</IconButton>
						</Box>
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
