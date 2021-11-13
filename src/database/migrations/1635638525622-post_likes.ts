import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class postLikes1635638525622 implements MigrationInterface {
  private table = new Table({
    name: 'post_likes',
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
        name: 'post_id',
        type: 'uuid',
        generationStrategy: 'uuid',
        default: `uuid_generate_v4()`,
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
  private post_id_fk = new TableForeignKey({
    columnNames: ['post_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'posts',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
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

    await queryRunner.createForeignKey('post_likes', this.post_id_fk);
    await queryRunner.createForeignKey('post_likes', this.user_id_fk);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('post_likes', this.post_id_fk);
    await queryRunner.dropForeignKey('post_likes', this.user_id_fk);
    await queryRunner.dropTable(this.table);
  }
}
