"use client";

import React, { useState } from 'react';
import { Image } from 'antd';
import { Box } from '@mui/material';

const ImageCard = ({ imageUrl }) => {
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState(imageUrl);

	const handlePreview = () => {
		setPreviewOpen(true);
	};

	return (
		<>
			<Box
				onClick={handlePreview}
				sx={{
					cursor: 'pointer',
					borderRadius: 2,
					overflow: 'hidden',
					boxShadow: 3,
					'&:hover': {
						boxShadow: 6,
					},
				}}
			>
				<img
					src={imageUrl}
					alt="Item"
					style={{
						width: '100%',
						height: '250px',
						objectFit: 'cover',
						borderRadius: '4px',
					}}
				/>
			</Box>
			{previewImage && (
				<Image
					wrapperStyle={{ display: 'none' }}
					preview={{
						visible: previewOpen,
						onVisibleChange: (visible) => setPreviewOpen(visible),
						afterOpenChange: (visible) => !visible && setPreviewImage(''),
					}}
					src={previewImage}
				/>
			)}
		</>
	);
};

export default ImageCard;