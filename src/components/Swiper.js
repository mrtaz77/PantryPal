import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Box } from '@mui/material';

const SwiperComponent = () => {
	return (
		<Box sx={{ width: '100%', position: 'relative' }}>
			<Swiper
				modules={[Navigation, Pagination, Autoplay]}
				navigation={{
					prevEl: '.swiper-button-prev',
					nextEl: '.swiper-button-next',
				}}
				pagination={{ clickable: true }}
				autoplay={{ delay: 3000, disableOnInteraction: false }}
				loop={true}
				style={{
					'--swiper-navigation-color': '#000',
					'--swiper-pagination-color': '#00BF56',
				}}
			>
				<SwiperSlide>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '400px',
						}}
					>
						<img
							src="/pantry1.png"
							alt="Pantry Image 1"
							style={{ maxHeight: '100%', maxWidth: '100%' }}
						/>
					</Box>
				</SwiperSlide>
				<SwiperSlide>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '400px',
						}}
					>
						<img
							src="/pantry2.jpg"
							alt="Pantry Image 2"
							style={{ maxHeight: '100%', maxWidth: '100%' }}
						/>
					</Box>
				</SwiperSlide>
				<SwiperSlide>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '400px',
						}}
					>
						<img
							src="/pantry3.jpg"
							alt="Pantry Image 3"
							style={{ maxHeight: '100%', maxWidth: '100%' }}
						/>
					</Box>
				</SwiperSlide>
			</Swiper>
		</Box>
	);
};

export default SwiperComponent;
