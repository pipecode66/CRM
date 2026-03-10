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
      subtitle: "Ventas, soporte y automatizaciÃ³n en un solo lugar",
      language: "Idioma",
    },
    nav: {
      dashboard: "Dashboard",
      inbox: "Inbox",
      leads: "Leads",
      tasks: "Tareas",
      templates: "Plantillas",
      campaigns: "CampaÃ±as",
      reports: "Reportes",
      workflows: "Flujos",
      ai: "Agente IA",
    },
    dashboard: {
      title: "MÃ©tricas en tiempo real",
      metrics: {
        incoming: "Mensajes entrantes",
        openChats: "Chats abiertos",
        noReply: "Sin respuesta",
        avgResponse: "Tiempo medio de respuesta",
        activeLeads: "Leads activos",
        wonLeads: "Leads ganados",
        pendingTasks: "Tareas pendientes",
        conversion: "ConversiÃ³n",
      },
    },
    inbox: {
      title: "Bandeja unificada",
      empty: "No hay conversaciones activas",
    },
    workflows: {
      title: "Constructor visual IA + AutomatizaciÃ³n",
      subtitle: "DiseÃ±a flujos tipo n8n para operaciones de CRM y agente IA.",
    },
    ai: {
      title: "Agente IA 24/7",
      subtitle: "AutonomÃ­a total con guardrails crÃ­ticos y trazabilidad.",
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
