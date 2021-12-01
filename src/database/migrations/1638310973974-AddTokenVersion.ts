import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTokenVersion1638310973974 implements MigrationInterface {
  private resetPasswordToken = new TableColumn({
    name: 'reset_password_token',
    type: 'text',
    isNullable: true,
  });
  private tokenVersion = new TableColumn({
    name: 'token_version',
    type: 'int',
    isNullable: true,
    default: 1,
  });
  private refreshTokenVersion = new TableColumn({
    name: 'refresh_token_version',
    type: 'int',
    isNullable: true,
    default: 1,
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('users', this.resetPasswordToken);
    await queryRunner.addColumn('users', this.tokenVersion);
    await queryRunner.addColumn('users', this.refreshTokenVersion);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', this.resetPasswordToken);
    await queryRunner.dropColumn('users', this.tokenVersion);
    await queryRunner.dropColumn('users', this.refreshTokenVersion);
  }
}
