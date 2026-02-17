import BottomNav from '../components/BottomNav';
import LineChart from '../features/charts/LineChart';
import BarChart from '../features/charts/BarChart';
import PieChartPerTheme from '../features/charts/PieChart';
import Title from '../components/Title';


function Stats() {
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-24">
      <Title text="MES STATS" />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          <div className="bg-gray-800/20 p-1 sm:p-4 rounded-3xl border border-gray-700/30 shadow-2xl backdrop-blur-sm">
            <LineChart />
          </div>

          <div className="bg-gray-800/20 p-1 sm:p-4 rounded-3xl border border-gray-700/30 shadow-2xl backdrop-blur-sm">
            <BarChart />
          </div>

          <div className="lg:col-span-2 xl:col-span-1 bg-gray-800/20 p-1 sm:p-4 rounded-3xl border border-gray-700/30 shadow-2xl backdrop-blur-sm">
            <PieChartPerTheme />
          </div>
        </div>
      </div>

      <BottomNav />
    </div>

  )
}

export default Stats
