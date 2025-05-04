import React from 'react'
import { FaShopify } from "react-icons/fa";
import Link from 'next/link';
import AvatarDropdown from './avatar-dropdown';


const MainNav = () => {
    return (
        <div className='flex justify-between items-center bg-white shadow-md p-4'>
            <Link href="/">
                <FaShopify className='w-12 h-12' />
            </Link>

            <AvatarDropdown/>
        </div>
    )
}

export default MainNav