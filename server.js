require('dotenv').config(); // Carrega e configura as variáveis de ambiente do arquivo .env
const express = require('express'); // Importa o framework express
const app = express(); // Cria uma instância do aplicativo express
const mongoose = require('mongoose'); // Importa o pacote mongoose para interagir com o MongoDB

    // Conecta-se ao banco de dados MongoDB usando a CONNECTIONSTRING definida no .env
mongoose.connect(process.env.CONNECTIONSTRING, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
    })
    .then(() => {
        app.emit('pronto'); // Quando a conexão com o banco de dados é estabelecida com sucesso, emite o evento 'pronto' para iniciar o servidor
    })
    .catch(e => console.log(e));

    // Importa os pacotes 
const session = require('express-session');     // Gerencia as sessões dos usuários
const MongoStore = require('connect-mongo');    // Armazena as sessões no MongoDB
const flash = require('connect-flash');         // Exibe mensagens flash na aplicação
const routes = require('./routes')              // Definide rotas no arquivo routes.js
const path = require('path');                   // Lida com caminhos de arquivos e diretórios
// const helmet = require('helmet');               // melhora a segurança do site/aplicativo
const csrf = require('csurf');                   // Protege contra ataques CSRF
const { middlewareGlobal, checkCsrfError, csrfMiddelware } = require('./src/middlewares/middleware');   // Importa os middlewares personalizados definidos em middleware.js

// app.use(helmet());                              // Aplica o middleware helmet para adicionar medidas de segurança ao site/aplicativo 

app.use(express.urlencoded({ extended: true }));                // Configura o express para interpretar dados de formulários HTML enviados via POST
app.use(express.json());                                        // Configura o express para interpretar requisições com corpo JSON
app.use(express.static(path.resolve(__dirname, 'public')));     // Define o diretório 'public' como o local para servir arquivos estáticos

    // Define as opções para o middleware express-session
const sessionOptions = session ({
    secret: 'akshfiuahufihaisjkbuuiq safiahsif isajdas dasdasd asdasd()',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // Tempo de expiração do cookie da sessão (7 dias)
        httpOnly: true                   // O cookie só pode ser acessado por meio de solicitações HTTP, não por JavaScript no navegador
    },
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }) // Configura o armazenamento das sessões no MongoDB
});

app.use(sessionOptions);    // Aplica o middleware express-session com as opções definidas anteriormente
app.use(flash());           // Aplica o middleware connect-flash para exibir mensagens flash na aplicação

app.set('views', path.join(__dirname, 'src', 'views'));         // Define o diretório de visualizações (views) do aplicativo como 'src/views'
app.set('view engine', 'ejs');                                  // Define o mecanismo de visualização como EJS para renderizar as visualizações

app.use(csrf());                                              // Aplica o middleware csrf para adicionar proteção contra ataques CSRF

// Aplica os middlewares personalizados definidos em middleware.js
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddelware);
app.use(routes);

// Quando o evento personalizado 'pronto' é emitido (após a conexão com o banco de dados), inicia o servidor na porta 3000
app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('Acessar http://localhost:3000'); 
        console.log('Servidor executando na porta 3000'); 
    });
});

