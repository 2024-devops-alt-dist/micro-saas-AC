import BottomNav from '../components/BottomNav';
import GridItem from '../components/GridItem';
import LineChart from '../features/charts/LineChart';
import BarChart from '../features/charts/BarChart';
import PieChartPerTheme from '../features/charts/PieChart';

import Title from '../components/Title';

function Stats() {
  return (
    <div>
      <Title text="MES STATS" />
      <BottomNav />
      <div className='grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4 p-4'>
        <GridItem className='bg-grey p-4 rounded shadow'>
          <LineChart />
        </GridItem>
        <GridItem className='bg-grey p-4 rounded shadow'>
          <BarChart />
        </GridItem>

        <GridItem className='bg-grey p-4 rounded shadow'>
          <PieChartPerTheme />
        </GridItem>
      </div>
    </div>
  )
}

export default Stats
