# Jointbook Telegram bookstore-bot for Minter network users

### Features:
- opens wallets to new users;
- allows you to recharge your wallet via QIWI;
- sells books posted through the admin panel;
- accepts payment in BIP;
- allows to download the purchased books;
- credits the proceeds to a book wallet;
- regularly transfers the proceeds from the book wallet to the main wallet of the store.

**The bot runs on Node.js with a PostgreSQL database.**

#### Installing the bot on a LINUX server:
- It is recommended to upload a copy of the files to your LINUX server, e.g. Ubuntu 16.04, and install the PostgreSQL database.
- Create a database and its user, save this data.
- Create your own bot via Telegram BotFather, save its token.
- To change all parameters (telegram bot token, qiwi secretKey, qiwi publicKey, adminPanel credentials) you need to change the file debug.json.

To do this, you must enter the command in the root of the project:

**nano config/debug.json**

Fill in the fields with the required data:

- "token": "YOUR_TOKEN" - bot token from BotFather
- "dbConfig."
* - "dbName": "YOUR_DB_NAME" is your database name.
* - "userName": "YOUR_DB_USERNAME" - the user name of your database.
* - "password": "YOUR_DB_PASSWORD" - your database user password.
- "credentials." {
* - "login": "YOUR_ADMIN_USERNAME" - your administrator's login (adding/deleting authors and books, laying out books).
* - "password": "YOUR_ADMIN_PASSWORD" - administrator password },
- "qiwi." {
* - "secretKey": "YOUR_QIWI_SECRET_KEY" is the secret key of your QIWI wallet.
* - "publicKey": "YOUR_QIWI_PUBLIC_KEY" is your QIWI wallet public key },
- "mainWalletMnemonic." "12_WORDS_SEED_PHRASE" is a cide-phrase of the bot's main wallet.
- "bipRate": 1 - QIWI to BIP exchange rate
- "bitsCost." { - offered to the user volumes of refill of a purse in rubles, by default 1, 5 and 10 rubles
* - "1": 1,
* - "5": 5,
* - "10": 10 },
- "billDurationMillis." 1800000 - QIWI account lifetime
- "ownerTelegramId": - bot owner ID }

#### Setting the bot's dependencies:
**npm install**

To run under LINUX you need to write a command at the root of the project:

**sudo NODE_ENV=debug node index.js & disown**

Log on to your server IP and you will be taken to the administrator page (you will have to enter the administrator login and password you set in debug.json file).

There you will be able to add authors and books, and open books for sale.

Enter your bot and you will see the books displayed in the admin panel.

#### Additional settings:
Languages:
The languages folder is at the root of the project. There are language files in this folder.

To add your own language, you need to take any of the files in this folder and copy it, calling them language initials (IMPORTANT: you need to specify the file name in 2-3 letters, which should also be used inside this file in the line "code": "EN" (case does not matter)). Then it is necessary to fill in all fields of the created file in the language that is added.

#### Manual work with the database:
To connect to the database enter the command:

**psql**

Then you need to connect to the user:

**\c NAME**

Viewing tables:
**\dt**

View data from the table:
**select * from <table_name>;**

**_It is highly discouraged to change the data manually._**

## Телеграм-бот книжного магазина для пользователей сети Minter.

### Возможности:

- открывает кошельки новым пользователям;
- позволяет пополнять кошелек через QIWI;
- продает книги, выложенные через админ-панель;
- принимает оплату в BIP;
- позволяет скачать приобретенные книги;
- зачисляет выручку на кошелек книги;
- регулярно переводит выручку с кошелька книги на главный кошелек магазина

**Бот работает на Node.js с базой данных PostgreSQL.**

#### Установка бота на LINUX сервер:

- Рекомендуется загрузить копию файлов на ваш LINUX сервер, например, Ubuntu 16.04, и установить БД PostgreSQL.
- Создать базу данных и ее пользователя, сохранить эти данные.
- Через Телеграм-бота BotFather создать своего бота, сохранить его токен.
- Для изменения всех параметров (telegram bot token, qiwi secretKey, qiwi publicKey, adminPanel credentials) нужно изменить файл debug.json.

Для этого необходимо в корне проекта ввести команду:

**nano config/debug.json**

Заполните нужными данными поля:
- "token": "YOUR_TOKEN" - токен бота из BotFather
- "dbConfig":

* - "dbName": "YOUR_DB_NAME" - имя вашей БД

* - "userName": "YOUR_DB_USERNAME" - имя пользователя вашей БД
* - "password": "YOUR_DB_PASSWORD" - пароль пользователя вашей БД
- "credentials": {
* - "login": "YOUR_ADMIN_USERNAME" - логин вашего администратора (добавление/удаление авторов и книг, выкладка книг)
* - "password": "YOUR_ADMIN_PASSWORD" - пароль администратора
},
- "qiwi": {
* - "secretKey": "YOUR_QIWI_SECRET_KEY" - секретный ключ вашего QIWI-кошелька
* - "publicKey": "YOUR_QIWI_PUBLIC_KEY" - открытый ключ вашего QIWI-кошелька
},
- "mainWalletMnemonic": "12_WORDS_SEED_PHRASE" - сид-фраза главного кошелька бота
- "bipRate": 1 - курс обмена QIWI на BIP
- "bitsCost": { - предлагаемые пользователю объемы пополнения кошелька в рублях, по умолчанию 1, 5 и 10 рублей
* - "1": 1,
* - "5": 5,
* - "10": 10
},
- "billDurationMillis": 1800000 - время жизни счета QIWI
- "ownerTelegramId": - ID владельца бота
}

#### Установка зависимостей бота:

**npm install**

Для запуска под LINUX необходимо в корне проекта написать команду:

**sudo NODE_ENV=debug node index.js & disown**

Зайдите на IP вашего сервера и вы попадете на страницу администратора (придется ввести установленный вами в файле debug.json логин и пароль администратора).

Там вы сможете добавить авторов и книги, а также открыть книги для продажи.

Заходите в вашего бота и увидете выставленные через панель администратора книги.

### Дополнительные настройки:

#### Языки: 
В корне проекта лежит папка languages. В ней лежат файлы с языками.

Чтоб добавить свой язык, необходимо взять любой из файлов из этой папки и скопировать его, назвав инициалами языка
(**ВАЖНО:** необходимо указывать название файла 2-3 буквами, которые также необходимо использовать внутри этого файла в строке "code":
"EN" (регистр не имеет значения)). Далее необходимо заполнить все поля созданного файла на том языке, который добавляется.

#### Ручная работа с БД:

Для подключения к БД ввести команду:

**psql**

Далее необходимо подключиться к пользователю: 

**\c ИМЯ**

Просмотр таблиц:   
**\dt**

Просмотр данных из таблицы:   
**select * from <table_name>;**

**_Изменять данные вручную крайне не рекомендуется._**
