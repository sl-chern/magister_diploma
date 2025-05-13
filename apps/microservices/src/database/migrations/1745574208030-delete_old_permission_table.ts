import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteOldPermissionTable1745574208030
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_permissions_permissions" DROP CONSTRAINT "FK_7abe4436bf16103efb3d851b94a"`);
    await queryRunner.query(`ALTER TABLE "user_permissions_permissions" DROP CONSTRAINT "FK_fda6319802c1f2ee76062558e22"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7abe4436bf16103efb3d851b94"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fda6319802c1f2ee76062558e2"`);
    await queryRunner.query(`DROP TABLE "user_permissions_permissions"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "user_permissions_permissions" ("userId" uuid NOT NULL, "permissionsId" uuid NOT NULL, CONSTRAINT "PK_7956116f243e6a992116a9a0d28" PRIMARY KEY ("userId", "permissionsId"))`);
    await queryRunner.query(`CREATE INDEX "IDX_fda6319802c1f2ee76062558e2" ON "user_permissions_permissions" ("userId") `);
    await queryRunner.query(`CREATE INDEX "IDX_7abe4436bf16103efb3d851b94" ON "user_permissions_permissions" ("permissionsId") `);
    await queryRunner.query(`ALTER TABLE "user_permissions_permissions" ADD CONSTRAINT "FK_fda6319802c1f2ee76062558e22" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "user_permissions_permissions" ADD CONSTRAINT "FK_7abe4436bf16103efb3d851b94a" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }
}
