'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import {
	collection,
	doc,
	getDocs,
	query,
	setDoc,
	deleteDoc,
	getDoc,
} from 'firebase/firestore'

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'white',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
	display: 'flex',
	flexDirection: 'column',
	gap: 3,
}

export default function Home() {
	const [pantry, setPantry] = useState([])
	const [open, setOpen] = useState(false)
	const [itemName, setItemName] = useState('')

	const updatePantry = async () => {
		const snapshot = query(collection(firestore, 'pantry'))
		const docs = await getDocs(snapshot)
		const pantryList = []
		docs.forEach((doc) => {
			pantryList.push({ name: doc.id, ...doc.data() })
		})
		setInventory(pantryList)
	}

	const addItem = async (item) => {
		const docRef = doc(collection(firestore, 'pantry'), item)
		const docSnap = await getDoc(docRef)
		if (docSnap.exists()) {
			const { quantity } = docSnap.data()
			await setDoc(docRef, { quantity: quantity + 1 })
		} else {
			await setDoc(docRef, { quantity: 1 })
		}
		await updatePantry()
	}

	const removeItem = async (item) => {
		const docRef = doc(collection(firestore, 'pantry'), item)
		const docSnap = await getDoc(docRef)
		if (docSnap.exists()) {
			const { quantity } = docSnap.data()
			if (quantity === 1) {
				await deleteDoc(docRef)
			} else {
				await setDoc(docRef, { quantity: quantity - 1 })
			}
		}
		await updatePantry()
	}

	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	useEffect(() => {
		updatePantry()
	}, [])

	return (
		<Box>
			<Typography variant="h1">Inventory Management</Typography>
		</Box>
	)
}