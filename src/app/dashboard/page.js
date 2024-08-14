'use client';

import { useAuth } from '@/services/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { firestore } from '@/config/firebase';
import { query, collection, where, getDocs, getDoc, doc, updateDoc, serverTimestamp, Timestamp, addDoc } from "firebase/firestore";
import {
	Typography,
	Box,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TableContainer,
	IconButton,
	TextField,
	Button,
	Modal,
	Stack,
	Grid,
	Card,
	CardContent,

} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DashboardCard from '@/components/DashBoardCard';
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
import styles from './DashboardCard.module.css';
import CustomPieChart from '@/components/CustomPieChart';
import CustomBarChart from '@/components/CustomBarChart';

export default function DashboardPage() {
	const { user, loading } = useAuth();
	const [pantries, setPantries] = useState([]);
	const [editingPantry, setEditingPantry] = useState(null);
	const [pantryName, setPantryName] = useState('');
	const [open, setOpen] = useState(false);

	const router = useRouter();

	const fetchPantries = async () => {
		const usersRef = collection(firestore, "users");
		const q = query(usersRef, where("userName", "==", user.displayName));
		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			const userDoc = querySnapshot.docs[0];
			const pantryRefs = userDoc.data().pantries || [];
			const pantriesData = await Promise.all(pantryRefs.map(async (pantryRef) => {
				const pantryDoc = await getDoc(pantryRef);
				if (pantryDoc.exists()) {
					return {
						id: pantryDoc.id,
						...pantryDoc.data()
					};
				}
				return null;
			}));

			setPantries(pantriesData.filter(pantry => pantry !== null));
		}
	};

	const handleEditClick = (id, currentName) => {
		setEditingPantry({ id, name: currentName });
	};

	const handleNameChange = (event) => {
		setEditingPantry((prev) => ({
			...prev,
			name: event.target.value,
		}));
	};

	const handleNameSave = async (id) => {
		const pantryRef = doc(firestore, "pantries", id);
		await updateDoc(pantryRef, {
			pantryName: editingPantry.name,
			lastUpdate: serverTimestamp(),
		});
		setEditingPantry(null);
		fetchPantries(); // Refresh the list to show the updated name
	};

	const addPantry = async (name) => {
		const newPantry = {
			pantryName: name,
			totalQuantity: 0,
			createdOn: Timestamp.now(),
			lastUpdate: Timestamp.now(),
			items: [],
		};

		const pantryRef = await addDoc(collection(firestore, 'pantries'), newPantry);
		setPantries([...pantries, { id: pantryRef.id, ...newPantry }]);

		// Update user's pantries array
		const usersRef = collection(firestore, "users");
		const q = query(usersRef, where("userName", "==", user.displayName));
		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			const userDoc = querySnapshot.docs[0];
			const userRef = userDoc.ref;
			await updateDoc(userRef, {
				pantries: [...userDoc.data().pantries, pantryRef]
			});
		}
	};

	// Open and close modal handlers
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	useEffect(() => {
		if (user) {
			fetchPantries();
		}
	}, [user]);

	if (!user) {
		return (
			<Box sx={{ padding: 4 }}>
				<Typography variant="h5">You are not logged in.</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ padding: 4, backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
			{/* Profile and Actions */}
			<Grid container spacing={2} sx={{ marginBottom: 4 }}>
				{/* First Card */}
				<Grid item xs={12} md={4}>
					<Card sx={{ backgroundColor: "#F1F5F9", width: '450px', height: '400px' }}>
						<CardContent>
							<Typography variant="h3" fontWeight="bold" marginBottom={7}>
								<u>Profile</u>
							</Typography>
							<Typography variant="h4" fontWeight="bold" marginBottom={20}>
								{user.displayName}
							</Typography>
							<Button
								variant="contained"
								onClick={handleOpen}
								sx={{
									ml: "auto",
									mt: 0, // Remove the top margin
								}}
							>
								+ New Pantry
							</Button>
						</CardContent>
					</Card>
				</Grid>

				{/* Second Card */}
				<Grid item xs={12} md={4}>
					<Card sx={{ backgroundColor: "#F1F5F9", width: '450px', height: '400px' }}>
						<CardContent>
							<CustomPieChart
								items={pantries}
								totalItems={pantries.length}
								xLabel="pantryName"
								yLabel="totalQuantity"
								title="Pantries"
							/>
						</CardContent>
					</Card>
				</Grid>

				{/* Third Card */}
				<Grid item xs={12} md={4}>
					<Card sx={{ backgroundColor: "#F1F5F9", width: '450px', height: '400px' }}>
						<CardContent>
							<CustomBarChart
								items={pantries}
								xLabel="pantryName"
								yLabel="totalQuantity"
								title="Chart"
							/>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{/* Modal for Adding New Pantry */}
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={3}>
						New Pantry
					</Typography>
					<Stack width="100%" direction={"row"} spacing={2}>
						<TextField
							id="outlined-basic"
							label="Pantry Name"
							variant="outlined"
							fullWidth
							value={pantryName}
							onChange={(e) => setPantryName(e.target.value)}
						/>
						<Button
							variant="outlined"
							onClick={() => {
								addPantry(pantryName);
								setPantryName("");
								handleClose();
							}}
						>
							Add
						</Button>
					</Stack>
				</Box>
			</Modal>

			{/* Pantries Table */}
			<DashboardCard title="Pantries#" sx={{ marginTop: 4, backgroundColor: "#F1F5F9" }}>
				<TableContainer className={styles.tableContainer}>
					<Table aria-label="pantry table">
						<TableHead>
							<TableRow>
								<TableCell className={styles.tableHeadCell}>
									<Typography color="textSecondary" variant="h5">
										Id
									</Typography>
								</TableCell>
								<TableCell className={styles.tableHeadCell}>
									<Typography color="textSecondary" variant="h5">
										Pantry Name
									</Typography>
								</TableCell>
								<TableCell className={styles.tableHeadCell}>
									<Typography color="textSecondary" variant="h5">
										Created On
									</Typography>
								</TableCell>
								<TableCell className={styles.tableHeadCell}>
									<Typography color="textSecondary" variant="h5">
										Last Update
									</Typography>
								</TableCell>
								<TableCell className={styles.tableHeadCell}>
									<Typography color="textSecondary" variant="h5">
										Total Quantity
									</Typography>
								</TableCell>
								<TableCell className={styles.tableHeadCell}>
									<Typography color="textSecondary" variant="h5">
										Items
									</Typography>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{pantries.map((pantry, index) => (
								<TableRow key={pantry.id}>
									<TableCell>
										<Typography className={styles.tableBodyCell}>
											{index + 1}
										</Typography>
									</TableCell>
									<TableCell>
										{editingPantry && editingPantry.id === pantry.id ? (
											<TextField
												value={editingPantry.name}
												onChange={handleNameChange}
												onBlur={() => handleNameSave(pantry.id)}
												autoFocus
											/>
										) : (
											<Box sx={{ display: "flex", alignItems: "center" }}>
												<Typography className={styles.tableBodyCell}>
													{pantry.pantryName}
												</Typography>
												<IconButton
													size="small"
													onClick={() =>
														handleEditClick(pantry.id, pantry.pantryName)
													}
												>
													<EditIcon fontSize="small" />
												</IconButton>
											</Box>
										)}
									</TableCell>
									<TableCell>
										<Typography className={styles.tableBodyCell}>
											{pantry.createdOn.toDate().toLocaleString()}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography className={styles.tableBodyCell}>
											{pantry.lastUpdate.toDate().toLocaleString()}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography className={styles.tableBodyCell}>
											{pantry.totalQuantity}
										</Typography>
									</TableCell>
									<TableCell>
										<Button
											type="submit"
											variant="contained"
											className={styles.button}
											onClick={() => router.push(`/dashboard/pantry/${pantry.id}`)}
										>
											View
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</DashboardCard>
		</Box>
	);
}
