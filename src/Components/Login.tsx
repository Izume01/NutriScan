import { useState } from 'react'
import image from '../Assets/images/download.jpeg'

import { loginUser, getUser } from '../appwrite/authService'

export const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async () => {
        console.log(email, password)
        try {
            await loginUser(email, password)
            const user = await getUser()
            console.log(user)
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    return (
        <div className='w-full h-screen bg-black p-6 flex justify-center items-center'>
            <div className='w-full max-w-screen-xl flex flex-row gap-4'>
                <div className='h-[95vh] flex flex-col justify-center rounded-4xl items-center overflow-hidden'>
                    <img className='rounded-4xl object-cover h-full' src={image} alt="" />

                </div>

                <div className='h-[95vh] flex flex-col justify-center items-center w-full'>
                    <h1 className='text-4xl font-bold text-white'>Welcome back!</h1>
                    <p className='text-sm text-gray-400'>Log in to your account</p>
                    <div className='flex flex-col gap-2 mt-6 w-full max-w-md'>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" placeholder='Email' className='w-full bg-[#27272A] p-2 rounded-md border border-[#3F3F46] text-white' />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password" placeholder='Password' className='w-full bg-[#27272A] p-2 rounded-md border border-[#3F3F46] text-white' />
                        <button
                            onClick={handleLogin}
                            className='bg-[#3F3F46] p-2 rounded-md text-white'>Login</button>
                        <p className='text-sm text-gray-400'>Don't have an account? <span className='text-blue-500 cursor-pointer'>Sign up</span></p>
                        <div>
                            <p className='text-sm text-gray-400 mt-4 text-center'>Or login with</p>
                            <div className='flex justify-center gap-2 mt-2 w-full'>
                                <button className='bg-[#3F3F46] p-2 w-full rounded-md text-white '>Github</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

