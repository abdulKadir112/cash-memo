import React from 'react'
import { Outlet } from 'react-router-dom'
// import NavbarLeft from './layer/NavbarLeft'
// import NavbarRight from './layer/NavvarRight'

const RootLayOut = () => {
  return (
    <div className="bg-[#bebebebe]">
      {/* <NavbarLeft/> */}
        <Outlet/>
      {/* <NavbarRight/> */}
    </div>
  )
}

export default RootLayOut