import { MigrationInterface, QueryRunner } from "typeorm";

export class FixNotification1746788173244 implements MigrationInterface {
    name = 'FixNotification1746788173244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_notifications_notification" ("userId" uuid NOT NULL, "notificationId" uuid NOT NULL, CONSTRAINT "PK_c20252416bdb7d05d0211bd461b" PRIMARY KEY ("userId", "notificationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_56b86b108a28ba4750417373d9" ON "user_notifications_notification" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_022bdca3318f2257b5ae15c173" ON "user_notifications_notification" ("notificationId") `);
        await queryRunner.query(`ALTER TABLE "user_notifications_notification" ADD CONSTRAINT "FK_56b86b108a28ba4750417373d90" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_notifications_notification" ADD CONSTRAINT "FK_022bdca3318f2257b5ae15c1738" FOREIGN KEY ("notificationId") REFERENCES "notification"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_notifications_notification" DROP CONSTRAINT "FK_022bdca3318f2257b5ae15c1738"`);
        await queryRunner.query(`ALTER TABLE "user_notifications_notification" DROP CONSTRAINT "FK_56b86b108a28ba4750417373d90"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_022bdca3318f2257b5ae15c173"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_56b86b108a28ba4750417373d9"`);
        await queryRunner.query(`DROP TABLE "user_notifications_notification"`);
    }

}
