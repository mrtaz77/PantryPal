'use client';

import React, { useState } from 'react';
import { Box, Typography, Grid, Button, Dialog, DialogContent, IconButton } from '@mui/material';
import Carousel from 'react-material-ui-carousel'; // Ensure this library is installed
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PreviewIcon from '@mui/icons-material/Preview';
import CloseIcon from '@mui/icons-material/Close';
import UploadIcon from '@mui/icons-material/Upload';

function ItemCarousel({ items, onDecrementClick, onIncrementClick, onDeleteClick, onImgUpload, onImgDelete }) {
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');

	// Handle image preview
	const handlePreview = (imageUrl) => {
		setPreviewImage(imageUrl);
		setPreviewOpen(true);
	};

	// Close the modal
	const handleClose = () => {
		setPreviewOpen(false);
	};


	// Group indices of items into sets of three
	const groupedIndices = [];

	if (items.length < 4) {
		groupedIndices.push(items.map((_, index) => index));
	} else {
		for (let i = 0; i < items.length; i++) {
			const group = [
				i,
				(i + 1) % items.length,
				(i + 2) % items.length,
			];
			groupedIndices.push(group);
		}
	}

	return (
		<Carousel
			indicators={false} // Hide the indicators
			animation="slide"  // Use slide animation
			navButtonsAlwaysVisible={false} // Keep the navigation buttons always visible
		>
			{groupedIndices.map((group, index) => (
				<Grid
					container
					key={index}
					spacing={2}
					sx={{
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					{group.map((itemIndex) => (
						<Grid item xs={12} md={4} key={itemIndex}>
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
										{items[itemIndex].itemName}
									</Typography>
									<Typography variant="h6" fontWeight="bold">
										{items[itemIndex].quantity}
									</Typography>
								</Box>

								{/* Placeholder for Image */}
								<Box
									sx={{
										width: '100%',
										height: 400,
										backgroundColor: '#e0e0e0',
										marginY: 2,
										borderRadius: 2,
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										cursor: items[itemIndex].imageUrl ? 'pointer' : 'default',
										position: 'relative', // Necessary for overlay
										overflow: 'hidden', // Ensures image fits within the box
									}}
									onClick={() => items[itemIndex].imageUrl && handlePreview(items[itemIndex].imageUrl)}
								>
									{items[itemIndex].imageUrl ? (
										<>
											{/* Image */}
											<img
												src={items[itemIndex].imageUrl}
												alt={items[itemIndex].itemName}
												style={{
													width: '100%',
													height: '100%',
													objectFit: 'contain', // Ensures entire image is shown
													borderRadius: '8px',
												}}
											/>
											{/* Hover effect */}
											<Box
												sx={{
													position: 'absolute',
													top: 0,
													left: 0,
													width: '100%',
													height: '100%',
													backgroundColor: 'rgba(0, 0, 0, 0.4)', // Shade overlay
													display: 'flex',
													justifyContent: 'center',
													alignItems: 'center',
													opacity: 0,
													transition: 'opacity 0.3s ease-in-out', // Smooth transition
													'&:hover': {
														opacity: 1, // Show overlay on hover
													},
												}}
												onClick={(e) => {
													e.stopPropagation(); // Prevents triggering parent onClick
													handlePreview(items[itemIndex].imageUrl); // Show full image
												}}
											>
												<PreviewIcon
													sx={{
														color: 'white',
														fontSize: 50,
													}}
												/>

												<DeleteForeverIcon
													sx={{
														color: 'white',
														fontSize: 50,
														marginLeft: 2, // Add some space between the icons
													}}
													onClick={async (e) => {
														e.stopPropagation();
														await onImgDelete(items[itemIndex].itemId);
													}}
												/>
											</Box>
										</>
									) : (
										<>
											{/* Upload Icon for Empty Image */}
											<Box
												sx={{
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'center',
													justifyContent: 'center',
													cursor: 'pointer',
													'&:hover': {
														opacity: 0.7,
													},
												}}
												onClick={() => document.getElementById(`file-input-${itemIndex}`).click()}
											>
												<UploadIcon sx={{ fontSize: 50, color: '#888' }} />
												<input
													type="file"
													accept=".png,.jpeg,.jpg"
													id={`file-input-${itemIndex}`}
													style={{ display: 'none' }}
													onChange={(e) => {
														const file = e.target.files[0];
														if (file) {
															const fileExtension = `.${file.name.split('.').pop()}`;
															onImgUpload(file, fileExtension, items[itemIndex].itemId);
														}
													}}
												/>
											</Box>
										</>
									)}
								</Box>

								{/* Modal for image preview */}
								<Dialog
									open={previewOpen}
									onClose={handleClose}
									maxWidth="md"
									fullWidth
								>
									<DialogContent sx={{ padding: 0 }}>
										<img
											src={previewImage}
											alt="Preview"
											style={{
												width: '100%',
												height: 'auto',
												objectFit: 'contain',
											}}
										/>
										<IconButton
											onClick={handleClose}
											sx={{
												position: 'absolute',
												top: 10,
												right: 10,
												color: 'white',
											}}
										>
											<CloseIcon />
										</IconButton>
									</DialogContent>
								</Dialog>

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
											onClick={() => onDecrementClick(items[itemIndex])}
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
											onClick={() => onIncrementClick(items[itemIndex])}
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
											onClick={() => onDeleteClick(items[itemIndex])}
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
