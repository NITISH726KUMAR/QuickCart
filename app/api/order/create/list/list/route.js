import { getAuth } from "@clerk/nextjs/server";



export async function GET(request) {
    try {

        const { userId } = getAuth(request)

        await connectDB();

        Address.length
        products.length

        const order = await Order.find({userId}).populate('address item.product')

        return NextResponse.json({ success: true, order })


        

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })

       
    }


}