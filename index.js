// //////// Настройка Express
// let express = require(`express`);
// let app = express();
// app.use(express.json());
// app.use(express.static('public'));
// let bcrypt = require('bcrypt');
// const serverless = require('serverless-http')

// // Инициализация сервера
// let port = 3000;
// app.listen(port, function () {
//     console.log(`Сервер запущен: http://localhost:${port}`)
// });

// // --- Настройка CORS ---
// const allowedOrigins = ['https://sweet-dreams-confectionery.ru', 'https://www.sweet-dreams-confectionery.ru'];
// app.use(cors({
//     origin: (origin, callback) => {
//         if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
//         callback(new Error(`CORS blocked for ${origin}`));
//     },
//     credentials: true,
//     methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS']
// }));
  
// // --- Доверие прокси (Vercel) ---
// app.set('trust proxy', 1);


// //////// НАСТРОЙКА СЕССИЙ И ИХ ХРАНЕНИЯ В MONGODB
// let session = require('express-session');

// //Задача URI для MongoDB
// // let MongoURI = 'mongodb://localhost:27017/SweetDreams';
// let MongoURI = 'mongodb+srv://BEll:V1F6RCchrlVIVoGE@cluster0.2cdsn0y.mongodb.net/SweetDreams?retryWrites=true&w=majority&appName=Cluster0'

// //Создание объекта для хранения в MongoDB сессий
// let MongoDBSession = require('connect-mongodb-session')(session)
// let store = new MongoDBSession({
//     uri: MONGO_URI,
//     collection: 'userSessions'
// });

// // Настройка сессии
// app.use(session({
//     secret: 'BEll_CookieSecretKey171814721ion',
//     resave: false,
//     saveUninitialized: false,
//     store: store,
//     cookie: {
//         maxAge: 604800000, // Время жизни cookie (7 дней)
//         secure: true,
//         sameSite: 'none',
//         httpOnly: true,
//         domain: 'sweet-dreams-confectionery.ru'
//     }
// }));

// //////// НАСТРОЙКА БД
// let mongoose = require('mongoose');
// mongoose.connect(MongoURI);

// Импорт зависимостей
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const serverless = require('serverless-http');

// Express-приложение
const app = express();
app.use(express.json());

// --- Доверие прокси (Vercel) ---
app.set('trust proxy', 1);


// --- Настройка CORS ---
const allowedOrigins = [
  'https://sweet-dreams-confectionery.ru',
  'https://www.sweet-dreams-confectionery.ru'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked for ${origin}`));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS']
}));


// Environment variables
const MONGO_URI = 'mongodb+srv://vercel-admin-user-6854cb454214172350a47361:p5MODLyhoJcI8zTY@cluster0.2cdsn0y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// --- Подключение к MongoDB ---
// Задайте MONGO_URI и SESSION_SECRET в настройках Vercel Environment Variables
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// --- Сессии в MongoDB ---
const store = new MongoDBSession({
  uri: MONGO_URI,
  collection: 'userSessions'
});

app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 дней
    secure: true,
    sameSite: 'none',
    httpOnly: true,
  }
}));



// СОЗДАНИЕ СХЕМ ДАННЫХ ДЛЯ КОЛЕКЦИЙ.
let schemaUsers = new mongoose.Schema({
    Name: String,
    Surname: String,
    Gender: String,
    Tel: String,
    Email: String,
    Password: String
},
{ 
    //Создание временных "марок"    
    timestamps: true 
});
let Users = mongoose.model('users', schemaUsers);


let schemaProducts = new mongoose.Schema({
    ImagePath: String,
    Name: String,
    Description: String,
    Price: Number,
    Category: String,
    Weight: Number
}, { 
    //Создание временных "марок"
    timestamps: true 
});
let Products = mongoose.model('products', schemaProducts);


// Схема корзины
const schemaBasketProducts = new mongoose.Schema({
    UserID: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'users' // Связь с коллекцией users
    },
    ProductID: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'products' // Связь с коллекцией products
    },
    Amount: Number,
}, {
    timestamps: true
});
let BasketProducts = mongoose.model('basket_products', schemaBasketProducts);


const schemaOrders = new mongoose.Schema({
    UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },

    BasketProducts: [{
        ProductID: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'products' // Связь с коллекцией products
        },
        Amount: Number
    }],
    
    OrderSummaryPrice: Number,
    OrderStatus: String
    
}, {
    timestamps: true
});
let Orders = mongoose.model('orders', schemaOrders);


//////// РОУТЫ



// GET
app.get('/users', async function (req, res) {
    

    let UsersObject = await Users.find({Gender: 'man'}).sort({ createdAt: -1});

    res.send(UsersObject);
});

app.get('/new_products', async function (req, res) {
    let NewProducts = await Products.find().sort({createdAt: -1}).limit(4);

    res.send(NewProducts);
});

app.get('/catalog', async function (req, res) {
    try {
        const { SelectedCategories, SelectedTypeOfSort } = req.query;

        // Формируем фильтрацию
        let filter = {};
        
        if (SelectedCategories) {
            filter.Category = { 
                $in: Array.isArray(SelectedCategories) ? SelectedCategories : [SelectedCategories] 
            };
        } 
        else {
            // Если категории не переданы - возвращаем пустой результат
            filter.Category = { $in: [] };
        }

        // Формируем сортировку
        let sort = {};
        if (SelectedTypeOfSort) {
            switch(SelectedTypeOfSort) {
                case 'New': 
                    sort.createdAt = -1;
                    break;
                case 'PriceIncrease': 
                    sort.Price = 1;
                    break;
                case 'PriceDecrease': 
                    sort.Price = -1;
                    break;
            }
        }

        const products = await Products.find(filter).sort(sort).lean();

        const basket_products = await BasketProducts.find({UserID: req.session.userId})

        // Добавляем флаг наличия в корзине
        products.forEach(product => {
          product.InBasket = basket_products.some(bp => 
            bp.ProductID.equals(product._id)
          );
        });
        
        console.log(products)

        res.json(products);

    } catch (error) {
        console.error('Ошибка при получении каталога:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/me', async (req, res) => {
    try {
        //Проверка наличия сессии (пользовательского ID сохраненного в ней)
        if (!req.session.userId)
        return res.status(401).json({ message: 'Данная страница доступна только авторизованным пользователям' });
        
        //Получаем пользователя из его ID
        const user = await Users.findById(req.session.userId).select('-Password -createdAt -updatedAt -__v').lean();
        
        //Успех
        res.status(200).json({ user }); 

    } catch (error) {
        console.error('Ошибка в /api/me:', error);  

        res.status(500).json({ message: 'Внутренная ошибка сервера' });
    }
});

app.get('/basket_products', async function(req, res) {
    let { User_id } = req.query;

    let BasketProductsObject = await BasketProducts.find({ UserID: User_id })
    .populate({
        path: 'ProductID', 
        select: 'ImagePath Name Description Price Weight' // Выбираем нужные поля
    }).sort({createdAt: -1});

    res.send(BasketProductsObject); 

});



// POST
app.post('/registration', async function (req, res) {
    try {
        let Name = req.body.Name;
        let Surname = req.body.Surname;
        let Email = req.body.Email;
        let Tel = req.body.Tel;
        let Password = req.body.Password;
    

        //Проверяем наличие данных
        if (!Name || !Surname || !Email || !Tel || !Password ) {
            res.sendStatus(400);
            return;
        };

        
        //Проверяем наличие уже зарегистриованного пользователя (По Телефону, и Почте)
        let UserIsAlreadyExist = await Users.findOne({Tel: Tel}) 
        if (UserIsAlreadyExist) {
            return res.status(400).json({ 
                type: "error",
                message: 'Пользователь с данным номером телефона уже зарегистрирован' 
            });
        }
        else {
            UserIsAlreadyExist = await Users.findOne({Email: Email})
            if (UserIsAlreadyExist) {
                return res.status(400).json({ 
                    type: "error",
                    message: 'Пользователь с данным почтой уже зарегистрирован' 
                });
            }
        }

        
        //Создаем "нового пользователя", в которого записываем все данные
        let user = new Users({
            Name: Name,
            Surname: Surname,
            Email: Email,
            Tel: Tel,
            Password: await bcrypt.hash(Password, 10)
        });



        //Добавляем в БД
        await user.save();
      
        //Отправляем статус коды и сообщения
        res.status(201).json({
            type: "success",
            message: 'Вы успешно зарегистрированы',
            userId: user._id
        });
    
    } catch (error) {
    res.status(500).json({
        type: "error",
        message: 'Внутренняя ошибка сервера',
        error: error.message
    })
}
});

app.post('/login', async function(req, res) {

    try {
        let Email = req.body.Email;
        let Password = req.body.Password;
    
        //Проверяем наличие данных
        if (!Email || !Password ) {
            return res.status(400).json({ 
                type: "error",
                message: 'Неправильное написание почты или пароля' 
            });
        };

        let User = await Users.findOne({'Email': Email});

        if (!User) {
            return res.status(401).json({ 
                type: "error",
                message: 'Неверная почта или пароль' 
            });
        }

        let PasswordMatch = await bcrypt.compare(Password, User.Password);

        if (PasswordMatch) {
            req.session.isAuth = true; // Создаем сессию (тем, что добавляем в него что ни-будь)
            req.session.userId = User._id; // Сохраняем ID пользователя

            console.log(req.session.userId);
            
            // Отправляем успешный ответ
            res.status(200).json({
                type: "success",
                message: 'Вы вошли в свою учетную запись',
                user: { id: User._id, email: User.Email }
            });
            
        } else {
            // Отправляем сообщение об ошибке
            res.status(401).json({ 
                type: "error",
                message: 'Неверная почта или пароль' 
            });
        }
    
    } catch (error) {
        // Отправляем сообщение об ошибке
        res.status(500).json({
            type: "error",
            message: 'Внутренняя ошибка сервера',
            error: error.message
        });
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Ошибка при выходе из системы' });
        
        res.clearCookie('connect.sid'); // Очистка куки сессии
        res.status(200).json({ message: 'Вы успешно вышли из системы' });
    });
});

app.post('/basket_products', async function(req,res) {
    let { Product_id, User_id } = req.body;

    let basket_product = new BasketProducts({
        UserID: new mongoose.Types.ObjectId(User_id), // Конвертируем строку в ObjectId
        ProductID: new mongoose.Types.ObjectId(Product_id),
        Amount: 1
    });

    await basket_product.save();
    res.sendStatus(201);
});

app.post('/making_order', async function(req, res) {
    try {
        const userId = req.session.userId;
        
        // Получаем товары из корзины пользователя
        const basketProducts = await BasketProducts.find({ UserID: userId })
            .populate({
                path: 'ProductID',
                select: 'Price' // Получаем только цену для расчета
            });

        // Проверяем, что корзина не пуста
        if (basketProducts.length === 0) {
            return res.status(400).json({ 
                type: "error",
                message: 'Корзина пуста' 
            });
        }

        // Формируем массив товаров для заказа
        const orderProducts = basketProducts.map(item => ({
            ProductID: item.ProductID._id,
            Amount: item.Amount
        }));

        // Рассчитываем общую сумму заказа
        const summaryPrice = basketProducts.reduce((total, item) => {
            return total + (item.ProductID.Price * item.Amount);
        }, 0);

        // Создаем новый заказ
        const order = new Orders({
            UserID: userId,
            BasketProducts: orderProducts,
            OrderSummaryPrice: summaryPrice,
            OrderStatus: 'Ожидает подтверждения'
        });

        // Сохраняем заказ в базе данных
        await order.save();

        // Очищаем корзину пользователя
        await BasketProducts.deleteMany({ UserID: userId });

        // Отправляем успешный ответ
        res.status(201).json({
            type: "success",
            message: 'Заказ успешно оформлен',
            orderId: order._id,
            summaryPrice: summaryPrice
        });

    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        res.status(500).json({
            type: "error",
            message: 'Внутренняя ошибка сервера при оформлении заказа',
            error: error.message
        });
    }
});


// PATCH
app.patch('/basket_products/change_amount', async function(req,res) {
    let { BasketProduct_id, Operation } = req.body;

    let basket_product = await BasketProducts.findById(BasketProduct_id)

    if (Operation == "Plus") {
        basket_product.Amount += 1;
    } else {
        basket_product.Amount -= 1;
    }

    await basket_product.save();
    res.sendStatus(201);
});

//DELETE
app.delete('/basket_products/delete', async function(req,res) {
    let { Product_id } = req.body;

    await BasketProducts.deleteOne({
        UserID: req.session.userId, 
        ProductID: new mongoose.Types.ObjectId(Product_id)
    })

    res.sendStatus(200);
})


// В конце экспортируем handler
module.exports = app
module.exports.handler = serverless(app)