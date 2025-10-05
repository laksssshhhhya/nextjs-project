"use client"
import { sign } from 'crypto';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react'

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = await signIn("credentials", { email, password, redirect: false });

        if(result?.error) {
            console.log(result.error);
        } else {  
            router.push("/");
        }

      };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <div>
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </div>
    </div>
  )
}


export default LoginPage
