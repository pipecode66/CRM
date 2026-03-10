export const locales = ["es", "en"] as const;

export type AppLocale = (typeof locales)[number];

export type Dictionary = {
  common: {
    appName: string;
    subtitle: string;
    language: string;
  };
  nav: {
    dashboard: string;
    inbox: string;
    leads: string;
    tasks: string;
    templates: string;
    campaigns: string;
    reports: string;
    workflows: string;
    ai: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    metrics: {
      incoming: string;
      openChats: string;
      noReply: string;
      avgResponse: string;
      activeLeads: string;
      wonLeads: string;
      pendingTasks: string;
      conversion: string;
    };
    sla: {
      title: string;
      avgTime: string;
      target: string;
    };
    funnel: {
      title: string;
      activeLeads: string;
      wonLeads: string;
      totalConversion: string;
    };
  };
  inbox: {
    title: string;
    empty: string;
  };
  workflows: {
    title: string;
    subtitle: string;
  };
  ai: {
    title: string;
    subtitle: string;
  };
};

export const dictionaries: Record<AppLocale, Dictionary> = {
  es: {
    common: {
      appName: "CRM Omnicanal IA",
      subtitle: "Ventas, soporte y automatización en un solo lugar",
      language: "Idioma",
    },
    nav: {
      dashboard: "Dashboard",
      inbox: "Inbox",
      leads: "Leads",
      tasks: "Tareas",
      templates: "Plantillas",
      campaigns: "Campañas",
      reports: "Reportes",
      workflows: "Flujos",
      ai: "Agente IA",
    },
    dashboard: {
      title: "Métricas en tiempo real",
      subtitle: "Resumen operativo de ventas, soporte y automatizaciones.",
      metrics: {
        incoming: "Mensajes entrantes",
        openChats: "Chats abiertos",
        noReply: "Sin respuesta",
        avgResponse: "Tiempo promedio de respuesta",
        activeLeads: "Leads activos",
        wonLeads: "Leads ganados",
        pendingTasks: "Tareas pendientes",
        conversion: "Conversión",
      },
      sla: {
        title: "SLA de respuesta",
        avgTime: "Tiempo promedio",
        target: "Objetivo recomendado: < 7 minutos",
      },
      funnel: {
        title: "Conversión del embudo",
        activeLeads: "Leads activos",
        wonLeads: "Leads ganados",
        totalConversion: "Conversión total",
      },
    },
    inbox: {
      title: "Bandeja unificada",
      empty: "No hay conversaciones activas",
    },
    workflows: {
      title: "Constructor visual IA + Automatización",
      subtitle: "Diseña flujos tipo n8n para operaciones de CRM y agente IA.",
    },
    ai: {
      title: "Agente IA 24/7",
      subtitle: "Autonomía total con guardrails críticos y trazabilidad.",
    },
  },
  en: {
    common: {
      appName: "Omnichannel AI CRM",
      subtitle: "Sales, support and automation in one place",
      language: "Language",
    },
    nav: {
      dashboard: "Dashboard",
      inbox: "Inbox",
      leads: "Leads",
      tasks: "Tasks",
      templates: "Templates",
      campaigns: "Campaigns",
      reports: "Reports",
      workflows: "Workflows",
      ai: "AI Agent",
    },
    dashboard: {
      title: "Real-time metrics",
      subtitle: "Operational snapshot of sales, support and automations.",
      metrics: {
        incoming: "Incoming messages",
        openChats: "Open chats",
        noReply: "Unanswered",
        avgResponse: "Avg response time",
        activeLeads: "Active leads",
        wonLeads: "Won leads",
        pendingTasks: "Pending tasks",
        conversion: "Conversion",
      },
      sla: {
        title: "Response SLA",
        avgTime: "Average time",
        target: "Recommended target: < 7 minutes",
      },
      funnel: {
        title: "Funnel conversion",
        activeLeads: "Active leads",
        wonLeads: "Won leads",
        totalConversion: "Total conversion",
      },
    },
    inbox: {
      title: "Unified inbox",
      empty: "No active conversations",
    },
    workflows: {
      title: "Visual IA + Automation Builder",
      subtitle: "Design n8n-style flows for CRM operations and AI actions.",
    },
    ai: {
      title: "24/7 AI Agent",
      subtitle: "Full autonomy with critical guardrails and audit trails.",
    },
  },
};

export function getDictionary(locale: string): Dictionary {
  if (locale in dictionaries) {
    return dictionaries[locale as AppLocale];
  }
  return dictionaries.es;
}
