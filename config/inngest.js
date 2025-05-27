import { Inngest } from "inngest";
import { connect } from "mongoose";
import connectDB from "./db";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

//Inngest Fynction to  save a user sata to a database

export const syncUserCreation = inngest.createFunction(
    {
        id:"sync-user-from-clerk"
    },
    { event: 'cleark/user.created'},
    async ({event}) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData  = {
            _id:id,
            email: email_addresses[0].email_addresses,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        }
        await connectDB()
        await User.create(userData)

    }
)

// Inngest function to update user data in database
export const syncUserUpdate = inngest.createFunction(
    {
        id:"update-user-from-clerk"
    },
    { event: 'cleark/user.updated'},
    async ({event}) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData  = {
            _id:id,
            email: email_addresses[0].email_addresses,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        }
        await connectDB()
        await User.findByIdAndUpdate(id, userData,)
    }
)

// Inngest function to delete user data from database
export const syncUserDeletion = inngest.createFunction(
    {
        id:"delete-user-from-clerk"
    },
    { event: 'cleark/user.deleted'},
    async ({event}) => {
        const { id } = event.data;
        await connectDB()
        await User.findByIdAndDelete(id)
    }
);

// Inngest function to update user cart in database

export const createUserOrder = inngest.createFunction ({
    id: 'create-user-order',
    batchEvents: {
        maxSize: 5,
        timeout: '5s'
    }
},
{ event: 'order/created' },
async({event}) => {
    const order = EventSource.map((event)=> {
        return {
            userId: event.data.userId,
            items: event.data.items,
            amount: event.data.amount,
            address: event.data.address,
            date: event.data.date,
        }
    })

    await connectDB()
    await Order.insertMany(order)
    return { success: true, processed: order.length };



})