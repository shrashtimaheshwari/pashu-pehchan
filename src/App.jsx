
import Nav from './components/Nav'
import MainRoutes from './routes/mainRoutes'
import background from './assets/background.jpg'

const App = () => {
  return (
    <div 
      className="relative text-black w-full min-h-dvh p-0.5 bg-no-repeat bg-cover bg-center" 
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-white/30 z-0"></div>

      {/* Content above overlay */}
      <div className="relative z-10">
        <Nav />
        <MainRoutes />
      </div>
    </div>
  )
}

export default App
