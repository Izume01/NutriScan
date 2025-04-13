import React, { useState } from 'react'
import {setUserBaseline} from '../appwrite/dbService'
import {getUser} from '../appwrite/authService'

const emissionFactors = {
    transport: {
        car: 0.21,        
        bike: 0.05,
        public: 0.1,
        walk: 0,           
    },
    diet: {
        vegan: 1.5,        
        vegetarian: 1.7,
        mixed: 2.5,
        meatHeavy: 3.3,
    },
    energy: {
        low: 1.2,         
        moderate: 2.5,
        high: 4,
    }, 
    distance : {
        car: 0.21,
        bike: 0.05,
        public: 0.1,
        walk : 0,
    }
}

export const Onboarding = () => {
    const [step, setStep] = useState(1)
    const [answers, setAnswers] = useState({
        transportMode: '',
        dailyDistance: '',
        dietType: '',
        energyUsage: '',
    })

    // baseline data per month

    const CalculateBaseline = () => {
        const transportEmission = emissionFactors.transport[answers.transportMode] * answers.dailyDistance * 30
        const dietEmission = emissionFactors.diet[answers.dietType] * 30
        const energyEmission = emissionFactors.energy[answers.energyUsage] * 30
        const totalEmission = transportEmission + dietEmission + energyEmission
        const userId = getUser().$id

        const baselineData = {
            transportEmission,
            dietEmission,
            energyEmission,
            totalEmission,
        }

        setUserBaseline(userId, baselineData)
            .then(() => {
                console.log('Baseline data set successfully!')
            })
            .catch((error) => {
                console.error('Error setting baseline data:', error)
            })
    }

    const handleChange = (e) => {
        setAnswers({
            ...answers,
            [e.target.name]: e.target.value,
        })
    }

    const nextStep = () => setStep((prev) => prev + 1)
    const prevStep = () => setStep((prev) => prev - 1)

    const handleSubmit = () => {
        console.log('User Answers:', answers)
        CalculateBaseline()
    }

    const progressWidth = (step / 4) * 100

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#121212] to-[#1a1a1a] text-white px-4'>
            <div className='bg-[#242424] p-8 rounded-2xl w-full max-w-xl shadow-2xl border border-gray-700'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold mb-2'>Carbon Footprint Calculator 🌱</h1>
                    <p className='text-gray-400'>Step {step} of 4</p>
                    <div className='w-full bg-gray-700 rounded-full h-2 mt-4'>
                        <div 
                            className='bg-green-500 h-2 rounded-full transition-all duration-500'
                            style={{ width: `${progressWidth}%` }}
                        ></div>
                    </div>
                </div>

                <div className='transition-all duration-300 transform'>
                    {step === 1 && (
                        <div className='space-y-4 animate-fadeIn'>
                            <h2 className='text-xl font-semibold mb-4'>Transportation 🚗</h2>
                            <label className='text-gray-300 font-semibold block mb-2'>How do you usually commute?</label>
                            <div className='grid grid-cols-2 gap-4'>
                                {['car', 'bike', 'public', 'walk'].map((mode) => (
                                    <div
                                        key={mode}
                                        onClick={() => setAnswers({...answers, transportMode: mode})}
                                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                                            answers.transportMode === mode 
                                                ? 'bg-green-500 border-green-400' 
                                                : 'bg-[#1a1a1a] border-gray-700'
                                        } border hover:border-green-400`}
                                    >
                                        <p className='capitalize font-medium'>{mode}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className='space-y-4 animate-fadeIn'>
                            <h2 className='text-xl font-semibold mb-4'>Daily Distance 📍</h2>
                            <input 
                                type="number" 
                                name="dailyDistance" 
                                value={answers.dailyDistance} 
                                onChange={handleChange} 
                                className='w-full bg-[#1a1a1a] p-4 rounded-xl border border-gray-700 text-white focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all' 
                                placeholder='Enter distance in km' 
                            />
                        </div>
                    )}

                    {step === 3 && (
                        <div className='space-y-4 animate-fadeIn'>
                            <h2 className='text-xl font-semibold mb-4'>Dietary Habits 🥗</h2>
                            <div className='grid grid-cols-2 gap-4'>
                                {[
                                    {value: 'vegan', label: 'Vegan 🌱'},
                                    {value: 'vegetarian', label: 'Vegetarian 🥗'},
                                    {value: 'mixed', label: 'Mixed Diet 🍗'},
                                    {value: 'meatHeavy', label: 'Meat Heavy 🥩'}
                                ].map((diet) => (
                                    <div
                                        key={diet.value}
                                        onClick={() => setAnswers({...answers, dietType: diet.value})}
                                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                                            answers.dietType === diet.value 
                                                ? 'bg-green-500 border-green-400' 
                                                : 'bg-[#1a1a1a] border-gray-700'
                                        } border hover:border-green-400`}
                                    >
                                        <p className='font-medium'>{diet.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className='space-y-4 animate-fadeIn'>
                            <h2 className='text-xl font-semibold mb-4'>Energy Usage ⚡</h2>
                            <div className='space-y-3'>
                                {[
                                    {value: 'low', label: 'Low – LED lights, minimal appliance usage'},
                                    {value: 'moderate', label: 'Moderate – Normal usage'},
                                    {value: 'high', label: 'High – ACs, heavy appliance use'}
                                ].map((energy) => (
                                    <div
                                        key={energy.value}
                                        onClick={() => setAnswers({...answers, energyUsage: energy.value})}
                                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                                            answers.energyUsage === energy.value 
                                                ? 'bg-green-500 border-green-400' 
                                                : 'bg-[#1a1a1a] border-gray-700'
                                        } border hover:border-green-400`}
                                    >
                                        <p className='font-medium'>{energy.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className='flex justify-between mt-8'>
                    {step > 1 ? (
                        <button 
                            onClick={prevStep} 
                            className='px-6 py-3 bg-[#1a1a1a] rounded-xl hover:bg-gray-700 transition-all'
                        >
                            Back
                        </button>
                    ) : <div></div>}
                    {step < 4 ? (
                        <button 
                            onClick={nextStep} 
                            className='px-6 py-3 bg-green-500 rounded-xl hover:bg-green-600 transition-all'
                        >
                            Continue
                        </button>
                    ) : (
                        <button 
                            onClick={handleSubmit} 
                            className='px-6 py-3 bg-green-500 rounded-xl hover:bg-green-600 transition-all'
                        >
                            Calculate Results
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
