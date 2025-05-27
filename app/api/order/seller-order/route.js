import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Address from '@/models/address'
import { NextResponse } from "next/server";
import Order from "@/models/order";



export async function GET(request) {
    try {
        const { userId } = getAuth(request)

        const isSeller = await authSeller(userId)

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'not authorized' })
        }

        await connectDB()
        
        Address.length

        const order = await Order.find({}).populate('address items.product')
        return NextResponse.json({ success: true, order })




        
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
        
    }
}