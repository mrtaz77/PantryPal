import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const FeatureCard = ({ title, description }) => {
	return (
		<Card
			sx={{
				backgroundColor: '#00BF56', // Original background color
				color: 'white', // Original text color
				'&:hover': {
					backgroundColor: '#000846', // Hover background color
				},
				transition: 'background-color 0.3s ease-in-out', // Smooth transition
				width: '300px', // Set card width
				margin: '40px', // Add some margin
				boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Add subtle shadow
				borderRadius: '8px', // Rounded corners
				alignItems: 'center',
				justifyContent: 'space-between', // Distribute space between text and circle
			}}
		>
			<CardContent sx={{ textAlign: 'center' }}>
				<Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '8px', alignItems: 'center' }}>
					{title}
				</Typography>
				<Typography variant="body1">
					{description}
				</Typography>
			</CardContent>
		</Card>
	);
};

export default FeatureCard;