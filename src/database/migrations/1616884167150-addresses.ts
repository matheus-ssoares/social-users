import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class address1616884061155 implements MigrationInterface {

    private table = new Table({
        name: 'addresses',
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
                name: 'address_title',
                type: 'varchar',
                isNullable: false,
            },
            {
                name: 'country',
                type: 'varchar',
                isNullable: false,
            },
            {
                name: 'state',
                type: 'varchar',
                isNullable: false,
                isUnique: true,
            },
            {
                name: 'city',
                type: 'varchar',
                isNullable: false,
                isUnique: true,
            },
            {
                name: 'neighborhood',
                type: 'varchar',
                isNullable: false,
                isUnique: true,
            },
            {
                name: 'zip_code',
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
        await queryRunner.createForeignKey('addresses', this.user_id_fk);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.table);
        await queryRunner.dropForeignKey('addresses', this.user_id_fk);

    }

}
