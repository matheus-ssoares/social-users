import { MigrationInterface, QueryRunner, TableForeignKey, Table } from "typeorm";

export class contacts1616884666426 implements MigrationInterface {
    private table = new Table({
        name: 'contacts',
        columns: [
            {
                name: 'id',
                type: 'uuid',
                isPrimary: true,
                isGenerated: true,
                isNullable: false,
                isUnique: true,
                generationStrategy: 'uuid',
                default: `uuid_generate_v4()`,
            },
            {
                name: 'contact_name',
                type: 'varchar',
                isNullable: false,
            },
            {
                name: 'phone',
                type: 'varchar',
                isNullable: false,
                isUnique: true,
            },
            {
                name: 'user_id',
                type: 'uuid',
                isNullable: false,
                isUnique: true,
            },
            {
                name: 'created_at',
                type: 'timestamptz',
                isNullable: false,
                default: 'now()',
            },
            {
                name: 'updated_at',
                type: 'timestamptz',
                isNullable: false,
                default: 'now()',
            },
        ],
    });
    private user_id_fk = new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.table);
        await queryRunner.createForeignKey('contacts', this.user_id_fk);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('contacts', this.user_id_fk);
        await queryRunner.dropTable(this.table);

    }

}
