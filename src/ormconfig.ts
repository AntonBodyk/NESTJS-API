import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";

const config: PostgresConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'mediumclone',
    password: '12345',
    database: 'mediumclone',
    entities: [__dirname + '/**/*.entity{.ts, .js}'],            //нужно указывать шоб читались все сущности + поддерживает файлы с расширениями тс и джс
    synchronize: false,                   //если в true то при старте приложения генерится БД
    migrations: [__dirname + '/migrations/**/*{.ts, .js}']
}

export default config;