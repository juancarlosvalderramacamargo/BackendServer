const express = require('express');
const router = express.Router();

const mysqlConnection = require('../connection/connection');

const jwt = require('jsonwebtoken');


router.get('/',(req,res)=>{
    mysqlConnection.query('select * from users ',(err,rows,fields)=>{
        if (!err) {
            if(rows.length > 0)
                res.json(rows);
            else
            res.send('Not Result')
        } else {
            console.log(err);
        }
    })
});


router.post('/singin',(req,res)=>{
    //console.log(req.body);


    const {userName, pass} = req.body;

    //pass = jwt.sign(pass,'angularClaro').toString();
    
    mysqlConnection.query('select * from users where userName = ? and pass = ?',
    [userName,pass],
    (err,rows,fields)=>{
        if (!err) {
            //console.log(rows);
            if (rows.length > 0) {
                let data = JSON.stringify(rows[0]);
                //res.json(data);
                const token = jwt.sign(data,'angularClaro');
                res.json({token});
            } else {
                let token = 'Usuario o clave inconrrectos!'
                res.json({token});
            }

        } else {
            console.log(err);
        }
    }
    )

})


router.post('/test',verifyToken,(req,res)=>{
    //console.log(req.data);
    res.json('Información secreta!');
});


function verifyToken(req,res,next){
    if (!req.headers.authorization) return res.status(401).json('Acceso no autorizado!');

    const token = req.headers.authorization.substr(7);
    //console.log(token);
    if (token !== '') {
        const content = jwt.verify(token,'angularClaro');
        //console.log(content);
        req.data = content;
        next();
    } else {
        res.status(401).json('Token vacio!');
    }
}



//Metodos Utils
router.get('/users',(req,res) => {
    const sql = 'select * from users';
    mysqlConnection.query(sql,(err,rows,fields)=>{
        if (!err) {
            if(rows.length > 0)
                res.json(rows);
            else
                res.send('Not Result')
        } else {
            console.log(err);
        }
    });
});

router.get('/users/:id',(req,res) => {
    //res.send('Get User by ID');
    const { id } = req.params;
    const sql = `SELECT * FROM users WHERE idUsers = ${id}`;

    mysqlConnection.query(sql,(err,rows,fields)=>{
        if (!err) {
            if(rows.length > 0)
                res.json(rows);
            else
                res.send('Not Result')
        } else {
            console.log(err);
        }
    });

});

router.post('/add',(req,res) => {
    //res.send('New User');
    const passJwt = jwt.sign(req.body.pass,'angularClaro').toString();

    const sql = 'INSERT INTO users SET ?';
    const usersObj = {
        userName : req.body.userName,
        pass : req.body.pass,//passJwt,
        role_id : req.body.role_id,
        Nombre : req.body.Nombre,
        Apellido : req.body.Apellido,
        Telefono : req.body.Telefono,
        Email : req.body.Email,
        FechaRegistro : req.body.FechaRegistro,
        ClinicaID : req.body.ClinicaID
    };

    mysqlConnection.query(sql,usersObj,error=>{
        if (error) console.log(error);
        res.send('Usuario creado!' );
    });

});


router.put('/update/:id',(req,res) => {
    
    const { id } = req.params;
    const  { userName,pass,role_id,Nombre,Apellido,Telefono,Email,FechaRegistro,ClinicaID } = req.body;

    const sql = `UPDATE users SET userName = '${userName}',pass= '${pass}',role_id='${role_id}',Nombre='${Nombre}' ,Apellido='${Apellido}' ,Telefono='${Telefono}',Email='${Email}',FechaRegistro='${FechaRegistro}',ClinicaID='${ClinicaID}' WHERE idUsers = ${id}`;

    mysqlConnection.query(sql,error=>{
        if (error) console.log(error);
        res.send('Usuario actualizado!' );
    });

    

});

router.delete('/delete/:id',(req,res) => {
    
    const { id } = req.params;
    const sql = `DELETE FROM users WHERE idUsers = ${id}`;

    mysqlConnection.query(sql,err=>{
        if (err) console.log(err);
        res.send('Usuario borrado!' );
    });
});



module.exports = router;