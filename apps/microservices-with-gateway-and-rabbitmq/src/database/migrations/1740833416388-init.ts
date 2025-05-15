import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1740833416388 implements MigrationInterface {
    name = 'Init1740833416388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "repost" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postId" uuid, CONSTRAINT "PK_abfcbb696914c514fca81f8cc0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "quoteId" uuid, CONSTRAINT "PK_eff3e46d24d416b52a7e0ae4159" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quote" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "history" character varying NOT NULL, "authorId" uuid, CONSTRAINT "PK_b772d4cb09e587c8c72a78d2439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text NOT NULL, "senderId" uuid, "recipientId" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "name" character varying, "password" character varying, "is_confirmed" boolean, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_permissions_permissions" ("userId" uuid NOT NULL, "permissionsId" uuid NOT NULL, CONSTRAINT "PK_7956116f243e6a992116a9a0d28" PRIMARY KEY ("userId", "permissionsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fda6319802c1f2ee76062558e2" ON "user_permissions_permissions" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7abe4436bf16103efb3d851b94" ON "user_permissions_permissions" ("permissionsId") `);
        await queryRunner.query(`CREATE TABLE "user_subscribers_user" ("userId_1" uuid NOT NULL, "userId_2" uuid NOT NULL, CONSTRAINT "PK_54c8aba4577ac423c9b8e0c86e2" PRIMARY KEY ("userId_1", "userId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e4b0ce79dc216dc1867ae46112" ON "user_subscribers_user" ("userId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_b8b6bb16fb50ccbfb4f57517a6" ON "user_subscribers_user" ("userId_2") `);
        await queryRunner.query(`ALTER TABLE "repost" ADD CONSTRAINT "FK_84f0c074e33a08ded99364b1976" FOREIGN KEY ("postId") REFERENCES "quote"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_e8fb739f08d47955a39850fac23" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_a10be5d7c10ff2d7293e8cefe14" FOREIGN KEY ("quoteId") REFERENCES "quote"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quote" ADD CONSTRAINT "FK_36e9a62b8710aa5069bacd8c601" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_bc096b4e18b1f9508197cd98066" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_445b786f516688cf2b81b8981b6" FOREIGN KEY ("recipientId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_permissions_permissions" ADD CONSTRAINT "FK_fda6319802c1f2ee76062558e22" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_permissions_permissions" ADD CONSTRAINT "FK_7abe4436bf16103efb3d851b94a" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_subscribers_user" ADD CONSTRAINT "FK_e4b0ce79dc216dc1867ae461126" FOREIGN KEY ("userId_1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_subscribers_user" ADD CONSTRAINT "FK_b8b6bb16fb50ccbfb4f57517a6b" FOREIGN KEY ("userId_2") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_subscribers_user" DROP CONSTRAINT "FK_b8b6bb16fb50ccbfb4f57517a6b"`);
        await queryRunner.query(`ALTER TABLE "user_subscribers_user" DROP CONSTRAINT "FK_e4b0ce79dc216dc1867ae461126"`);
        await queryRunner.query(`ALTER TABLE "user_permissions_permissions" DROP CONSTRAINT "FK_7abe4436bf16103efb3d851b94a"`);
        await queryRunner.query(`ALTER TABLE "user_permissions_permissions" DROP CONSTRAINT "FK_fda6319802c1f2ee76062558e22"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_445b786f516688cf2b81b8981b6"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_bc096b4e18b1f9508197cd98066"`);
        await queryRunner.query(`ALTER TABLE "quote" DROP CONSTRAINT "FK_36e9a62b8710aa5069bacd8c601"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_a10be5d7c10ff2d7293e8cefe14"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_e8fb739f08d47955a39850fac23"`);
        await queryRunner.query(`ALTER TABLE "repost" DROP CONSTRAINT "FK_84f0c074e33a08ded99364b1976"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b8b6bb16fb50ccbfb4f57517a6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e4b0ce79dc216dc1867ae46112"`);
        await queryRunner.query(`DROP TABLE "user_subscribers_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7abe4436bf16103efb3d851b94"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fda6319802c1f2ee76062558e2"`);
        await queryRunner.query(`DROP TABLE "user_permissions_permissions"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "quote"`);
        await queryRunner.query(`DROP TABLE "like"`);
        await queryRunner.query(`DROP TABLE "repost"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
    }

}
