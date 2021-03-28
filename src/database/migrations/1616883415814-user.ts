import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class users1611935547434 implements MigrationInterface {
    private table = new Table({
        name: 'users',
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
                name: 'name',
                type: 'varchar',
                isNullable: false,
            },
            {
                name: 'email',
                type: 'varchar',
                isNullable: false,
                isUnique: true,
            },
            {
                name: 'password',
                type: 'varchar',
                isNullable: false,
            },
            {
                name: 'birth_date',
                type: 'varchar',
                isNullable: false,
            },
            {
                name: 'gender',
                type: 'enum',
                enum: ['M', 'F'],
                isNullable: false,
            },
            {
                name: 'document',
                type: 'varchar',
                isNullable: false,
            },
            {
                name: 'image',
                type: 'varchar',
                isNullable: false,
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

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await queryRunner.createTable(this.table);


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.table);
    }
}
