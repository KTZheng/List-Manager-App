import { ResponsiveBar } from '@nivo/bar';
import styles from './TeamPerformance.module.css';




export default function TeamPerformanceBarChart({ completedTasks }) {




    let data = [];
    if (completedTasks) {
        data = formatBarChartData(completedTasks);

    }

    



    return (
        <div className={styles.bar_chart} >

            <ResponsiveBar
                data={data}
                keys={[
                    'Blood Test',
                    'Radiology',
                    'Reviews',
                    'Discharge',
                    'Other'
                ]}
                indexBy='date'
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'paired' }}

                borderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            1.6
                        ]
                    ]
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '7 Days',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Tasks',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                enableGridY={false}
                labelSkipWidth={18}
                labelSkipHeight={12}
                labelTextColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'brighter',
                            1.6
                        ]
                    ]
                }}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
                animate={false}
                role='application'
                ariaLabel='Nivo bar chart demo'
                barAriaLabel={function (e) { return e.id + ': ' + e.formattedValue + ' in country: ' + e.indexValue }}
            />
        </div>
    )
}

// formatBarChartData

function formatBarChartData(tasksCompleted) {

    const today = new Date().toLocaleDateString();
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString();
    const twoDaysAgo = new Date(new Date().setDate(new Date().getDate() - 2)).toLocaleDateString();
    const threeDaysAgo = new Date(new Date().setDate(new Date().getDate() - 3)).toLocaleDateString();
    const fourDaysAgo = new Date(new Date().setDate(new Date().getDate() - 4)).toLocaleDateString();
    const fiveDaysAgo = new Date(new Date().setDate(new Date().getDate() - 5)).toLocaleDateString();
    const sixDaysAgo = new Date(new Date().setDate(new Date().getDate() - 6)).toLocaleDateString();

    const lightBlue = 'hsl(128, 70%, 50%)';
    const darkBlue = 'hsl(163, 70%, 50%)';
    const lightGreen = 'hsl(211, 70%, 50%)';
    const darkGreen = 'hsl(144, 70%, 50%)';
    const pink = 'hsl(191, 70%, 50%)';



    let data = [
        {
            'date': `${sixDaysAgo}`,
            'Blood Test': 0,
            'bloodTestColor': `${lightBlue}`,
            'Radiology': 0,
            'radiologyColor': `${darkBlue}`,
            'Reviews': 0,
            'reviewsColor': `${lightGreen}`,
            'Discharge': 0,
            'dischargeColor': `${darkGreen}`,
            'Other': 0,
            'otherColor': `${pink}`
        },
        {
            'date': `${fiveDaysAgo}`,
            'Blood Test': 0,
            'bloodTestColor': `${lightBlue}`,
            'Radiology': 0,
            'radiologyColor': `${darkBlue}`,
            'Reviews': 0,
            'reviewsColor': `${lightGreen}`,
            'Discharge': 0,
            'dischargeColor': `${darkGreen}`,
            'Other': 0,
            'otherColor': `${pink}`
        },
        {
            'date': `${fourDaysAgo}`,
            'Blood Test': 0,
            'bloodTestColor': `${lightBlue}`,
            'Radiology': 0,
            'radiologyColor': `${darkBlue}`,
            'Reviews': 0,
            'reviewsColor': `${lightGreen}`,
            'Discharge': 0,
            'dischargeColor': `${darkGreen}`,
            'Other': 0,
            'otherColor': `${pink}`
        },
        {
            'date': `${threeDaysAgo}`,
            'Blood Test': 0,
            'bloodTestColor': `${lightBlue}`,
            'Radiology': 0,
            'radiologyColor': `${darkBlue}`,
            'Reviews': 0,
            'reviewsColor': `${lightGreen}`,
            'Discharge': 0,
            'dischargeColor': `${darkGreen}`,
            'Other': 0,
            'otherColor': `${pink}`
        },
        {
            'date': `${twoDaysAgo}`,
            'Blood Test': 0,
            'bloodTestColor': `${lightBlue}`,
            'Radiology': 0,
            'radiologyColor': `${darkBlue}`,
            'Reviews': 0,
            'reviewsColor': `${lightGreen}`,
            'Discharge': 0,
            'dischargeColor': `${darkGreen}`,
            'Other': 0,
            'otherColor': `${pink}`
        },
        {
            'date': `${yesterday}`,
            'Blood Test': 0,
            'bloodTestColor': `${lightBlue}`,
            'Radiology': 0,
            'radiologyColor': `${darkBlue}`,
            'Reviews': 0,
            'reviewsColor': `${lightGreen}`,
            'Discharge': 0,
            'dischargeColor': `${darkGreen}`,
            'Other': 0,
            'otherColor': `${pink}`
        },
        {
            'date': `${today}`,
            'Blood Test': 0,
            'bloodTestColor': `${lightBlue}`,
            'Radiology': 0,
            'radiologyColor': `${darkBlue}`,
            'Reviews': 0,
            'reviewsColor': `${lightGreen}`,
            'Discharge': 0,
            'dischargeColor': `${darkGreen}`,
            'Other': 0,
            'otherColor': `${pink}`
        }
    ]

    function checkDatesMatch(date1, date2) {
        return date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth() && date1.getFullYear() == date2.getFullYear();
    }

    const types = ['Blood Test', 'Radiology', 'Reviews', 'Discharge', 'Other'];

    tasksCompleted.map(task => {
        if (!task) return;

        for (let i = 0; i <= 6; i++) {
            if (checkDatesMatch(new Date(task.finished_at), new Date(new Date().setDate(new Date().getDate() - i)))) {

                if (types.includes(task.type)) {
                    data[6 - i][task.type]++;
                }
            }
        }
        return;
    });

    return data;

}