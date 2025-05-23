import React, { useEffect } from 'react'
import { Leaf, Home, ChartLine, Calendar, Swords, Car, Apple, Lightbulb, BaggageClaim , Settings } from 'lucide-react'
import { getUser } from '../appwrite/authService';
import image from '../Assets/images/userprofile.jpg'

interface SidebarProps {
  onNavChange: (component: string) => void;
  activeItem: string;
}


export const Sidebar = ({ onNavChange, activeItem }: SidebarProps) => {

    const [userName , setUserName] = React.useState<string>('')

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUser();
                setUserName(user.name);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    } , []);
    return (
        <div className='flex flex-col w-[16rem] h-screen bg-[#18181B] text-white p-4 border-1 '>
            <div className='flex gap-2 items-center border-b-1 pb-4 border-gray-700'>
                <Leaf color="#10f500" size={48} />

                <div className='flex flex-col'>
                    <h1 className='text-2xl font-bold'>NutriSnap</h1>
                    <p className='text-sm text-gray-400'>Carban footprint tracker</p>
                </div>
            </div>

            <div className='flex flex-col gap-2 mt-4'>
                <div 
                    className={`flex gap-2 items-center cursor-pointer hover:bg-[#27272A] p-2 rounded-md ${activeItem === 'dashboard' ? 'bg-green-600' : ''}`}
                    onClick={() => onNavChange('dashboard')}
                >
                    <Home size={20} />
                    <p className='text-sm'>Dashboard</p>
                </div>
                <div 
                    className={`flex gap-2 items-center cursor-pointer hover:bg-[#27272A] p-2 rounded-md ${activeItem === 'statistics' ? 'bg-green-600' : ''}`}
                    onClick={() => onNavChange('chatbot')}
                >
                    <ChartLine size={20} />
                    <p className='text-sm'>Chat bot </p>
                </div>
                <div 
                    className={`flex gap-2 items-center cursor-pointer hover:bg-[#27272A] p-2 rounded-md ${activeItem === 'history' ? 'bg-green-600' : ''}`}
                    onClick={() => onNavChange('activities')}
                >
                    <Calendar size={20} />
                    <p className='text-sm'>History</p>
                </div>
                <div 
                    className={`flex gap-2 items-center cursor-pointer hover:bg-[#27272A] p-2 rounded-md ${activeItem === 'challenges' ? 'bg-green-600' : ''}`}
                    onClick={() => onNavChange('challenges')}
                >
                    <Swords size={20} />
                    <p className='text-sm'>Challenges</p>
                </div>
            </div>

            <div className='flex flex-col gap-2 mt-8'>
                <h1 className='font-medium text-gray-400'>Log Activities</h1>

                <div 
                    className={`flex gap-2 items-center cursor-pointer hover:bg-[#27272A] p-2 rounded-md ${activeItem === 'transport' ? 'bg-green-600' : ''}`}
                    onClick={() => onNavChange('logging')}
                >
                    <Car size={20} />
                    <p className='text-sm'>Transport</p>
                </div>
                <div 
                    className={`flex gap-2 items-center cursor-pointer hover:bg-[#27272A] p-2 rounded-md ${activeItem === 'food' ? 'bg-green-600' : ''}`}
                    onClick={() => onNavChange('logging')}
                >
                    <Apple size={20} />
                    <p className='text-sm'>Food</p>
                </div>
                <div 
                    className={`flex gap-2 items-center cursor-pointer hover:bg-[#27272A] p-2 rounded-md ${activeItem === 'energy' ? 'bg-green-600' : ''}`}
                    onClick={() => onNavChange('logging')}
                >
                    <Lightbulb size={20} />
                    <p className='text-sm'>Energy</p>
                </div>

                <div 
                    className={`flex gap-2 items-center cursor-pointer hover:bg-[#27272A] p-2 rounded-md ${activeItem === 'shopping' ? 'bg-green-600' : ''}`}
                    onClick={() => onNavChange('logging')}
                >
                    <BaggageClaim size={20} />
                    <p className='text-sm'>Shopping</p>
                </div>
            </div>

            <div className='flex flex-row gap-2 mt-auto border-t-1 pt-4 border-gray-700 items-center'>
                {/* user profile */}

                <span className='w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center'>
                    <img src={image} alt="User" className='w-10 h-10 rounded-full' />
                </span>

                <div className='flex flex-col'>
                    <h1 className='text-sm font-semibold'>{userName}</h1>
                    <p className='text-xs text-gray-400'>Level 3 Eco-Warrior</p>
                </div>

                <Settings className='ml-auto cursor-pointer hover:text-gray-400'/> 
            </div>
        </div>
    )
}
