import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class postImages1635638375210 implements MigrationInterface {
  private table = new Table({
    name: 'post_images',
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
        name: 'image',
        type: 'varchar',
        isNullable: false,
      },
      {
        name: 'post_id',
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
  private post_id_fk = new TableForeignKey({
    columnNames: ['post_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'posts',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);

    await queryRunner.createForeignKey('post_images', this.post_id_fk);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('post_images', this.post_id_fk);
    await queryRunner.dropTable(this.table);
  }
}
