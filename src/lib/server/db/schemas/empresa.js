import { pgTable, serial, varchar, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';

export const config_empresa = pgTable('config_empresa', {
    id_configuracion: serial('id_configuracion').primaryKey(),
    linea_ventas: varchar('linea_ventas', { length: 50 }),
    correo_corporativo: varchar('correo_corporativo'),
    whatsapp_numero: varchar('whatsapp_numero'),
    direccion_general: varchar('direccion_general'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const horarios = pgTable('horarios', {
    id_horario: serial('id_horario').primaryKey(),
    dias_texto: varchar('dias_texto', { length: 50 }).notNull(),
    hora_apertura: varchar('hora_apertura', { length: 20 }),
    hora_cierre: varchar('hora_cierre', { length: 20 }),
    esta_cerrado: boolean('esta_cerrado').default(false).notNull(),
    orden: integer('orden').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const cifras_impacto = pgTable('cifras_impacto', {
    id_cifra: serial('id_cifra').primaryKey(),
    numero_texto: varchar('numero_texto', { length: 20 }).notNull(),
    descripcion: varchar('descripcion', { length: 100 }).notNull(),
    orden: integer('orden').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const solicitudes_contacto = pgTable('solicitudes_contacto', {
    id_solicitud: serial('id_solicitud').primaryKey(),
    nombre_rsocial: varchar('nombre_rsocial', { length: 200 }).notNull(),
    correo: varchar('correo', { length: 150 }).notNull(),
    telefono: varchar('telefono', { length: 50 }),
    detalles_proyecto: text('detalles_proyecto').notNull(),
    estado_solicitud: varchar('estado_solicitud', { length: 50 }).default('Pendiente').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const alianzas_certificaciones = pgTable('alianzas_certificaciones', {
    id_alianza: serial('id_alianza').primaryKey(),
    imagen_url: varchar('imagen_url', { length: 500 }),
    imagen_public_id: varchar('imagen_public_id', { length: 200 }),
    estado: boolean('estado').default(true).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});