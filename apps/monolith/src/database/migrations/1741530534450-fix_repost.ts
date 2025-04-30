import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRepost1741530534450 implements MigrationInterface {
    name = 'FixRepost1741530534450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "repost" ADD "repostedById" uuid`);
        await queryRunner.query(`ALTER TABLE "repost" ADD CONSTRAINT "UQ_0d99aa88a9b024dc3601eb61178" UNIQUE ("repostedById")`);
        await queryRunner.query(`ALTER TABLE "repost" ADD CONSTRAINT "FK_0d99aa88a9b024dc3601eb61178" FOREIGN KEY ("repostedById") REFERENCES "quote"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "repost" DROP CONSTRAINT "FK_0d99aa88a9b024dc3601eb61178"`);
        await queryRunner.query(`ALTER TABLE "repost" DROP CONSTRAINT "UQ_0d99aa88a9b024dc3601eb61178"`);
        await queryRunner.query(`ALTER TABLE "repost" DROP COLUMN "repostedById"`);
    }

}
