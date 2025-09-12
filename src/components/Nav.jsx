import { NavLink } from "react-router-dom"
import govtLogo from '../assets/govt_logo.png'
import dairyLogo from '../assets/dairy_logo.png'
import logo from '../assets/logo.png'
import banner from '../assets/banner.png'

const Nav = () => {
  return (
    <div className="w-full flex flex-col gap-10 z-30">
      <div className='flex flex-col w-full border-2'>
        <div className='flex items-center justify-between  p-1 w-full'>
          <img src={govtLogo} alt="Govt Logo" className='h-12 lg:h-16' />
          <img src={dairyLogo} alt="Govt Logo" className='h-12 lg:h-16' />
        </div>
        <div className='flex items-center justify-between p-2'>
          <div className=' w-1/2 flex items-center justify-between'>
            <NavLink to="/" className='text-md lg:text-xl active:scale-95 hover:underline hover:scale-110'>Home</NavLink>
            <NavLink to="/contact" className='text-md lg:text-xl active:scale-95 hover:underline hover:scale-110'>Contact Us</NavLink>
          </div>
          <div className='w-1/2 flex items-center justify-end'>
            <NavLink to="/login" className='text-md border-1 rounded-4xl px-2 py-0 bg-cyan-500 p-1 active:scale-95 hover:underline hover:scale-110'>Login</NavLink>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-around bg-no-repeat bg-cover bg-center h-40" style={{ backgroundImage: `url(${banner})` }}>
        <img src={logo} alt="" className="w-17 lg:w-25"/>
        <h2 className="text-2xl text-white">Pashu Pehchan</h2>
      </div>
    </div>
  )
}

export default Nav