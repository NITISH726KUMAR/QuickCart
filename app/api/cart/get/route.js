import connectDB from "@/config/db"
import { getAuth} from "@clerk/nextjs/server"
import User from "@/models/user"
import { NextResponse } from "next/server"

export async function GET(request) {
    try {

        const { userId } = getAuth(request)

        await connectDB()
        const user = await User.findById(userId)

        const { cartItems } = user

        return NextAuth.response.json({ success:true, cartItems})
        
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
        
    }
}