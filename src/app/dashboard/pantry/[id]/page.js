'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/services/AuthContext';
import {
	Typography,
	Box,
	Grid,
	Card,
	CardContent,
	IconButton,
	TextField,
	Modal,
	Stack,
	Button,
	InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from '@mui/icons-material/Edit';
import CustomPieChart from '@/components/CustomPieChart';
import CustomBarChart from '@/components/CustomBarChart';
import ItemCarousel from '@/components/ItemCarousel';
import { 
	doc,
	getDoc, 
	updateDoc, 
	serverTimestamp, 
	increment, 
	deleteDoc, 
	arrayRemove, 
	arrayUnion, 
	addDoc, 
	collection,
} from 'firebase/firestore';
import {
	ref,
	getDownloadURL,
} from 'firebase/storage';
import { firestore, storage } from '@/config/firebase';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

export default function PantryPage({ params }) {
	const { user, loading } = useAuth();
	const [pantry, setPantry] = useState(null);
	const [items, setItems] = useState([]);
	const [loadingData, setLoadingData] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [editedName, setEditedName] = useState('');
	const [newItemName, setNewItemName] = useState('');
	const [newItemQuantity, setNewItemQuantity] = useState(0);
	const [searchQuery, setSearchQuery] = useState("");
	const [open, setOpen] = useState(false);

	const fetchPantryData = async () => {
		if (!params.id) return;
	
		try {
			const pantryDocRef = doc(firestore, 'pantries', params.id);
			const pantryDoc = await getDoc(pantryDocRef);
	
			if (!pantryDoc.exists()) {
				console.log('No such pantry!');
				return;
			}
	
			const pantryData = pantryDoc.data();
			setPantry({
				...pantryData,
				createdOn: pantryData.createdOn?.toDate ? pantryData.createdOn.toDate() : new Date(pantryData.createdOn),
				lastUpdate: pantryData.lastUpdate?.toDate ? pantryData.lastUpdate.toDate() : new Date(pantryData.lastUpdate),
			});
			setEditedName(pantryData.pantryName);
	
			// Fetch the items
			const itemsRefs = pantryData.items || [];
			const itemsPromises = itemsRefs.map(async (itemRef) => {
				const itemDoc = await getDoc(itemRef);
				const itemData = itemDoc.data();
				const itemId = itemDoc.id;

				// Check if the image extension is valid
				let imageUrl = '';
				if (itemData.imageExt && ['.jpg', '.jpeg', '.png'].includes(itemData.imageExt.toLowerCase())) {
					const imageRef = ref(storage, `Img/${itemId}${itemData.imageExt}`);
					imageUrl = await getDownloadURL(imageRef);
				}
	
				return { ...itemData, itemId, imageUrl };
			});
	
			const itemsData = await Promise.all(itemsPromises);
			console.log("🚀 ~ fetchPantryData ~ itemsData:", itemsData)
			setItems(itemsData);
		} catch (error) {
			console.error('Error fetching pantry data:', error);
		} finally {
			setLoadingData(false);
		}
	};
	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleNameChange = (event) => {
		setEditedName(event.target.value);
	};

	const handleNameSave = async () => {
		if (!editedName.trim()) {
			alert("Pantry name cannot be empty");
			return;
		}
		try {
			const pantryDocRef = doc(firestore, 'pantries', params.id);
			await updateDoc(pantryDocRef, {
				pantryName: editedName,
				lastUpdate: serverTimestamp(),
			});
			setPantry(prevState => ({
				...prevState,
				pantryName: editedName,
				lastUpdate: new Date(), // Update to the latest date
			}));
			setIsEditing(false);
		} catch (error) {
			console.error('Error updating pantry name:', error);
		}
	};

	const handleIncrementClick = async (item) => {
		if (!item) {
			alert("Item cannot be empty");
			return;
		}

		try {
			const itemRef = doc(firestore, 'items', item.itemId);
			await updateDoc(itemRef, {
				quantity: increment(1),
			});
			const pantryRef = doc(firestore, 'pantries', params.id);
			await updateDoc(pantryRef, {
				totalQuantity: increment(1),
				lastUpdate: serverTimestamp(),
			});
			await fetchPantryData();
		} catch (error) {
			console.error('Error updating item quantity:', error);
			alert('Failed to update item quantity');
		}
	};

	const handleDecrementClick = async (item) => {
		if (!item) {
			alert("Item cannot be empty");
			return;
		}
		try {
			const itemRef = doc(firestore, 'items', item.itemId);
			const updatedQuantity = item.quantity - 1;
			if (updatedQuantity <= 0) {
				await deleteDoc(itemRef);
				const pantryRef = doc(firestore, 'pantries', params.id);
				await updateDoc(pantryRef, {
					items: arrayRemove(itemRef),
				});
			} else {
				await updateDoc(itemRef, {
					quantity: updatedQuantity,
				});
			}
			const pantryRef = doc(firestore, 'pantries', params.id);
			await updateDoc(pantryRef, {
				totalQuantity: increment(-1),
				lastUpdate: serverTimestamp(),
			});
			await fetchPantryData();
		} catch (error) {
			console.error('Error updating item quantity:', error);
			alert('Failed to update item quantity');
		}
	};

	const handleDeleteClick = async (item) => {
		if (!item) {
			alert("Item cannot be empty");
			return;
		}
		try {
			const itemRef = doc(firestore, 'items', item.itemId);
			await deleteDoc(itemRef);
			const pantryRef = doc(firestore, 'pantries', params.id);
			const deletedQuantity = -item.quantity;
			await updateDoc(pantryRef, {
				items: arrayRemove(itemRef),
				totalQuantity: increment(deletedQuantity),
				lastUpdate: serverTimestamp(),
			});
			await fetchPantryData();
		} catch (error) {
			console.error('Error deleting item quantity:', error);
			alert('Failed to delete item quantity');
		}
	};

	const addItem = async (itemName, quantity) => {
		if (!itemName.trim() || quantity <= 0) {
			alert('Invalid item');
			return;
		}
		const newItem = {
			itemName: itemName.trim(),
			quantity: quantity,
		};

		try {
			const itemRef = await addDoc(collection(firestore, 'items'), newItem);
			console.log("🚀 ~ addItem ~ itemRef:", itemRef);
			const pantryRef = doc(firestore, 'pantries', params.id);
			await updateDoc(pantryRef, {
				totalQuantity: increment(quantity),
				lastUpdate: serverTimestamp(),
				items: arrayUnion(itemRef)
			});
			await fetchPantryData();
		} catch (error) {
			console.error('Error adding item:', error);
			alert('Failed to add new item');
		}
	}

	const filteredItems = items.filter(item =>
		item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Open and close modal handlers
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	useEffect(() => {
		if (user) {
			fetchPantryData();
		}
	}, [user, params.id]);

	if (loading || loadingData) {
		return (
			<Box sx={{ padding: 4 }}>
				<Typography variant="h5">Loading...</Typography>
			</Box>
		);
	}

	if (!user) {
		return (
			<Box sx={{ padding: 4 }}>
				<Typography variant="h5">You are not logged in.</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ padding: 4 }}>
			<Grid container spacing={3}>
				{/* First section: Pantry stats */}
				<Grid item xs={12} md={4}>
					<Card sx={{ backgroundColor: "#F1F5F9", width: '450px', height: '400px' }}>
						<CardContent>
							{isEditing ? (
								<TextField
									variant="outlined"
									value={editedName}
									onChange={handleNameChange}
									onBlur={handleNameSave}
									autoFocus
								/>
							) : (
								<Box display="flex" alignItems="left">
									<Typography variant="h3" fontWeight="bold" marginBottom={7}>
										<u>{pantry.pantryName}</u>
										<IconButton onClick={handleEditClick}>
											<EditIcon sx={{ fontSize: 32 }} /> {/* Increase the icon size */}
										</IconButton>
									</Typography>
								</Box>
							)}
							<Typography variant="h5" fontWeight="bold" marginBottom={5}>Created On: {pantry.createdOn.toLocaleString()}</Typography>
							<Typography variant="h5" fontWeight="bold" marginBottom={5}>Last Update: {pantry.lastUpdate.toLocaleString()}</Typography>
							<Typography variant="h5" fontWeight="bold" marginBottom={5}>Total Quantity: {pantry.totalQuantity}</Typography>
							<Button
								variant="contained"
								onClick={handleOpen}
								sx={{
									ml: "auto",
									mt: 0, // Remove the top margin
								}}
							>
								+ New Item
							</Button>
						</CardContent>
					</Card>
				</Grid>

				{/* Second section: Pie chart */}
				<Grid item xs={12} md={4}>
					<Card sx={{ backgroundColor: "#F1F5F9", width: '450px', height: '400px' }}>
						<CardContent>
							<CustomPieChart
								items={items}
								totalItems={pantry.totalQuantity}
								xLabel="itemName"
								yLabel="quantity"
								title="Items"
							/>
						</CardContent>
					</Card>
				</Grid>

				{/* Third section: Bar chart */}
				<Grid item xs={12} md={4}>
					<Card sx={{ backgroundColor: "#F1F5F9", width: '450px', height: '400px' }}>
						<CardContent>
							<CustomBarChart
								items={items}
								xLabel="itemName"
								yLabel="quantity"
								title="Items Quantity"
								yAxisLabel="Quantity"
							/>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12}>
					<TextField
						label="Search"
						variant="outlined"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
							sx: {
								'& .MuiOutlinedInput-root': {
									borderRadius: '25px', // Capsule shape
									borderColor: '#2D7CEE', // Border color
									borderWidth: '1px', // Thin border
									'& fieldset': {
										borderColor: '#2D7CEE',
									},
									'&:hover fieldset': {
										borderColor: '#2D7CEE', // Hover color
									},
									'&.Mui-focused fieldset': {
										borderColor: '#2D7CEE', // Focus color
									},
								},
								'& .MuiInputAdornment-positionStart': {
									color: '#2D7CEE', // Icon color
								},
							},
						}}
						sx={{
							width: '100%',
							height: '50px',
							marginBottom: 2,
							borderRadius: '25px', // Capsule shape
							borderColor: '#2D7CEE', // Border color
							borderWidth: '1px', // Thin border
						}}
					/>
				</Grid>

				{/* Carousel */}
				<Grid item xs={12}>
					<Card sx={{ backgroundColor: "#F1F5F9" }}>
						<CardContent>
							<ItemCarousel
								items={filteredItems} // Pass filtered items here
								onIncrementClick={handleIncrementClick}
								onRemoveClick={handleDecrementClick}
								onDeleteClick={handleDeleteClick}
							/>
						</CardContent>
					</Card>
				</Grid>
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box sx={style}>
						<Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={3}>
							Add New Item
						</Typography>
						<Stack width="100%" direction={"row"} spacing={2}>
							<TextField
								id="outlined-item-name"
								label="Item Name"
								variant="outlined"
								fullWidth
								value={newItemName}
								onChange={(e) => setNewItemName(e.target.value)}
							/>
							<TextField
								id="outlined-item-quantity"
								label="Quantity"
								type="number"
								variant="outlined"
								fullWidth
								value={newItemQuantity}
								onChange={(e) => setNewItemQuantity(parseInt(e.target.value))}
							/>
							<Button
								variant="outlined"
								onClick={() => {
									addItem(newItemName, newItemQuantity);
									setNewItemName('');
									setNewItemQuantity(0);
									handleClose();
								}}
							>
								Add Item
							</Button>
						</Stack>
					</Box>
				</Modal>
			</Grid>
		</Box>
	);
}
