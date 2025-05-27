import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";
import Product from "@/models/product";
import User from "@/models/user";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        const user = await User.findById(userId);
        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        console.error("User data GET error:", error);
        return NextResponse.json({ success: false, message: error.message });
    }
}

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { address, items } = await request.json();

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: "invalid data" });
        }

        const amount = await items.reduce(async (accPromise, item) => {
            const acc = await accPromise;
            const product = await Product.findById(item.product);
            return await acc + (product.offerprice * item.quantity);
        }, Promise.resolve(0));

        await inngest.send({
            name: "Order Created",
            data: {
                userId,
                address,
                items,
                amount: amount + Math.floor(amount * 0.2),
                date: Date.now(),
            }
        });

        const user = await User.findById(userId);
        user.cartItems = {};
        await user.save();

        return NextResponse.json({ success: true, message: "Order placed" });
    } catch (error) {
        console.error("Order POST error:", error);
        return NextResponse.json({ success: false, message: error.message });
    }
}
