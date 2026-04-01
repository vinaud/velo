import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'

const { Pool } = pg

interface OrdersTable {
    id: string
    order_number: string
    color: string
    wheel_type: string
    customer_name: string
    customer_email: string
    customer_phone: string
    customer_cpf: string
    payment_method: string
    total_price: string
    status: string
    created_at?: Date | string
    updated_at?: Date | string
    optionals?: string[]
}

interface Database {
    orders: OrdersTable
}

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in the environment.')
}

const dialect = new PostgresDialect({
    pool: new Pool({
        connectionString: process.env.DATABASE_URL,
    })
})

export const db = new Kysely<Database>({
    dialect,
})

export async function insertOrder(order: Partial<OrdersTable>) {
    await db.insertInto('orders')
        .values(order as any)
        .execute()
}

export async function deleteOrder(orderNumber: string) {
    await db.deleteFrom('orders')
        .where('order_number', '=', orderNumber)
        .execute()
}
