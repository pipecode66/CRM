import { hash } from "bcryptjs";

import { db } from "@/lib/db";

export async function seedDemoData() {
  const defaultBranch = await db.branch.upsert({
    where: { code: "HQ" },
    update: {},
    create: {
      name: "Sede Principal",
      code: "HQ",
    },
  });

  const stageDefinitions = [
    { name: "Leads entrantes", order: 1, color: "#0ea5e9" },
    { name: "Mensajes de redes", order: 2, color: "#22c55e" },
    { name: "Cotización enviada", order: 3, color: "#f59e0b" },
    { name: "Seguimiento", order: 4, color: "#ef4444" },
    { name: "Venta cerrada", order: 5, color: "#10b981", isWon: true },
    { name: "Postventa", order: 6, color: "#6366f1" },
  ];

  for (const stage of stageDefinitions) {
    await db.pipelineStage.upsert({
      where: { name_order: { name: stage.name, order: stage.order } },
      update: {
        color: stage.color,
        isWon: Boolean(stage.isWon),
      },
      create: {
        name: stage.name,
        order: stage.order,
        color: stage.color,
        isWon: Boolean(stage.isWon),
      },
    });
  }

  const adminEmail = "admin@crm.local";
  const admin = await db.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin CRM",
      role: "ADMIN",
      locale: "es",
      passwordHash: await hash("Admin12345!", 12),
      branches: {
        create: {
          branchId: defaultBranch.id,
          isDefault: true,
        },
      },
    },
  });

  const welcomeTemplate = await db.template.upsert({
    where: { slug: "bienvenida-general" },
    update: {},
    create: {
      name: "Bienvenida",
      slug: "bienvenida-general",
      category: "WELCOME",
      language: "es",
      content: "Hola {{nombre}}, gracias por escribirnos. Soy {{asesor}} y te ayudo con gusto.",
      variables: ["nombre", "asesor"],
      createdById: admin.id,
    },
  });

  await db.knowledgeDocument.upsert({
    where: { id: "faq-demo" },
    update: {
      isActive: true,
    },
    create: {
      id: "faq-demo",
      title: "FAQ General",
      sourceType: "FAQ",
      content:
        "Horario: 8am-8pm. Entregas en 45 minutos. Pagos por transferencia, tarjeta y efectivo. Política de cambios 24 horas.",
      createdById: admin.id,
    },
  });

  await db.webAllowlistDomain.upsert({
    where: { domain: "wikipedia.org" },
    update: { isActive: true },
    create: { domain: "wikipedia.org", isActive: true },
  });

  return {
    adminEmail,
    adminPassword: "Admin12345!",
    branchId: defaultBranch.id,
    templateId: welcomeTemplate.id,
  };
}
