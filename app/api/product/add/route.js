import { v2 as cloudinary } from 'cloudinary';
import { getAuth } from '@clerk/nextjs/server';
import authSeller from '@/lib/authSeller';
import connectDB from '@/config/db';
import Product from '@/models/product';
import { NextResponse } from 'next/server';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

   
export async function POST(request) {

    console.log(request, "request")
  try {
    const userId = "1"; // Placeholder for userId, replace with actual user ID retrieval logic
    // const isSeller = authSeller(userId);
    // console.log('User ID:', userId, isSeller);
    // if (!isSeller) {
    //   return NextResponse.json({ success: false, message: 'Not authorized' });
    // }
    console.log('Request received for product upload', request);

    const formData = await request.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const category = formData.get('category');
    const price = formData.get('price');
    const offerPrice = formData.get('offerPrice');
    const files = formData.getAll('images');
    console.log(files, formData.getAll('images'), "aaaaaaa")
    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: 'No files uploaded' });
    }

    // Upload images to Cloudinary
    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = file.type;
        const base64Data = buffer.toString('base64');
        const dataUri = `data:${mimeType};base64,${base64Data}`;

        try {
          const uploadResult = await cloudinary.uploader.upload(dataUri, {
            resource_type: 'auto',
          });
          return uploadResult.secure_url;
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          throw new Error('Failed to upload image to Cloudinary');
        }
      })
    );

    console.log('Image URLs:', imageUrls);

    // Connect to the database
    await connectDB();

    // Create a new product
    const newProduct = await Product.create({
      userId, // Assuming you have a userId from auth
      name,
      description,
      category,
      price: Number(price),
      offerPrice: Number(offerPrice),
      image: imageUrls,
      date: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: 'Product uploaded successfully',
      newProduct,
    });
  } catch (error) {
    console.error('Product upload error:', error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
