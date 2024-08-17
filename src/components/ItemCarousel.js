import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ImageCard from './ImageCard';

function ItemCarousel({ items, onDecrementClick, onIncrementClick, onDeleteClick }) {
	// Group items into sets of three
	const groupedItems = [];

	if (items.length < 4) {
		groupedItems.push(items);
	} else {
		for (let i = 0; i < items.length; i++) {
			const group = [
				items[i],
				items[(i + 1) % items.length],
				items[(i + 2) % items.length],
			];
			groupedItems.push(group);
		}
	}

	return (
		<Carousel
			indicators={false} // Hide the indicators
			animation="slide"  // Use slide animation
			navButtonsAlwaysVisible={false} // Keep the navigation buttons always visible
		>
			{groupedItems.map((group, index) => (
				<Grid
					container
					key={index}
					spacing={2}
					sx={{
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					{group.map((item, idx) => (
						<Grid item xs={12} md={4} key={idx}>
							<Box
								sx={{
									padding: 3,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									boxShadow: 2,
									borderRadius: 2,
									backgroundColor: '#F1F5F9'
								}}
							>
								{/* Header with itemName and quantity */}
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										width: '100%',
										paddingBottom: 2,
										borderBottom: '1px solid #ccc',
									}}
								>
									<Typography variant="h6" fontWeight="bold">
										{item.itemName}
									</Typography>
									<Typography variant="h6" fontWeight="bold">
										{item.quantity}
									</Typography>
								</Box>

								{/* Placeholder for Image */}
								<ImageCard imageUrl={item.imageUrl} />

								{/* Buttons for removing, adding, and deleting */}
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										width: '100%',
										marginTop: 2,
									}}
								>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											width: '100%', // Ensures the buttons take up the full width of their container
											marginTop: 2, // Adds some space above the buttons
										}}
									>
										<Button
											variant="contained"
											onClick={() => onDecrementClick(item)}
											sx={{
												flex: 1, // Each button takes up equal space
												backgroundColor: '#E74032', // Custom color
												color: '#fff',
												'&:hover': {
													backgroundColor: '#d63628', // Darker shade on hover
												},
												margin: '0 5px', // Add some space between buttons
												minWidth: '25px', // Maintain minimum width
												minHeight: '30px',
											}}
										>
											<RemoveIcon fontSize="large" />
										</Button>
										<Button
											variant="contained"
											onClick={() => onIncrementClick(item)}
											sx={{
												flex: 1, // Each button takes up equal space
												backgroundColor: '#00BF56', // Custom color
												color: '#fff',
												'&:hover': {
													backgroundColor: '#009B46', // Darker shade on hover
												},
												margin: '0 5px', // Add some space between buttons
												minWidth: '25px', // Maintain minimum width
												minHeight: '30px',
											}}
										>
											<AddIcon fontSize="large" />
										</Button>
										<Button
											variant="contained"
											onClick={() => onDeleteClick(item)}
											sx={{
												flex: 1, // Each button takes up equal space
												backgroundColor: '#7787A4', // Custom color
												color: '#fff',
												'&:hover': {
													backgroundColor: '#4F5A6D', // Darker shade on hover
												},
												margin: '0 5px', // Add some space between buttons
												minWidth: '25px', // Maintain minimum width
												minHeight: '30px',
											}}
										>
											<DeleteForeverIcon fontSize="large" />
										</Button>
									</Box>
								</Box>
							</Box>
						</Grid>
					))}
				</Grid>
			))}
		</Carousel>
	);
}

export default ItemCarousel;