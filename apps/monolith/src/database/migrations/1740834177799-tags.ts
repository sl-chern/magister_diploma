import { MigrationInterface, QueryRunner } from "typeorm";

export class Tags1740834177799 implements MigrationInterface {
    name = 'Tags1740834177799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quote_tags_tag" ("quoteId" uuid NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "PK_db2b82a087a326a89198b227a3a" PRIMARY KEY ("quoteId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_86f787b1897bdc8bdb0116fad9" ON "quote_tags_tag" ("quoteId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4d829377e2340f55530c973bf9" ON "quote_tags_tag" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "quote_tags_tag" ADD CONSTRAINT "FK_86f787b1897bdc8bdb0116fad92" FOREIGN KEY ("quoteId") REFERENCES "quote"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "quote_tags_tag" ADD CONSTRAINT "FK_4d829377e2340f55530c973bf9e" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quote_tags_tag" DROP CONSTRAINT "FK_4d829377e2340f55530c973bf9e"`);
        await queryRunner.query(`ALTER TABLE "quote_tags_tag" DROP CONSTRAINT "FK_86f787b1897bdc8bdb0116fad92"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4d829377e2340f55530c973bf9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86f787b1897bdc8bdb0116fad9"`);
        await queryRunner.query(`DROP TABLE "quote_tags_tag"`);
    }

}
