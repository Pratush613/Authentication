"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const jwt_1 = require("./utils/jwt");
const auth_1 = require("./middlewares/auth");
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield prisma.details.findMany();
    res.send(allUsers);
}));
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = req.body;
    const ifExist = yield prisma.details.findUnique({
        where: {
            email
        }
    });
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    if (ifExist == null) {
        try {
            const createdUser = yield prisma.details.create({
                data: {
                    email,
                    name,
                    password: hashedPassword
                }
            });
            res.status(201).json({ "msg": "user created" });
        }
        catch (error) {
            res.json({ "msg": error });
        }
    }
    else {
        res.json({
            "msg": "User already exist try with another email"
        });
    }
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.details.findUnique({
            where: { email }
        });
        if (!user) {
            res.status(404).json({ "msg": "User not found Please sign up !" });
        }
        else {
            if (password == user.password) {
                const name = user.name;
                const token = (0, jwt_1.generateToken)({ name });
                res.status(200).json({ token });
            }
            else {
                res.status(401).json({
                    "msg": "Wrong Password"
                });
            }
        }
    }
    catch (error) {
        res.status(500).json({ "msg": error });
    }
}));
app.get('/protected', auth_1.authenticateJWT, (req, res) => {
    const user = req.user;
    res.status(200).json({ "msg": user.name });
});
app.listen(3000, () => {
    console.log("Server is running");
});
