import multer from 'multer';
import { Router } from 'express';
import { getAuthentication } from "../utils/jwt.js";


const upload = multer ({dest: 'public/storage'});
const endpoints = Router();
const autenticar = getAuthentication();

endpoints.post("/usuario/:id/produto", upload.single("imagem"), async (req,resp) => {

});

endpoints.put("/usuario/:id/produto/:id", upload.single("imagem"), async (req, resp) => {

});

endpoints.delete("/usuario/:id/produto/:id", async (req,resp)=>{

});

endpoints.get("/produto/listar", async (req,resp)=>{

});

endpoints.get("/usuario/:id/produto", async (req,resp)=> {

});


export default endpoints;
