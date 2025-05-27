
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'user' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, required: false },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
}, { timestamps: true });

const Address = mongoose.models.address || mongoose.model('address', addressSchema);
export default Address;

