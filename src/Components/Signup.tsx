import { useState } from 'react'
import { registerUser, loginUser, oauthLogin, getUser } from '../appwrite/authService'
import { OAuthProvider } from 'appwrite'
import { createUserDoc } from '../appwrite/dbService'
import image from '../Assets/images/download.jpeg'
import { useNavigate } from 'react-router'
export const Signup = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const Register = async () => {
        await registerUser(email, password, name)
        await loginUser(email, password)

        setTimeout(() => {
            navigate('/onboarding')
        }, 1000)  // 1 second delay before navigation
    }

    const handleAuthProvider = async (provider: OAuthProvider) => {
        try {
            await oauthLogin(provider)

            const user = await getUser()
            const userId = user.$id
            const userDoc = await createUserDoc(userId, {
                bio: "New User",
                joinedAt: new Date().toISOString(),
            })
            console.log('User document created:', userDoc)

            navigate('/onboarding')
        } catch (error) {
            console.error('Error logging in with OAuth:', error);
        }
    }


    return (
        <div className='w-full h-screen bg-black p-6 flex justify-center items-center'>
            <div className='w-full max-w-screen-xl flex flex-row gap-4'>
                <div className='h-[95vh] flex flex-col justify-center rounded-4xl items-center overflow-hidden'>
                    <img className='rounded-4xl object-cover h-full' src={image} alt="" />

                </div>

                <div className='h-[95vh] flex flex-col justify-center items-center w-full'>
                    <h1 className='text-4xl font-bold text-white'>Sign up Account !</h1>
                    <p className='text-sm text-gray-400 mt-4'>Enter your personal data to create your account.</p>


                    <div className='w-full max-w-md'>
                        <div className='flex justify-center gap-2 mt-4'>
                            
                            <button
                                onClick={() => {
                                    handleAuthProvider(OAuthProvider.Github)
                                }}
                                className=' w-full bg-[#3F3F46] hover:bg-[#55555c] transition-colors p-2 rounded-md text-white '>Github</button>
                        </div>
                        <p className='text-sm text-gray-400 mt-4 text-center'>Or sign up with</p>

                    </div>

                    <div className='flex flex-col gap-2 mt-6 w-full max-w-md'>
                        <input onChange={
                            (e) => {
                                setName(e.target.value)
                                if (e.target.value.length > 0) {
                                    setName(e.target.value)
                                }
                            }} type="text" placeholder='Name' className='w-full bg-[#27272A] p-2 rounded-md border border-[#3F3F46] text-white' />

                        <input
                            onChange={
                                (e) => {
                                    setEmail(e.target.value)
                                    if (e.target.value.length > 0) {
                                        setEmail(e.target.value)
                                    }
                                }
                            }
                            type="email" placeholder='Email' className='w-full bg-[#27272A] p-2 rounded-md border border-[#3F3F46] text-white' />
                        <input
                            onChange={
                                (e) => {
                                    setPassword(e.target.value)
                                    if (e.target.value.length > 0) {
                                        setPassword(e.target.value)
                                    }
                                }
                            }
                            type="password" placeholder='Password' className='w-full bg-[#27272A] p-2 rounded-md border border-[#3F3F46] text-white' />
                        <button
                            onClick={Register}
                            className='bg-[#3F3F46] p-2 rounded-md text-white'>Sign up</button>
                        <p 
                         onClick={() => {
                            navigate('/login')
                         }}
                         className='text-sm text-gray-400'>Already have an account? <span className='text-blue-500 cursor-pointer'>Login</span></p>
                    </div>


                </div>
            </div>
        </div>
    )
}
