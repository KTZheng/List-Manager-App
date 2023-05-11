import { cardContentClasses } from '@mui/material';
import { ResponsivePie } from '@nivo/pie'

export default function PieChart({ completedTasks, clinicianList }) {

    let data = [];
    if (completedTasks && clinicianList) {
        data = formatPieChartData(completedTasks, clinicianList);
    }

    return (
        <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ scheme: 'nivo' }}
            borderWidth={1}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        0.2
                    ]
                ]
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor='#333333'
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        2
                    ]
                ]
            }}

        />
    )
}


function formatPieChartData(tasksCompleted, clinicianList) {




    const colors = ['hsl(124, 70%, 50%)', 'hsl(180, 70%, 50%)', 'hsl(46, 70%, 50%)', 'hsl(92, 70%, 50%)', 'hsl(153, 70%, 50%)', 'hsl(153, 70%, 50%)']

    // map takscompleted to data
    let tempData = [];
    clinicianList.forEach((clinician, i) => {
        let taskValue = 0;
        tasksCompleted.forEach((task) => {

            if (task.clinician._id === clinician._id) {
                taskValue += 1;
            }})

            tempData.push({
                'id': `Dr.${clinician.fname} ${clinician.lname}`,
                'label': `Dr.${clinician.fname} ${clinician.lname}`,
                'value': taskValue,
                'color': colors[i]
            })

        })
        

        return tempData;

    }

