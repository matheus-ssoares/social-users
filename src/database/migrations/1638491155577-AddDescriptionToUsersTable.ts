import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDescriptionToUsersTable1638491155577
  implements MigrationInterface
{
  private biography = new TableColumn({
    name: 'biography',
    type: 'text',
    isNullable: true,
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('users', this.biography);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', this.biography);
  }
}
