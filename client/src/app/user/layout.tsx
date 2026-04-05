import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const RootLayout = async ({ children }: { children: React.ReactNode }) => {

    const cookiesStore = await cookies()
    const token = cookiesStore.get("auth_token")?.value

    if (!token) {
        redirect("/auth/signin")
    }

    return (
        <div>{
            children
        }</div>
    )
}

export default RootLayout