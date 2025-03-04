import { relations } from 'drizzle-orm'
import { integer, pgTable, varchar, timestamp, boolean, date, primaryKey } from 'drizzle-orm/pg-core'

export const departments = pgTable('departments', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

export const departmentsRelations = relations(departments, ({ many }) => ({
  usersToDepartments: many(usersToDepartments),
}))

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  phone: varchar({ length: 20 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  avatar: varchar({ length: 255 }),
  address: varchar({ length: 255 }),
  isActive: boolean('is_active').notNull().default(false),
  birthDate: date('birth_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

export const usersRelations = relations(users, ({ many }) => ({
  usersToDepartments: many(usersToDepartments),
  roles: many(roles),
}))

export const usersToDepartments = pgTable(
  'users_to_departments',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    departmentId: integer('department_id')
      .notNull()
      .references(() => departments.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.departmentId] })],
)

export const usersToDepartmentsRelations = relations(usersToDepartments, ({ one }) => ({
  department: one(departments, {
    fields: [usersToDepartments.departmentId],
    references: [departments.id],
  }),
  user: one(users, {
    fields: [usersToDepartments.userId],
    references: [users.id],
  }),
}))

export const roles = pgTable('roles', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}))

export const usersRoles = pgTable(
  'users_roles',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: integer('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.roleId] })],
)
