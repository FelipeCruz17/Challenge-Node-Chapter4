import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AlterStatement1642854036391 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn("statements",
        new TableColumn({
          name: "sender_id",
          type: "uuid",
          isNullable: true
        })
      )

      await queryRunner.changeColumn(
        "statements",
        "type",
        new TableColumn({
          name: 'type',
          type: 'enum',
          enum: ['deposit', 'withdraw', 'transfer']
        })
      )

      await queryRunner.createForeignKey(
        "statements",
        new TableForeignKey({
          name: "FKStatementSender",
          referencedTableName: "users",
          referencedColumnNames: ['id'],
          columnNames: ["sender_id"],
          onDelete: "SET NULL",
          onUpdate: "SET NULL"
        })
      )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey("statements", "FKStatementSender");

      await queryRunner.changeColumn("statements", "type",
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['deposit', 'withdraw']
      }))

      await queryRunner.dropColumn("statements", "sender_id")
  }
}
