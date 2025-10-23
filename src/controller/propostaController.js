import { Router } from "express";
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();
const autenticar = getAuthentication();



export default endpoints;