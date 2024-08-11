// app/page.js

"use client"; // Opt-in to client-side rendering

import React from "react";
import {
	Box,
	Typography,
	Button,
	Stack,
	Container,
	AppBar,
	Toolbar,
	CssBaseline,
	Divider
} from "@mui/material";
import Image from 'next/image'
import Link from 'next/link';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import styles from "./globals.css";
import logo from '../../public/logo.png';
import SwiperComponent from "@/components/Swiper";
import FeatureCard from "@/components/Card";

const theme = createTheme({
	typography: {
		fontFamily: "Arial, sans-serif",
	},
	palette: {
		primary: {
			main: "#00BF56", // Custom primary color
		},
		secondary: {
			main: "#00BF56", // Custom secondary color
		},
	},
});

const LandingPage = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AppBar position="static">
				<Toolbar>
				</Toolbar>
			</AppBar>
			<AppBar
				position="static"
				sx={{
					backgroundColor: 'white', // Set the toolbar background color to white
					boxShadow: 'none', // Remove box shadow if desired
					marginBottom: 4
				}}
			>
				<Toolbar sx={{ justifyContent: 'space-between' }}>
					<Box display="flex" alignItems="center">
						<Image
							src={logo} // Use the logo imported from public
							alt="Logo"
							width={210} // Set the desired width
							height={175} // Set the desired height
						/>
					</Box>
					<Box>
						<Link href="/auth/login">
							<Button
								variant="outlined"
								sx={{
									marginRight: 1,
									color: 'black', // Initial text color
									borderColor: 'black', // Initial border color
									transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
									fontSize: '16px', // Increase font size
									fontWeight: 'bold', // Use bold font
									'&:hover': {
										backgroundColor: '#00BF56', // Change background on hover
										color: 'white', // Change text color on hover
										borderColor: '#00BF56', // Change border color on hover
									},
								}}
							>
								Login
							</Button>
						</Link>

						{/* Signup Button */}
						<Link href="/auth/signup">
							<Button
								variant="outlined"
								sx={{
									color: 'black',
									borderColor: 'black',
									transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
									fontSize: '16px', // Increase font size
									fontWeight: 'bold', // Use bold font
									'&:hover': {
										backgroundColor: '#00BF56',
										color: 'white',
										borderColor: '#00BF56',
									},
								}}
							>
								Sign Up
							</Button>
						</Link>
					</Box>
				</Toolbar>
			</AppBar>
			<Container maxWidth="lg">
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between', // Distribute space between text and circle
						position: 'relative',
					}}
				>
					{/* Text Section */}
					<Box sx={{ flex: 1, paddingRight: 2 }}> {/* Flexbox for responsive layout */}
						<Typography
							variant="h1"
							sx={{
								fontSize: '80px', // Set font size
								fontFamily: 'Archivo Black, sans-serif', // Set font family
								fontWeight: 'bold', // Make the text bold
								color: '#000000', // Set text color
								marginBottom: 6, // Gutter bottom equivalent
								position: 'relative', // Position relative to allow absolute positioning of the line
								paddingBottom: '20px', // Additional space for the line
							}}
							gutterBottom
						>
							Welcome to PantryPal
							{/* Horizontal line */}
							<Box
								sx={{
									position: 'absolute',
									bottom: 0,
									left: 0,
									height: '20px', // Line thickness
									backgroundColor: '#00BF56', // Line color
									width: '100%', // Extend line to the end of the text
									zIndex: 1, // Ensure line is behind the text
								}}
							/>
						</Typography>

						<Typography
							variant="h6"
							sx={{
								fontSize: '30px', // Set font size
								fontFamily: 'Roboto, Helvetica, sans-serif', // Set font family
								color: '#9DA5BF', // Set text color
								marginBottom: 4, // Space between text and button
							}}
							gutterBottom
						>
							The best way to manage your pantry effortlessly.
						</Typography>
						<Link href="/auth/signup">
							<Button
								variant="outlined"
								sx={{
									color: 'black', // Initial text color
									borderColor: 'black', // Initial border color
									transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
									fontSize: '16px', // Increase font size
									fontWeight: 'bold', // Use bold font
									'&:hover': {
										backgroundColor: '#00BF56', // Change background on hover
										color: 'white', // Change text color on hover
										borderColor: '#00BF56', // Change border color on hover
									},
									marginBottom: 6,
								}}
							>
								Get Started
							</Button>
						</Link>
					</Box>

					{/* Circle containing SwiperComponent */}
					<Box
						sx={{
							borderRadius: '50%', // Make it a circle
							width: '300px', // Circle size
							height: '300px', // Circle size
							background: 'white', // Background color
							border: '20px solid #00BF56', // Outer border
							outline: '2px solid white', // Inner white border
							overflow: 'hidden', // Hide overflow of the images
							flexShrink: 0, // Prevent circle from shrinking
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<SwiperComponent />
					</Box>
				</Box>
				<Stack
					direction="row"
					spacing={4}
					className={styles.featureSection}
					justifyContent="space-between"
				>
					<Box
						sx={{
							display: 'flex', // Use flexbox
							justifyContent: 'center', // Center horizontally
							alignItems: 'center', // Center vertically
							flexWrap: 'wrap', // Allow wrapping for smaller screens
							marginTop: '40px', // Margin above the cards
						}}
					>
						<FeatureCard
							title="Easy Inventory"
							description="Track your items with ease using PantryPal's intuitive interface."
						/>
						<FeatureCard
							title="Recipe Organization"
							description="Organize recipes according to your pantry"
						/>
						<FeatureCard
							title="Recipe Suggestions"
							description="Get suggestions for recipes based on your current pantry"
						/>
					</Box>
				</Stack>
			</Container>
			<Box
				sx={{
					backgroundColor: 'black',
					color: 'white',
					padding: '20px',
					width: '100%',
				}}
			>
				{/* About Us Section */}
				<Box sx={{ textAlign: 'left', marginBottom: '20px' }}>
					<Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
						About Us
					</Typography>
					<Typography variant="body1" sx={{ fontSize: '1rem' }}>
						PantryPal is a web app for managing your pantry and organizing recipes.
					</Typography>
				</Box>

				{/* Divider */}
				<Divider sx={{ backgroundColor: 'white', marginY: '20px' }} />

				{/* Rights and Designer */}
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<Typography variant="body2" sx={{ fontSize: '1rem' }}>
						All rights reserved &copy; 2024
					</Typography>
					<Typography
						variant="body2"
						sx={{ fontSize: '1rem', color: '#00BF56' }}
					>
						Designed by{' '}
						<a
							href="https://github.com/mrtaz77"
							style={{ color: '#00BF56', textDecoration: 'none' }}
						>
							icarus77
						</a>
					</Typography>
				</Box>
			</Box>
		</ThemeProvider>
	);
};

export default LandingPage;
