import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigrations1747654189266 implements MigrationInterface {
    name = 'InitialMigrations1747654189266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "name" character varying, "password" character varying, "is_confirmed" boolean, "roleId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_permissions_permission" ("userId" uuid NOT NULL, "permissionId" uuid NOT NULL, CONSTRAINT "PK_8dd49853fbad35f9a0f91b11877" PRIMARY KEY ("userId", "permissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5b72d197d92b8bafbe7906782e" ON "user_permissions_permission" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c43a6a56e3ef281cbfba9a7745" ON "user_permissions_permission" ("permissionId") `);
        await queryRunner.query(`CREATE TABLE "user_subscribers_user" ("userId_1" uuid NOT NULL, "userId_2" uuid NOT NULL, CONSTRAINT "PK_54c8aba4577ac423c9b8e0c86e2" PRIMARY KEY ("userId_1", "userId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e4b0ce79dc216dc1867ae46112" ON "user_subscribers_user" ("userId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_b8b6bb16fb50ccbfb4f57517a6" ON "user_subscribers_user" ("userId_2") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_permissions_permission" ADD CONSTRAINT "FK_5b72d197d92b8bafbe7906782ec" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_permissions_permission" ADD CONSTRAINT "FK_c43a6a56e3ef281cbfba9a77457" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_subscribers_user" ADD CONSTRAINT "FK_e4b0ce79dc216dc1867ae461126" FOREIGN KEY ("userId_1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_subscribers_user" ADD CONSTRAINT "FK_b8b6bb16fb50ccbfb4f57517a6b" FOREIGN KEY ("userId_2") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_subscribers_user" DROP CONSTRAINT "FK_b8b6bb16fb50ccbfb4f57517a6b"`);
        await queryRunner.query(`ALTER TABLE "user_subscribers_user" DROP CONSTRAINT "FK_e4b0ce79dc216dc1867ae461126"`);
        await queryRunner.query(`ALTER TABLE "user_permissions_permission" DROP CONSTRAINT "FK_c43a6a56e3ef281cbfba9a77457"`);
        await queryRunner.query(`ALTER TABLE "user_permissions_permission" DROP CONSTRAINT "FK_5b72d197d92b8bafbe7906782ec"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b8b6bb16fb50ccbfb4f57517a6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e4b0ce79dc216dc1867ae46112"`);
        await queryRunner.query(`DROP TABLE "user_subscribers_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c43a6a56e3ef281cbfba9a7745"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5b72d197d92b8bafbe7906782e"`);
        await queryRunner.query(`DROP TABLE "user_permissions_permission"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "permission"`);
    }

}
