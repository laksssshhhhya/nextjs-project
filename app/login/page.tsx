'use client'

import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useEffect, useState } from 'react'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isFlipping, setIsFlipping] = useState(false)
  const router = useRouter()

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace('/')
      }
    })
  }, [router])

  const handleModeSwitch = (newMode: boolean) => {
    if (newMode !== isRegisterMode) {
      setIsFlipping(true)
      setTimeout(() => {
        setIsRegisterMode(newMode)
        setError('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setIsFlipping(false)
      }, 300) // Half of the flip duration
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isRegisterMode) {
      // Register logic
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long')
        setLoading(false)
        return
      }

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || data.error || 'Registration failed')
        
        alert('Registration successful! Please login.')
        handleModeSwitch(false)
      } catch (error: any) {
        setError(error.message || 'Registration failed. Please try again.')
      }
    } else {
      // Login logic
      try {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })
        if (result?.error) {
          setError('Invalid email or password')
          return
        }
        router.push('/')
        router.refresh()
      } catch (err) {
        setError('Something went wrong. Please try again.')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Fixed Toggle Switch Container */}
        <div className="flex justify-center items-center gap-6 mb-12 h-8">
          <button
            onClick={() => handleModeSwitch(false)}
            className={`text-white font-semibold text-lg transition-all duration-200 ${
              !isRegisterMode ? 'underline' : ''
            }`}
          >
            Log in
          </button>
          
          <div className="relative">
            <div
              className={`w-12 h-5 border-2 border-white rounded transition-all duration-300 relative cursor-pointer ${
                isRegisterMode ? 'bg-[#2d8cf0]' : 'bg-[#111]'
              }`}
              style={{ boxShadow: '3px 3px 0px white' }}
              onClick={() => handleModeSwitch(!isRegisterMode)}
            >
              <div
                className={`absolute w-5 h-5 bg-[#111] border-2 border-white rounded -top-[2px] transition-transform duration-300 ${
                  isRegisterMode ? 'translate-x-6' : '-translate-x-[2px]'
                }`}
                style={{ boxShadow: '0 2px 0px white' }}
              />
            </div>
          </div>
          
          <button
            onClick={() => handleModeSwitch(true)}
            className={`text-white font-semibold text-lg transition-all duration-200 ${
              isRegisterMode ? 'underline' : ''
            }`}
          >
            Sign up
          </button>
        </div>

        {/* Main Card with Flip Animation */}
        <div className="perspective-1000">
          <div 
            className={`
              relative preserve-3d transition-transform duration-600 ease-in-out
              ${isFlipping ? 'rotate-y-90' : 'rotate-y-0'}
            `}
          >
            <div 
              className="bg-[#111] border-2 border-white rounded-lg p-8 backface-hidden min-h-[480px] flex flex-col justify-center"
              style={{ boxShadow: '6px 6px 0px white' }}
            >
              {/* Title */}
              <h1 className="text-3xl font-black text-white text-center mb-8">
                {isRegisterMode ? 'Sign up' : 'Log in'}
              </h1>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-900/30 border border-red-500 rounded-lg p-3 text-red-300 text-sm text-center">
                    {error}
                  </div>
                )}

                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 px-4 py-3 bg-[#111] border-2 border-white rounded-lg text-white text-base font-medium placeholder-[#7e7e7e] focus:border-[#2d8cf0] focus:outline-none transition-colors"
                    style={{ boxShadow: '4px 4px 0px white' }}
                  />
                </div>

                {/* Password Input */}
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-12 px-4 py-3 bg-[#111] border-2 border-white rounded-lg text-white text-base font-medium placeholder-[#7e7e7e] focus:border-[#2d8cf0] focus:outline-none transition-colors"
                    style={{ boxShadow: '4px 4px 0px white' }}
                  />
                </div>

                {/* Confirm Password Input - Only in register mode */}
                {isRegisterMode && (
                  <div className="animate-fade-in">
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full h-12 px-4 py-3 bg-[#111] border-2 border-white rounded-lg text-white text-base font-medium placeholder-[#7e7e7e] focus:border-[#2d8cf0] focus:outline-none transition-colors"
                      style={{ boxShadow: '4px 4px 0px white' }}
                    />
                  </div>
                )}

                {/* Spacer to push button to bottom */}
                <div className="flex-1"></div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#111] border-2 border-white rounded-lg text-white text-lg font-semibold cursor-pointer transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed active:translate-x-1 active:translate-y-1"
                    style={{ 
                      boxShadow: '4px 4px 0px white',
                    }}
                    onMouseDown={(e) => {
                      if (!loading) {
                        e.currentTarget.style.boxShadow = '2px 2px 0px white'
                      }
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.boxShadow = '4px 4px 0px white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '4px 4px 0px white'
                    }}
                  >
                    {loading 
                      ? (isRegisterMode ? 'Creating...' : 'Signing in...') 
                      : (isRegisterMode ? 'Confirm!' : "Let's go!")
                    }
                  </button>
                </div>

                {/* Footer Text */}
                <div className="text-center">
                  <p className="text-[#7e7e7e] text-sm">
                    {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                      type="button"
                      onClick={() => handleModeSwitch(!isRegisterMode)}
                      className="text-white hover:text-[#2d8cf0] transition-colors font-medium underline"
                    >
                      {isRegisterMode ? 'Sign in' : 'Sign up'}
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
