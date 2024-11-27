import React from 'react'

const Header = () => {
    return (
        <div className='pb-9'>
            <div className='flex justify-between pt-2.5 px-3'>
                <p className='text-center text-sm font-normal text-blue-600 tracking-widest'>Your needs</p>
                <p className='text-center text-sm font-normal text-blue-600 tracking-widest'>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
                <p className='text-center text-sm font-normal text-blue-600 tracking-widest'>our commitment</p>
            </div>
            <div className='flex justify-center shadow-lg py-4'>
                <h1 className='font-bold text-blue-600 text-4xl'>Your company / store name</h1>
            </div>
            <div className='flex justify-between bg-[#9b9b9b2c] shadow-md px-3 py-2'>
                <div className='flex  items-center gap-x-5'>
                    <div className='flex flex-col gap-y-5 text-bold text-blue-600'>
                        <label htmlFor="">Name:</label>
                        <label htmlFor="">Phone:</label>
                        <label htmlFor="">Address:</label>
                    </div>
                    <div className='w-60 flex flex-col items-center gap-x-2'>
                        <input type="text" className='w-full px-3 py-1 bg-transparent outline-none border-b-2 border-[#7c7c7c5c] border-dashed ' />
                        <input type="number" className='w-full px-3 py-1 bg-transparent outline-none border-b-2 border-[#7c7c7c5c] border-dashed ' />
                        <input type="text" className='w-full px-3 py-1 bg-transparent outline-none border-b-2 border-[#7c7c7c5c] border-dashed ' />
                    </div>
                </div>
                <div className='w-80 text-end'>
                    <p className='font-semibold text-blue-600 text-lg '>House # 01, Road # 01, Block # 01, Sector # 01, Uttara, Dhaka</p>
                    <p className='font-bold text-lg text-blue-400'>Phone: 01xxxxxxxxx</p>
                    <p className='font-bold text-lg text-blue-400'>Fax: 01xxxxxxxxx</p>
                    <p className='font-bold text-sm text-blue-400'>Website: www.example.com</p>
                </div>
            </div>
            <div className='flex justify-between items-center py-1 px-3'>
                <div>
                    <p className='text-lg text-blue-600 text-semibold'>Serial No : <span>0000000001</span></p>
                </div>
                <div className='flex'>
                <div className='w-10 h-8 text-blue-600 border border-r-transparent border-[#7c7c7c] flex justify-center items-center'>05</div>
                <div className='w-10 h-8 text-blue-600 border border-[#7c7c7c] flex justify-center items-center'>11</div>
                <div className='w-20 h-8 text-blue-600 border border-l-transparent border-[#7c7c7c] flex justify-center items-center'>2024</div>
                </div>
            </div>
                <h1 className='text-xl text-center text-slate-100 bg-blue-500 py-2 shadow-lg'>Cash Memo</h1>
        </div>
    )
}

export default Header