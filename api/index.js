import express from 'express';
import exphbs from 'express-handlebars';
import dotenv from 'dotenv/config';
import Pessoa from './models/pessoa.js'


const app = express();
const hbs = exphbs.create({
    partialsDir: ['./views/partials'],
    runtimeOptions: {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true,
    }
});
const PORT = process.env.PORT


app.engine('handlebars', hbs.engine);

app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(express.static('./public'));

app.post('/pessoas/cadastro/confirm', async (req, res) => {
    let nome = req.body.nome || '';

    nome = nome.trim(); 

    if (nome.length > 0 && nome.length <= 13) {
        await new Pessoa({nome}).save()
        .then(data => {
            res.redirect(`/pessoas/${data._id}`);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(404);
        })
    } else {
        res.sendStatus(404);
    }
});

app.get('/pessoas/cadastrar', (req, res) => {
    res.render('cadastrar');
});

app.post('/pessoas/editar/confirm', async (req, res) => {
    let {_id, nome} = req.body;
    nome = nome || '';

    if (nome.length > 1 && nome.length <= 13) {
        await Pessoa.updateOne({_id}, {nome})
        .then(() => {
            res.redirect(`/pessoas/${_id}`);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(404);
        });
    } else {
        res.sendStatus(404);
    }  
});

app.get('/pessoas/editar/:id', async (req, res) => {
    const _id = req.params.id;

    Pessoa.findById({_id})
    .then((data) => {
        res.render('edit', {pessoas: data});
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(404);
    });

});

app.post('/pessoas/exluir/:id', async (req, res) => {
    const id = req.params.id;

    await Pessoa.deleteOne({_id: id})
    .then(() => {
        res.redirect('/');
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(404);
    });
});

app.get('/pessoas/:id', async (req, res) => {
    const id = req.params.id;
    await Pessoa.findById({_id: id})
    .then(data => {
        res.render('pessoa', {pessoas: data});
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(404);
    });
});

app.get('/', async (req, res) => {

    await Pessoa.find()
    .then(data => {
        res.render('home', { pessoas: data});
    })
    .catch(err => {
        res.sendStatus(503);
        console.log(err);
    })
    
});



app.listen(PORT || 4000, () => {
    console.log(`Server listening on port ${PORT}`);
});
