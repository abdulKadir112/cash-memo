import React from 'react'
import { Link } from 'react-router-dom'

const MenuBar = () => {
  return (
    <div>
        <ul>
            <li><Link className='text-2xl font-bold px-5 py-6 bg-gray-300' to='/'>Manu</Link></li>
        </ul>
    </div>
  )
}

export default MenuBar