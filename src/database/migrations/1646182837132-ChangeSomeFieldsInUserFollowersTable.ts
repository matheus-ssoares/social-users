import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeSomeFieldsInUserFollowersTable1646182837132
  implements MigrationInterface
{
  private follower_id = new TableColumn({
    name: 'follower_id',
    type: 'uuid',
    isNullable: false,
    isUnique: false,
  });
  private user_id = new TableColumn({
    name: 'user_id',
    type: 'uuid',
    isNullable: false,
    isUnique: false,
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user_followers',
      'follower_id',
      this.follower_id
    );
    await queryRunner.changeColumn('user_followers', 'user_id', this.user_id);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
