function processChartData(input) {
    try {
        const analyticsResponse = input.pageData.response || {};
        const dataAnalytics = analyticsResponse.data?.result;
        const chartRecommendationResponseData = input.pageData?.chartRecommendationResponse;
        const chartRecommendation = chartRecommendationResponseData?.chartRecommendation;
        const chartType = chartRecommendation?.chart_type;

        let barChart = false;
        let pieChart = false;
        let lineChart = false;
        let areaChart = false;
        let dataSet = [];
        let xAxis, yAxis, column1, column2;

        // For generating random colors (used in line chart)
        function getRandomColor() {
            return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
        }

        let QnAs = input.pageData.QnAs;
        let QnA = QnAs[QnAs.length - 1];
     
        //This code is not currently used.This was used when the model was OpenAI and the account's credits expired. 
        if (chartRecommendationResponseData?.chartRecommendationError) {
            QnA.chartRecommendationErrorMessage =
                chartRecommendationResponseData.chartRecommendationError?.error_code === 'CREDITS_EXPIRED'
                    ? 'Credits have expired. Please reach out to the admin.'
                    : 'Something went wrong. Please try again.';
        }
        // OpenAI code was completed


        // BAR CHART
       if (chartType === 'Bar chart') {
            barChart = Object.keys(chartRecommendation.data_points).length > 0;
            xAxis = chartRecommendation.data_points['x-axis'];
            yAxis = chartRecommendation.data_points['y-axis'];

            const xAxisValues = dataAnalytics.data.map(record =>
                record[xAxis] === null ? 'NULL' : record[xAxis]
            );
            const yAxisValues = dataAnalytics.data.map(record =>
                record[yAxis] === null ? 'NULL' : record[yAxis]
            );

            // Helper to create a vertical gradient for chart bars
            function getVerticalGradient(ctx, chartArea, colorStart = "#1E90FF", colorEnd = "#4682B4", fallback = "#4B0082") {
                if (!chartArea) return fallback;
                const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, colorStart);
                gradient.addColorStop(1, colorEnd);
                return gradient;
            }

            dataSet = [
                {
                    label: yAxis,
                    data: yAxisValues,
                    backgroundColor: function (context) {
                        const { chart } = context;
                        const { ctx, chartArea } = chart;
                        return getVerticalGradient(ctx, chartArea);
                    },
                    borderRadius: 5,
                    barThickness: 30,
                },
            ];

            QnA.chartData = {
                xAxis,
                yAxis,
                xAxisValues,
                yAxisValues,
                dataSet,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            border: { color: "#D3D3D3", dash: [5, 5] },
                            grid: { color: "#D3D3D3", borderDash: [5, 5] },
                            ticks: {
                                callback(value) {
                                    const label = this.getLabelForValue(value);
                                    return String(label).length > 10 ? String(label).substring(0, 10) + "..." : label;
                                }
                            }
                        },
                        y: {
                            border: { color: "#D3D3D3", dash: [5, 5] },
                            grid: { color: "#D3D3D3", borderDash: [5, 5] },
                        },
                    },
                    plugins: {
                        legend: {
                            labels: {
                                usePointStyle: true,
                                pointStyle: 'rect',
                            },
                        },
                    },
                },
                pieChart,
                barChart,
                lineChart,
                areaChart,
            };

            console.log("processChartData: Bar chart data set:", dataSet);
        }

        // PIE CHART
        else if (chartType === 'Pie chart') {

    pieChart = Object.keys(chartRecommendation.data_points).length > 0;
    column1 = chartRecommendation.data_points.columns[0];
    column2 = chartRecommendation.data_points.columns[1];

    const column1Values = dataAnalytics.data.map(record => record[column1] || 'NULL');
    const column2Values = dataAnalytics.data.map(record => record[column2] || 'NULL');
    console.log("processChartData: Processing for Pie chart", column1Values, column2Values);

 
    const pieColors = [
        "#e6194b", // red
  "#3cb44b", // green
  "#ffe119", // yellow
  "#4363d8", // blue
  "#f58231", // orange
  "#911eb4", // purple
  "#46f0f0", // cyan
  "#f032e6", // magenta
  "#bcf60c", // lime
  "#fabebe", // pink
  "#008080", // teal
  "#e6beff", // lavender
  "#9a6324", // brown
  "#fffac8", // light yellow
  "#800000", // maroon
  "#aaffc3", // mint
  "#808000", // olive
  "#ffd8b1", // peach
  "#000075", // dark blue
  "#808080"  // gray
    ];

    
    // Generate unique labels and assign colors efficiently
    const labelColorMap = {};
    column1Values.forEach((label, i) => {
        if (!labelColorMap[label]) {
            labelColorMap[label] = pieColors[Object.keys(labelColorMap).length % pieColors.length];
        }
    });
    const backgroundColors = column1Values.map(label => labelColorMap[label]);

    // Build dataset based on data length and value types
    dataSet = (dataAnalytics.data.length === 1 &&
    !isNaN(column1Values[0]) &&
    !isNaN(column2Values[0]))
    ? [{
        label: [column1, column2],
        data: [column1Values[0], column2Values[0]],
        backgroundColor: pieColors
    }]
    : [{
        label: column1Values,
        data: column2Values,
        backgroundColor: backgroundColors
    }];

    QnA.chartData = {
        column1,
        column2,
        xAxisValues: column1Values,
        yAxisValues: column2Values,
        dataSet,
        pieChart,
        barChart,
        lineChart,
        areaChart
    };

    input.pageData.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
    };

    console.log("processChartData: Pie chart data set:", dataSet);
}


        // LINE CHART
        else if (chartType === 'Line chart') {
            lineChart = Object.keys(chartRecommendation.data_points).length > 0;
            let labels = [];
            const xAxis = chartRecommendation.data_points['x-axis'];
            const yAxis = chartRecommendation.data_points['y-axis'];
            const lineSeries = chartRecommendation.data_points['line-series'];

            // Group data by line-series
            const groupedData = dataAnalytics.data.reduce((acc, record) => {
                const key = record[lineSeries] ?? 'NULL';
                (acc[key] = acc[key] || []).push(record);
                return acc;
            }, {});

        let maxValues = [];
        let minValues = [];

    dataSet = Object.entries(groupedData).map(([line_label, records], index) => {
    return {
        label: lineSeries ? line_label : yAxis,
        data: records.map((record, i) => {
            const xAxisValue = record[xAxis] ?? 'NULL';
            let yAxisValue = record[yAxis] ?? 0;
            yAxisValue = Math.max(0, yAxisValue); // Clamp negative to zero

            if (index === 0) {
                labels.push(xAxisValue);
                maxValues.push(yAxisValue);
                minValues.push(yAxisValue);
            } else {
                const xAxisIndex = labels.indexOf(xAxisValue);
                if (xAxisIndex !== -1) {
                    maxValues[xAxisIndex] = Math.max(maxValues[xAxisIndex], yAxisValue);
                    minValues[xAxisIndex] = Math.min(minValues[xAxisIndex], yAxisValue);
                }
            }
            return yAxisValue;
        }),
        borderColor: getRandomColor()
    };
});

// Add Max/Min series if there is more than one line-series
if (Object.keys(groupedData).length > 1) {
    dataSet.push({
        label: 'Max Values',
        data: maxValues,
        borderColor: getRandomColor(),
        fill: false,
        showLine: true
    });
    dataSet.push({
        label: 'Min Values',
        data: minValues,
        borderColor: getRandomColor(),
        fill: false,
        showLine: true
    });
}
            

            QnA.chartData = {
                xAxis,
                yAxis,
                xAxisValues: labels,
                dataSet,
                pieChart,
                barChart,
                lineChart,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            grid: {
                                display: true,
                                drawBorder: false,
                                color: 'rgba(0,0,0,0.2)',
                                borderDash: [5, 5] // Dotted grid lines
                            },
                        },
                        y: {
                            beginAtZero: true, // Start from zero by default
                            grid: {
                                display: true,
                                drawBorder: false,
                                color: 'rgba(0,0,0,0.2)',
                                borderDash: [5, 5] // Dotted grid lines
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                usePointStyle: true,
                                pointStyle: 'rectRounded', // Changes legend to a dot
                                boxWidth: 6, // Reduces the size of the legend dot
                                boxHeight: 6
                            }
                        }
                    }
                }
            };
        }

        // Final updates to QnA

        QnA.chartLoading = false;
       // QnA.loading = false;
        const chartData = QnA.chartData || {};
        const hasAnyChart = chartData.barChart || chartData.pieChart || chartData.areaChart || chartData.lineChart;

        // Set feedback or actions based on chart and response type
        if (QnA.isAnalytics && !analyticsResponse.hasErrors && !chartRecommendationResponseData?.chartRecommendationError) {
            QnA.showActions = hasAnyChart;
            QnA.feedbackActions = !hasAnyChart;
        }

        // Set feedbackActions for specific types
        if (
            QnA.isSentinelFailedTransferResolution ||
            QnA.isoutlierHandler ||
            QnA.isfailureInsight
        ) {
            QnA.feedbackActions = true;
        }

        // Set alert for notification type (hasErrors---?)
        QnA.showAlert = QnA.isNotification && !chatQnA.hasErrors;

        window.loading = false;
        QnAs[QnAs.length - 1] = QnA;
  
    } catch (error) {
        console.log("Error :", error);
    }

    return true;
}
