import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsers1711204141389 implements MigrationInterface {
    name = 'CreateUsers1711204141389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "bio" character varying NOT NULL DEFAULT '', "img" character varying NOT NULL DEFAULT '', "password" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
