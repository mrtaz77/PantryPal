import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { Box, Typography } from '@mui/material';

const chartSetting = {
	yAxis: [
		{
			label: 'Items',
		},
	],
	sx: {
		[`.${axisClasses.left} .${axisClasses.label}`]: {
			transform: 'translate(-5px, 0)',
		},
	},
};


export default function CustomBarChart({ items, xLabel, yLabel, title }) {
	const xAxisLabels = items.map(item => item[xLabel]);
	const yAxisData = items.map(item => item[yLabel]);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
			<Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
				{title}
			</Typography>
			<BarChart
				width={400}
				height={200}
				series={[
					{
						data: yAxisData,
					},
				]}
				xAxis={[{
					data: xAxisLabels, // Set x-axis labels here
					scaleType: 'band'
				}]}
				{...chartSetting}
			/>
		</Box>
	);
}
