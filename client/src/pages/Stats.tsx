import BottomNav from '../components/BottomNav';
import GridItem from '../components/GridItem';
import AreaChart from '../features/charts/AreaChart';
import BestPerformanceChart from '../features/charts/BestPerformanceChart';


function Stats() {
  return (
    <div>

      <h1>Stats Page</h1>
      <BottomNav />
      <div className='grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4 p-4'>
        <GridItem className='bg-grey p-4 rounded shadow'>
          <h2 className='text-lg font-bold mb-2'>Quiz Attempts</h2>
          <p>Total Quizzes Taken: 42</p>
          <AreaChart />
        </GridItem>
        <GridItem className='bg-grey p-4 rounded shadow'>
          <h2 className='text-lg font-bold mb-2'>Average Score</h2>
          <p>Average Score: 85%</p>
          <BestPerformanceChart />
        </GridItem>


      </div>
    </div>
  )
}

export default Stats
