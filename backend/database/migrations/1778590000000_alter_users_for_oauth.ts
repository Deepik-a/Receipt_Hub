import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('google_id').nullable().unique()
      table.string('avatar_url').nullable()
      table.string('provider', 20).notNullable().defaultTo('email')
      table.string('password').nullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('google_id')
      table.dropColumn('avatar_url')
      table.dropColumn('provider')
      table.string('password').notNullable().alter()
    })
  }
}
