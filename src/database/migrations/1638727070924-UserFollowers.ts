import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class UserFollowers1638727070924 implements MigrationInterface {
  private table = new Table({
    name: 'user_followers',
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
        name: 'follower_id',
        type: 'uuid',
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
  private follower_id_fk = new TableForeignKey({
    columnNames: ['follower_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'users',
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
    await queryRunner.createForeignKey('user_followers', this.follower_id_fk);
    await queryRunner.createForeignKey('user_followers', this.user_id_fk);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
    await queryRunner.dropForeignKey('user_followers', this.follower_id_fk);
    await queryRunner.dropForeignKey('user_followers', this.user_id_fk);
  }
}
