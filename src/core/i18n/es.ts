import { APP_NAME } from "@/core/constants/app.constants";

export const es = {
  appName: APP_NAME,
  common: {
    continue: "Continuar",
    next: "Siguiente",
    submit: "Enviar",
    back: "Volver",
    other: "Otro",
    otherPlaceholder: "Especifica…",
  },
  home: {
    title: "Únete al grupo",
    subtitle:
      "Teletrabajadores de producto digital en Los Angeles de San Rafael.",
    cta: "Empezar",
  },
  survey: {
    steps: {
      fullName: {
        title: "¿Cómo te llamas?",
        subtitle: "Nombre y apellidos para presentarte al grupo.",
        placeholder: "Nombre y apellidos",
      },
      ageGroup: {
        title: "¿Cuál es tu grupo de edad?",
        subtitle: "Así vemos la mezcla del grupo.",
      },
      contact: {
        title: "¿Cómo te contactamos?",
        subtitle: "Email o WhatsApp — al menos uno es obligatorio.",
        emailLabel: "Email",
        emailPlaceholder: "tu@email.com",
        whatsappLabel: "WhatsApp",
        whatsappPlaceholder: "+34 600 000 000",
        error: "Indica al menos un email o un WhatsApp.",
      },
      social: {
        title: "Añade tus redes (opcional)",
        subtitle: "Solo si te apetece compartirlas con el grupo.",
        linkedin: "LinkedIn",
        instagram: "Instagram",
        x: "X",
        placeholder: "@usuario",
      },
      work: {
        title: "¿En qué trabajas?",
        subtitle: "Puedes elegir varias opciones.",
      },
      leisure: {
        title: "¿Qué ocio te gusta?",
        subtitle: "Elige lo que te encaje. Puedes añadir algo propio.",
      },
      gender: {
        title: "¿Cuál es tu género?",
        subtitle: "Nos ayuda a conocer mejor la composición del grupo.",
      },
      meeting: {
        title: "¿Cuándo te viene bien quedar?",
        subtitle: "Puedes marcar varias fechas.",
      },
    },
    thanks: {
      title: "¡Gracias!",
      subtitle:
        "Hemos recibido tu información. Te escribiremos cuando organicemos la quedada.",
      cta: "Volver al inicio",
    },
    labels: {
      ageGroups: {
        AGE_18_25: "18–25",
        AGE_26_39: "26–39",
        AGE_40_54: "40–54",
        AGE_55_PLUS: "55+",
      },
      genders: {
        mujer: "Mujer",
        hombre: "Hombre",
        no_binario: "No binario",
        prefiero_no_decirlo: "Prefiero no decirlo",
      },
      workAreas: {
        engineering_development: "Ingeniería / desarrollo",
        product_management: "Producto / Product Management",
        ux_ui_design: "UX/UI / diseño",
        data_ai: "Datos / IA",
        marketing_growth: "Marketing / Growth",
        entrepreneurship_founders: "Emprendimiento / Founders",
        qa_devops_systems: "QA / DevOps / sistemas",
        other_tech: "Otro ámbito tecnológico",
      },
      leisure: {
        padel: "Pádel",
        hiking: "Senderismo",
        sewing: "Costura",
        running: "Running",
        yoga: "Yoga",
        wine: "Vino",
        fine_dining: "Gastronomía",
        museums: "Museos",
        camping: "Camping",
        painting: "Pintura",
      },
      meetingSlots: {
        wed_14_19_00: "Miércoles 14 · 19:00",
        mon_19_19_00: "Lunes 19 · 19:00",
        wed_21_19_00: "Miércoles 21 · 19:00",
      },
    },
  },
} as const;

export type Dictionary = typeof es;
