import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography } from '@mui/material';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

const StyledText = styled('text')(({ theme }) => ({
	fill: theme.palette.text.primary,
	textAnchor: 'middle',
	dominantBaseline: 'central',
	fontSize: 20,
}));

function PieCenterLabel({ children }) {
	const { width, height, left, top } = useDrawingArea();
	return (
		<StyledText x={left + width / 2} y={top + height / 2}>
			{children}
		</StyledText>
	);
}

const CustomPieChart = ({ items, totalItems, xLabel, yLabel, title }) => {
	// Prepare the data for the pie chart
	const chartData = items.map(item => ({
		id: item[xLabel],
		value: item[yLabel],
		label: item[xLabel]
	}));

	// Calculate total value for percentage calculations
	const totalValue = items.reduce((sum, item) => sum + item[yLabel], 0);

	// Prepare data with percentages
	const getArcLabel = (params) => {
		const percent = params.value / totalValue;
		return `${(percent * 100).toFixed(0)}%`;
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', width: '100%' }}>
			{/* Display the title */}
			<Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
				{title}
			</Typography>
			<Box sx={{ position: 'relative', mb: 2 }}>
				<PieChart
					series={[
						{
							data: chartData,
							innerRadius: 70,
							outerRadius: 120,
							highlightScope: { faded: 'global', highlighted: 'item' },
							faded: { innerRadius: 50, additionalRadius: -30, color: 'gray' },
							arcLabel: getArcLabel,
						},
					]}
					width={400}
					height={300}
				>
					<PieCenterLabel>{title}# {totalItems}</PieCenterLabel>
				</PieChart>
			</Box>
		</Box>
	);
};

export default CustomPieChart;
