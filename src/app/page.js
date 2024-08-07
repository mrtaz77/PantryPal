"use client";

import { useState, useEffect } from "react";
import {
	Box,
	Stack,
	Typography,
	Button,
	Modal,
	TextField,
	InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { firestore } from "@/config/firebase";
import {
	collection,
	doc,
	getDocs,
	query,
	setDoc,
	deleteDoc,
	getDoc,
} from "firebase/firestore";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "white",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
	display: "flex",
	flexDirection: "column",
	gap: 3,
};

export default function Home() {
	const [pantry, setPantry] = useState([]);
	const [open, setOpen] = useState(false);
	const [itemName, setItemName] = useState('');
	const [searchQuery, setSearchQuery] = useState("");


	// Function to fetch pantry items from Firestore
	const updatePantry = async () => {
		try {
			const snapshot = query(collection(firestore, "pantry"));
			const docs = await getDocs(snapshot);
			const pantryList = [];
			docs.forEach((doc) => {
				pantryList.push({ name: doc.id, ...doc.data() });
			});
			setPantry(pantryList);
		} catch (error) {
			console.error("Error fetching pantry data:", error);
		}
	};

	// Function to add a new item to the pantry
	const addItem = async (item) => {
		if (!item) {
			alert("Item name cannot be empty");
			return;
		}

		try {
			const docRef = doc(collection(firestore, "pantry"), item.toLowerCase());
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const { quantity } = docSnap.data();
				await setDoc(docRef, { quantity: quantity + 1 });
			} else {
				await setDoc(docRef, { quantity: 1 });
			}
			await updatePantry();
		} catch (error) {
			console.error("Error adding item:", error);
		}
	};

	// Function to remove an item from the pantry
	const removeItem = async (item) => {
		try {
			const docRef = doc(collection(firestore, "pantry"), item.toLowerCase());
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const { quantity } = docSnap.data();
				if (quantity === 1) {
					await deleteDoc(docRef);
				} else {
					await setDoc(docRef, { quantity: quantity - 1 });
				}
			} else {
				console.warn("Item does not exist in the pantry");
			}
			await updatePantry();
		} catch (error) {
			console.error("Error removing item:", error);
		}
	};

	// Function to delete an item from the pantry
	const deleteItem = async (item) => {
		try {
			const docRef = doc(collection(firestore, "pantry"), item.toLowerCase());
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				await deleteDoc(docRef);
			} else {
				console.warn("Item does not exist in the pantry");
			}
			await updatePantry();
		} catch (error) {
			console.error("Error removing item:", error);
		}
	};


	// Calculate total number of items
	const totalItems = pantry.reduce((total, item) => total + item.quantity, 0);

	// Filtered pantry items based on search query
	const filteredPantry = pantry.filter(({ name }) =>
		name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Open and close modal handlers
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	// Fetch pantry items on component mount
	useEffect(() => {
		updatePantry();
	}, []);

	return (
		<Box
			width="100vw"
			height="100vh"
			display={"flex"}
			justifyContent={"center"}
			flexDirection={"column"}
			alignItems={"center"}
			gap={2}
		>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Add Item
					</Typography>
					<Stack width="100%" direction={"row"} spacing={2}>
						<TextField
							id="outlined-basic"
							label="Item"
							variant="outlined"
							fullWidth
							value={itemName}
							onChange={(e) => {
								console.log("Input value:", e.target.value); // Debugging log
								setItemName(e.target.value);
							}}
						/>
						<Button
							variant="outlined"
							onClick={() => {
								addItem(itemName);
								setItemName('');
								handleClose();
							}}
						>
							Add
						</Button>
					</Stack>
				</Box>
			</Modal>
			<Button variant="contained" onClick={handleOpen}>
				Add New Item
			</Button>
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
					// Add styles for the input and adornment
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
					width: '800px',
					height: '50px',
					marginBottom: 2,
					// Outer container styling
					borderRadius: '25px', // Capsule shape
					borderColor: '#2D7CEE', // Border color
					borderWidth: '1px', // Thin border
				}}
			/>
			<Box border={"1px solid #333"}>
				<Box
					width="800px"
					height="100px"
					bgcolor={"#ADD8E6"}
					display={"flex"}
					justifyContent={"center"}
					alignItems={"center"}
				>
					<Typography variant={"h2"} color={"#333"} textAlign={"center"}>
						Pantry Items
					</Typography>
				</Box>
				<Stack width="800px" height="300px" spacing={2} overflow={"auto"}>
					{filteredPantry.map(({ name, quantity }) => (
						<Box
							key={name}
							width="100%"
							minHeight="150px"
							display={"flex"}
							justifyContent={"space-between"}
							alignItems={"center"}
							bgcolor={"#f0f0f0"}
							paddingX={5}
						>
							<Typography variant={"h3"} color={"#333"} textAlign={"center"}>
								{name.charAt(0).toUpperCase() + name.slice(1)}
							</Typography>
							<Typography variant={"h3"} color={"#333"} textAlign={"center"}>
								Quantity: {quantity}
							</Typography>
							<Box
								display="flex"
								alignItems="center"
								justifyContent="center"
								gap={1} // Adjust gap between buttons
							>
								<Button
									variant="contained"
									onClick={() => addItem(name)}
									sx={{
										minWidth: '25px', // Decreased width
										minHeight: '30px',
										backgroundColor: '#00BF56', // Custom color
										color: '#fff',
										'&:hover': {
											backgroundColor: '#009B46', // Darker shade on hover
										},
									}}
								>
									<AddIcon />
								</Button>
								<Button
									variant="contained"
									onClick={() => removeItem(name)}
									sx={{
										minWidth: '25px', // Decreased width
										minHeight: '30px',
										backgroundColor: '#E74032', // Custom color
										color: '#fff',
										'&:hover': {
											backgroundColor: '#d63628', // Darker shade on hover
										},
									}}
								>
									<RemoveIcon />
								</Button>
							</Box>
						</Box>
					))}
				</Stack>
				<Box
					width="100%"
					minHeight="50px"
					display={"flex"}
					justifyContent={"center"}
					alignItems={"center"}
					bgcolor={"#e0e0e0"}
					paddingX={5}
				>
					<Typography variant={"h4"} color={"#333"} textAlign={"center"}>
						Total Items: {totalItems}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}
