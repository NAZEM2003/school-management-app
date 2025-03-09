'use client'

import * as Clerk from '@clerk/elements/common';
import * as SignIn from '@clerk/elements/sign-in';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const LoginPage = () => {
    const {user} = useUser();
    const router = useRouter();

    useEffect(()=>{
        const role = user?.publicMetadata.role;
        if(role){
            router.push(`/${role}`)
        }
    },[user , router])
    
    return (
        <div className='h-screen flex items-center justify-center bg-customSkyBlueLight'>
            <SignIn.Root>
                <SignIn.Step name='start' className='bg-white px-12 py-5 rounded-md shadow-2xl flex flex-col gap-2'>
                    <div className=''>
                        <Image src="/logo-typo.png" width={150} height={50} alt="logo" />
                    </div>
                    <h2 className='text-gray-400'>Sign in to Your Account</h2>
                    <Clerk.GlobalError className='text-sm text-red-500' />

                    <Clerk.Field name={'identifier'} className='flex flex-col gap-2 mt-3'>
                        <Clerk.Label className='text-sm text-gray-500'>Username</Clerk.Label>
                        <Clerk.Input type='text' required className='p-2 rounded-md ring-1 ring-gray-300 outline-none' />
                        <Clerk.FieldError className='text-xm text-red-400' />
                    </Clerk.Field>
                    <Clerk.Field name={'password'} className='flex flex-col gap-2 mt-3'>
                        <Clerk.Label className='text-sm text-gray-500'>Password</Clerk.Label>
                        <Clerk.Input type='password' required className='p-2 rounded-md ring-1 ring-gray-300 outline-none' />
                        <Clerk.FieldError className='text-xm text-red-400' />
                    </Clerk.Field>

                    <SignIn.Action className='bg-blue-500 text-white rounded-md text-sm my-2 p-3' submit>Sign in</SignIn.Action>
                </SignIn.Step>
            </SignIn.Root>
        </div>
    );
}

export default LoginPage;
