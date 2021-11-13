import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Post1635637861194 implements MigrationInterface {
  private table = new Table({
    name: 'posts',
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
        name: 'content',
        type: 'varchar',
        isNullable: false,
      },
      {
        name: 'image',
        type: 'varchar',
        isNullable: false,
      },
      {
        name: 'user_id',
        type: 'uuid',
        generationStrategy: 'uuid',
        default: `uuid_generate_v4()`,
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
    onUpdate: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);

    await queryRunner.createForeignKey('posts', this.user_id_fk);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('posts', this.user_id_fk);
    await queryRunner.dropTable(this.table);
  }
}
