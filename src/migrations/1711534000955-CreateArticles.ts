import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateArticles1711534000955 implements MigrationInterface {
    name = 'CreateArticles1711534000955'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "articles" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "body" character varying NOT NULL DEFAULT '', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tagList" text NOT NULL, "favoritesCount" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "bio" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "img" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "img" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "bio" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`DROP TABLE "articles"`);
    }

}
