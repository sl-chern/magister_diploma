import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCascadeDelete1748782201621 implements MigrationInterface {
    name = 'AddedCascadeDelete1748782201621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "repost" DROP CONSTRAINT "FK_84f0c074e33a08ded99364b1976"`);
        await queryRunner.query(`ALTER TABLE "repost" DROP CONSTRAINT "FK_0d99aa88a9b024dc3601eb61178"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_a10be5d7c10ff2d7293e8cefe14"`);
        await queryRunner.query(`ALTER TABLE "repost" ADD CONSTRAINT "FK_84f0c074e33a08ded99364b1976" FOREIGN KEY ("postId") REFERENCES "quote"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "repost" ADD CONSTRAINT "FK_0d99aa88a9b024dc3601eb61178" FOREIGN KEY ("repostedById") REFERENCES "quote"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_a10be5d7c10ff2d7293e8cefe14" FOREIGN KEY ("quoteId") REFERENCES "quote"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_a10be5d7c10ff2d7293e8cefe14"`);
        await queryRunner.query(`ALTER TABLE "repost" DROP CONSTRAINT "FK_0d99aa88a9b024dc3601eb61178"`);
        await queryRunner.query(`ALTER TABLE "repost" DROP CONSTRAINT "FK_84f0c074e33a08ded99364b1976"`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_a10be5d7c10ff2d7293e8cefe14" FOREIGN KEY ("quoteId") REFERENCES "quote"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "repost" ADD CONSTRAINT "FK_0d99aa88a9b024dc3601eb61178" FOREIGN KEY ("repostedById") REFERENCES "quote"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "repost" ADD CONSTRAINT "FK_84f0c074e33a08ded99364b1976" FOREIGN KEY ("postId") REFERENCES "quote"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
