import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

const signupController = async (req, res) => {
    const { name, email, password } = req.body;

    //Checking whether user exists or not
    const userExists = await prisma.user.findUnique({
        where: {
            email: email
        },
    });

    if (userExists) {
        return res.status(400).json({ error: "User already exists" });
    };

    //Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Creating the user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });

    //Generate jwt token here and send it to the client
    const token = generateToken(user.id, res);

    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token,
        },
    });
};

const loginController = async (req, res) => {
    const { email, password } = req.body;

    //Checking whether user exists or not
    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
    });

    if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
    };

    //Verifying the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid email or password" });
    };

    //Generate jwt token here and send it to the client
    const token = generateToken(user.id, res);

    res.status(200).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                email: user.email
            },
            token,
        },
    });
};

const logoutController = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({
        status: "success",
        message: "User logged out successfully"
    });
};

export { signupController, loginController, logoutController };