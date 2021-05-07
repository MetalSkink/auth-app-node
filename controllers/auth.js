const {response} = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async(req,res = response)=>{
    //console.log(req.body);
    //console.log(email,name,password);
    const {email, name, password} = req.body;
    
    try {
        // Verificar el email
        const usuario = await Usuario.findOne({email});
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Este correo ya esta siendo usado'
            });
        }
        // Crear usuario con el modelo
        const dbUser = new Usuario(req.body);
        // Hashear la contraseña
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password,salt);
        // Generar el JWT
        const token = await generarJWT(dbUser.id,name)
        //Crear Usuario
        await dbUser.save();
        //Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            email,
            msg: 'Usuario Creado Exitosamente',
            token
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Porfavor hable con el admin'
        });
    }


}

const loginUsuario = async(req,res = response)=>{

    const {email, password} = req.body;

    try {
        const dbUser = await Usuario.findOne({email})
        if( !dbUser){
            return res.status(400).json({
                ok:false,
                msg: "El correo no existe"
            });
        }

        //Confirmar si el password matchea
        const validPassword = bcrypt.compareSync( password, dbUser.password);
        if ( !validPassword){
            return res.status(400).json({
                ok:false,
                msg: "La contraseña no es correcta"
            });
        }
        // Generar el JWT
        const token = await generarJWT(dbUser.id,dbUser.name);
        return res.json({
            ok:true,
            uid: dbUser.id,
            name: dbUser.name,
            email,
            msg: 'Usuario Logeado Exitosamente',
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Porfavor hable con el admin'
        });
    }
}

const revalidarToken = async(req,res = response)=>{
    
    const {uid, name}= req;
    const token = await generarJWT(uid,name);

    const dbUser = await Usuario.findById(uid);

    return res.json({
        ok: true,
        uid,
        name,
        email: dbUser.email,
        msg: 'renew',
        token
    })
}

module.exports={
    crearUsuario,
    loginUsuario,
    revalidarToken
}