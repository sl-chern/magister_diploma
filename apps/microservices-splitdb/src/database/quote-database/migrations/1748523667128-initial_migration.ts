import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1748523667128 implements MigrationInterface {
    name = 'InitialMigration1748523667128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user" uuid NOT NULL, "quoteId" uuid, CONSTRAINT "PK_eff3e46d24d416b52a7e0ae4159" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quote" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "history" character varying NOT NULL, "author" uuid NOT NULL, CONSTRAINT "PK_b772d4cb09e587c8c72a78d2439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "repost" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postId" uuid, "repostedById" uuid, CONSTRAINT "REL_0d99aa88a9b024dc3601eb6117" UNIQUE ("repostedById"), CONSTRAINT "PK_abfcbb696914c514fca81f8cc0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quote_tags_tag" ("quoteId" uuid NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "PK_db2b82a087a326a89198b227a3a" PRIMARY KEY ("quoteId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_86f787b1897bdc8bdb0116fad9" ON "quote_tags_tag" ("quoteId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4d829377e2340f55530c973bf9" ON "quote_tags_tag" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_a10be5d7c10ff2d7293e8cefe14" FOREIGN KEY ("quoteId") REFERENCES "quote"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "repost" ADD CONSTRAINT "FK_84f0c074e33a08ded99364b1976" FOREIGN KEY ("postId") REFERENCES "quote"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "repost" ADD CONSTRAINT "FK_0d99aa88a9b024dc3601eb61178" FOREIGN KEY ("repostedById") REFERENCES "quote"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quote_tags_tag" ADD CONSTRAINT "FK_86f787b1897bdc8bdb0116fad92" FOREIGN KEY ("quoteId") REFERENCES "quote"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "quote_tags_tag" ADD CONSTRAINT "FK_4d829377e2340f55530c973bf9e" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quote_tags_tag" DROP CONSTRAINT "FK_4d829377e2340f55530c973bf9e"`);
        await queryRunner.query(`ALTER TABLE "quote_tags_tag" DROP CONSTRAINT "FK_86f787b1897bdc8bdb0116fad92"`);
        await queryRunner.query(`ALTER TABLE "repost" DROP CONSTRAINT "FK_0d99aa88a9b024dc3601eb61178"`);
        await queryRunner.query(`ALTER TABLE "repost" DROP CONSTRAINT "FK_84f0c074e33a08ded99364b1976"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_a10be5d7c10ff2d7293e8cefe14"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4d829377e2340f55530c973bf9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86f787b1897bdc8bdb0116fad9"`);
        await queryRunner.query(`DROP TABLE "quote_tags_tag"`);
        await queryRunner.query(`DROP TABLE "repost"`);
        await queryRunner.query(`DROP TABLE "quote"`);
        await queryRunner.query(`DROP TABLE "like"`);
        await queryRunner.query(`DROP TABLE "tag"`);
    }

}
