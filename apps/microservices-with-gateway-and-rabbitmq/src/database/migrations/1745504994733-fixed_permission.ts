import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedPermission1745504994733 implements MigrationInterface {
    name = 'FixedPermission1745504994733'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_permissions_permission" ("userId" uuid NOT NULL, "permissionId" uuid NOT NULL, CONSTRAINT "PK_8dd49853fbad35f9a0f91b11877" PRIMARY KEY ("userId", "permissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5b72d197d92b8bafbe7906782e" ON "user_permissions_permission" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c43a6a56e3ef281cbfba9a7745" ON "user_permissions_permission" ("permissionId") `);
        await queryRunner.query(`ALTER TABLE "user_permissions_permission" ADD CONSTRAINT "FK_5b72d197d92b8bafbe7906782ec" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_permissions_permission" ADD CONSTRAINT "FK_c43a6a56e3ef281cbfba9a77457" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_permissions_permission" DROP CONSTRAINT "FK_c43a6a56e3ef281cbfba9a77457"`);
        await queryRunner.query(`ALTER TABLE "user_permissions_permission" DROP CONSTRAINT "FK_5b72d197d92b8bafbe7906782ec"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c43a6a56e3ef281cbfba9a7745"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5b72d197d92b8bafbe7906782e"`);
        await queryRunner.query(`DROP TABLE "user_permissions_permission"`);
        await queryRunner.query(`DROP TABLE "permission"`);
    }

}
