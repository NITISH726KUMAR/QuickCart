import connectDB from '@/config/db';
import { NextResponse } from 'next/server';
import Product from '@/models/product';


export async function GET(request) {
    try {
        

        await connectDB();

        const product = await Product.find({})
        return NextResponse.json({ success: true, product })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}