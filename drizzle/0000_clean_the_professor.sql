CREATE TABLE "task" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"priority" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "descripcion_griferia" (
	"id_descripcion_griferia" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(150) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "descripcion_materiales_electricos" (
	"id_descripcion_material_electrico" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(150) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diametros_hierros_galvanizados" (
	"id_diametro_hierro_galvanizado" serial PRIMARY KEY NOT NULL,
	"medida" varchar(20) NOT NULL,
	"medida_decimal" numeric(5, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diametros_linea_plastica" (
	"id_diametro_linea_plastica" serial PRIMARY KEY NOT NULL,
	"medida" varchar(20) NOT NULL,
	"medida_decimal" numeric(5, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diametros_tuberias" (
	"id_diametro_tuberia" serial PRIMARY KEY NOT NULL,
	"medida" varchar(20) NOT NULL,
	"medida_decimal" numeric(5, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hierros_galvanizados_diametros" (
	"id_hierro_galvanizado" integer NOT NULL,
	"id_diametro_hierro_galvanizado" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "linea_plastica_diametros" (
	"id_linea_plastica" integer NOT NULL,
	"id_diametro_linea_plastica" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "linea_plastica_materiales" (
	"id_linea_plastica_material" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(150) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tuberias_diametros" (
	"id_tuberia" integer NOT NULL,
	"id_diametro_tuberia" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tuberias_materiales" (
	"id_tuberia_material" serial PRIMARY KEY NOT NULL,
	"nombre" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categorias" (
	"id_categoria" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(150) NOT NULL,
	"imagen_url" varchar(500),
	"imagen_public_id" varchar(200),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "alianzas_certificaciones" (
	"id_alianza" serial PRIMARY KEY NOT NULL,
	"imagen_url" varchar(500),
	"imagen_public_id" varchar(200),
	"estado" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cifras_impacto" (
	"id_cifra" serial PRIMARY KEY NOT NULL,
	"numero_texto" varchar(20) NOT NULL,
	"descripcion" varchar(100) NOT NULL,
	"orden" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "config_empresa" (
	"id_configuracion" serial PRIMARY KEY NOT NULL,
	"linea_ventas" varchar(50),
	"correo_corporativo" varchar,
	"whatsapp_numero" varchar,
	"direccion_general" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "horarios" (
	"id_horario" serial PRIMARY KEY NOT NULL,
	"dias_texto" varchar(50) NOT NULL,
	"hora_apertura" varchar(20),
	"hora_cierre" varchar(20),
	"esta_cerrado" boolean DEFAULT false NOT NULL,
	"orden" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solicitudes_contacto" (
	"id_solicitud" serial PRIMARY KEY NOT NULL,
	"nombre_rsocial" varchar(200) NOT NULL,
	"correo" varchar(150) NOT NULL,
	"telefono" varchar(50),
	"detalles_proyecto" text NOT NULL,
	"estado_solicitud" varchar(50) DEFAULT 'Pendiente' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "productos" (
	"id_producto" serial PRIMARY KEY NOT NULL,
	"id_categoria" integer NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"fabricante" varchar(100),
	"descripcion" text,
	"imagen_url" varchar(500),
	"imagen_public_id" varchar(200),
	"estado" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promocion_detalle" (
	"id_promocion_detalle" serial PRIMARY KEY NOT NULL,
	"id_promocion" integer NOT NULL,
	"id_producto" integer NOT NULL,
	"precio_promocional" numeric(10, 2) NOT NULL,
	"descuento" varchar(5),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promociones" (
	"id_promocion" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"descripcion" varchar(250),
	"fecha_inicio" timestamp,
	"fecha_fin" timestamp,
	"estado" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "griferia" (
	"id_producto" integer PRIMARY KEY NOT NULL,
	"id_descripcion_griferia" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hierros_galvanizados" (
	"id_producto" integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "linea_plastica" (
	"id_producto" integer PRIMARY KEY NOT NULL,
	"id_linea_plastica_material" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "materiales_electricos" (
	"id_producto" integer PRIMARY KEY NOT NULL,
	"id_descripcion_material_electrico" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tuberias" (
	"id_producto" integer PRIMARY KEY NOT NULL,
	"id_tuberia_material" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sucursales" (
	"id_sucursal" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"direccion" varchar(250) NOT NULL,
	"telefono" varchar(50),
	"latitud" numeric(10, 8),
	"longitud" numeric(11, 8),
	"imagen_url" varchar(500),
	"imagen_public_id" varchar(200),
	"estado" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hierros_galvanizados_diametros" ADD CONSTRAINT "hierros_galvanizados_diametros_id_hierro_galvanizado_hierros_galvanizados_id_producto_fk" FOREIGN KEY ("id_hierro_galvanizado") REFERENCES "public"."hierros_galvanizados"("id_producto") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hierros_galvanizados_diametros" ADD CONSTRAINT "hierros_galvanizados_diametros_id_diametro_hierro_galvanizado_diametros_hierros_galvanizados_id_diametro_hierro_galvanizado_fk" FOREIGN KEY ("id_diametro_hierro_galvanizado") REFERENCES "public"."diametros_hierros_galvanizados"("id_diametro_hierro_galvanizado") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "linea_plastica_diametros" ADD CONSTRAINT "linea_plastica_diametros_id_linea_plastica_linea_plastica_id_producto_fk" FOREIGN KEY ("id_linea_plastica") REFERENCES "public"."linea_plastica"("id_producto") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "linea_plastica_diametros" ADD CONSTRAINT "linea_plastica_diametros_id_diametro_linea_plastica_diametros_linea_plastica_id_diametro_linea_plastica_fk" FOREIGN KEY ("id_diametro_linea_plastica") REFERENCES "public"."diametros_linea_plastica"("id_diametro_linea_plastica") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tuberias_diametros" ADD CONSTRAINT "tuberias_diametros_id_tuberia_tuberias_id_producto_fk" FOREIGN KEY ("id_tuberia") REFERENCES "public"."tuberias"("id_producto") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tuberias_diametros" ADD CONSTRAINT "tuberias_diametros_id_diametro_tuberia_diametros_tuberias_id_diametro_tuberia_fk" FOREIGN KEY ("id_diametro_tuberia") REFERENCES "public"."diametros_tuberias"("id_diametro_tuberia") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productos" ADD CONSTRAINT "productos_id_categoria_categorias_id_categoria_fk" FOREIGN KEY ("id_categoria") REFERENCES "public"."categorias"("id_categoria") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promocion_detalle" ADD CONSTRAINT "promocion_detalle_id_promocion_promociones_id_promocion_fk" FOREIGN KEY ("id_promocion") REFERENCES "public"."promociones"("id_promocion") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promocion_detalle" ADD CONSTRAINT "promocion_detalle_id_producto_productos_id_producto_fk" FOREIGN KEY ("id_producto") REFERENCES "public"."productos"("id_producto") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "griferia" ADD CONSTRAINT "griferia_id_producto_productos_id_producto_fk" FOREIGN KEY ("id_producto") REFERENCES "public"."productos"("id_producto") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "griferia" ADD CONSTRAINT "griferia_id_descripcion_griferia_descripcion_griferia_id_descripcion_griferia_fk" FOREIGN KEY ("id_descripcion_griferia") REFERENCES "public"."descripcion_griferia"("id_descripcion_griferia") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hierros_galvanizados" ADD CONSTRAINT "hierros_galvanizados_id_producto_productos_id_producto_fk" FOREIGN KEY ("id_producto") REFERENCES "public"."productos"("id_producto") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "linea_plastica" ADD CONSTRAINT "linea_plastica_id_producto_productos_id_producto_fk" FOREIGN KEY ("id_producto") REFERENCES "public"."productos"("id_producto") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "linea_plastica" ADD CONSTRAINT "linea_plastica_id_linea_plastica_material_linea_plastica_materiales_id_linea_plastica_material_fk" FOREIGN KEY ("id_linea_plastica_material") REFERENCES "public"."linea_plastica_materiales"("id_linea_plastica_material") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materiales_electricos" ADD CONSTRAINT "materiales_electricos_id_producto_productos_id_producto_fk" FOREIGN KEY ("id_producto") REFERENCES "public"."productos"("id_producto") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materiales_electricos" ADD CONSTRAINT "materiales_electricos_id_descripcion_material_electrico_descripcion_materiales_electricos_id_descripcion_material_electrico_fk" FOREIGN KEY ("id_descripcion_material_electrico") REFERENCES "public"."descripcion_materiales_electricos"("id_descripcion_material_electrico") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tuberias" ADD CONSTRAINT "tuberias_id_producto_productos_id_producto_fk" FOREIGN KEY ("id_producto") REFERENCES "public"."productos"("id_producto") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tuberias" ADD CONSTRAINT "tuberias_id_tuberia_material_tuberias_materiales_id_tuberia_material_fk" FOREIGN KEY ("id_tuberia_material") REFERENCES "public"."tuberias_materiales"("id_tuberia_material") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");