import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoutil";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {

    try {

        // Get the user data from the request
        const { email, password } = await request.json();

        // Validate
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
        }

        await connectToDatabase();

        // Check against already existing users
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists." }, { status: 400 });
        }


        // Hash the password for security reasons
        const hashedPassword = await bcrypt.hash(password, 10); // def salt round

        // Create the new user in the database
        const newUser = await User.create({
            email,
            password: hashedPassword
        })

        return NextResponse.json({ message: "User created successfully.", user: {
            id: newUser._id,
            email: newUser.email,
            }
        }, { status: 201 }); // If it's successful, should be returning a 201 status code


    } catch (error) {
        console.error('An error occurred during user creation:', error);
        return NextResponse.json({message: "An error occurred during user creation."}, { status: 500 });
    }


}