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
    loading: "Cargando",
    saving: "Guardando",
    saved: "Guardado",
  },
  a11y: {
    progress: (current: number, total: number) =>
      `Paso ${current} de ${total}`,
  },
  home: {
    title: "Sal del modo oficina",
    subtitle:
      "Grupo de teletrabajadores de producto digital en Los Angeles de San Rafael.",
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
        consentBeforeLink: "He leído la ",
        consentLink: "política de privacidad",
        consentAfterLink:
          " y acepto que Out Of Office LASR me contacte por email o WhatsApp para organizar el grupo.",
        consentError:
          "Debes aceptar la política de privacidad y el contacto para continuar.",
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
  dashboard: {
    login: {
      title: "Acceso admin",
      subtitle: "Introduce tus credenciales para ver las respuestas.",
      usernameLabel: "Usuario",
      passwordLabel: "Contraseña",
      submit: "Entrar",
      submitting: "Entrando…",
      errors: {
        invalidCredentials: "Usuario o contraseña incorrectos.",
        notConfigured: "El acceso admin no está configurado.",
        generic: "No se pudo iniciar sesión. Inténtalo de nuevo.",
      },
    },
    logout: "Cerrar sesión",
    loggingOut: "Cerrando…",
    list: {
      title: "Respuestas",
      subtitle: "Filtra y revisa las solicitudes del grupo.",
      resultCount: (count: number) =>
        count === 1 ? "1 resultado" : `${count} resultados`,
      refresh: "Actualizar",
      refreshing: "Actualizando…",
      lastUpdated: (time: string) => `Última vez actualizado a las ${time}`,
      lastUpdatedNever: "Aún no se ha actualizado",
      empty: "No hay respuestas con estos filtros.",
      loadError: "No se pudieron cargar las respuestas.",
      retry: "Reintentar",
      clearFilters: "Limpiar filtros",
      pagination: {
        previous: "Anterior",
        next: "Siguiente",
        page: (page: number, totalPages: number) =>
          `Página ${page} de ${totalPages}`,
      },
      filters: {
        sectionLabel: "Filtros",
        openSheet: "Filtros",
        openSheetWithCount: (count: number) => `Filtros (${count})`,
        closeSheet: "Cerrar",
        doneSheet: "Ver resultados",
        searchLabel: "Buscar",
        searchPlaceholder: "Nombre, email o WhatsApp",
        statusLabel: "Estado",
        statusAll: "Todos",
        statusDraft: "Borrador",
        statusSubmitted: "Enviado",
        ageLabel: "Edad",
        workLabel: "Área de trabajo",
        meetingLabel: "Quedadas",
        genderLabel: "Género",
        resizeDivider: "Redimensionar paneles de filtros y resultados",
      },
      columns: {
        status: "Estado",
        name: "Nombre",
        age: "Edad",
        contact: "Contacto",
        work: "Trabajo",
        meeting: "Quedadas",
        gender: "Género",
        date: "Fecha",
      },
      status: {
        draft: "Borrador",
        submitted: "Enviado",
      },
      emptyCell: "—",
      openDetail: "Ver detalle",
    },
    detail: {
      title: "Detalle de la respuesta",
      close: "Cerrar",
      fields: {
        status: "Estado",
        name: "Nombre",
        age: "Edad",
        email: "Email",
        whatsapp: "WhatsApp",
        linkedin: "LinkedIn",
        instagram: "Instagram",
        x: "X",
        work: "Área de trabajo",
        workOther: "Otro (trabajo)",
        leisure: "Ocio",
        leisureOther: "Otro (ocio)",
        gender: "Género",
        meeting: "Quedadas",
        createdAt: "Creado",
        updatedAt: "Actualizado",
        submittedAt: "Enviado",
        privacyConsentAcceptedAt: "Consentimiento de privacidad",
        id: "ID",
      },
    },
  },
  privacy: {
    title: "Política de privacidad",
    updatedAtLabel: "Última actualización",
    updatedAt: "11 de octubre de 2026",
    backHome: "Volver al inicio",
    intro:
      "Esta política explica cómo Out Of Office LASR trata los datos personales que nos facilitas a través de este sitio web, en particular al completar el formulario de interés para unirte al grupo de teletrabajadores de producto digital en Los Angeles de San Rafael (España).",
    disclaimer:
      "Este documento tiene carácter informativo y está redactado para una iniciativa comunitaria informal. No constituye asesoramiento jurídico. Si necesitas una valoración legal específica, consulta a un profesional.",
    sections: [
      {
        title: "1. Responsable del tratamiento",
        paragraphs: [
          "El responsable del tratamiento es la iniciativa comunitaria Out Of Office LASR (en adelante, «nosotros»), sin personalidad jurídica propia en el momento de publicar esta política.",
          "Hasta que se publique un canal de contacto dedicado, puedes ejercer tus derechos respondiendo al mismo medio (email o WhatsApp) por el que te contactemos en relación con tu solicitud, o a través de cualquier canal oficial que indiquemos en esta página cuando esté disponible.",
        ],
      },
      {
        title: "2. Ámbito de aplicación",
        paragraphs: [
          "Esta política se aplica a los datos personales recogidos a través del formulario de solicitud / encuesta de Out Of Office LASR y a la gestión administrativa asociada (incluido el panel privado de administración).",
          "No se aplica a sitios web, redes sociales o servicios de terceros a los que puedas acceder mediante enlaces externos.",
        ],
      },
      {
        title: "3. Datos que tratamos",
        paragraphs: [
          "Según lo que completes en el formulario, podemos tratar:",
        ],
        bullets: [
          "Datos de identificación: nombre y apellidos.",
          "Datos de contacto: email y/o número de WhatsApp.",
          "Datos de perfil opcionales: perfiles en LinkedIn, Instagram y/o X.",
          "Datos sociodemográficos y de afinidad: grupo de edad, género, áreas de trabajo, intereses de ocio y disponibilidad para quedadas.",
          "Datos técnicos mínimos de sesión: un identificador de sesión anónimo en cookie/almacenamiento local para guardar el borrador del formulario.",
          "Metadatos del tratamiento: fechas de creación, actualización, envío y, en su caso, la aceptación del consentimiento de privacidad y contacto.",
        ],
      },
      {
        title: "4. Finalidades del tratamiento",
        paragraphs: [
          "Tratamos tus datos para:",
        ],
        bullets: [
          "Gestionar tu solicitud de interés en el grupo Out Of Office LASR.",
          "Contactarte por email o WhatsApp en relación con la organización del grupo y las quedadas.",
          "Entender de forma agregada el perfil del grupo (edad, género, áreas, ocio y disponibilidad) para organizar actividades.",
          "Mantener el borrador de tu formulario hasta que lo envíes o lo abandones.",
          "Cumplir obligaciones legales aplicables y atender solicitudes relacionadas con tus derechos.",
        ],
      },
      {
        title: "5. Base jurídica",
        paragraphs: [
          "La base principal es tu consentimiento (art. 6.1.a del RGPD), que prestas al marcar la casilla obligatoria del paso de contacto y enviar o continuar el formulario.",
          "En la medida en que resulte aplicable, también podremos basarnos en nuestro interés legítimo (art. 6.1.f del RGPD) para la administración segura del servicio (por ejemplo, prevenir abusos técnicos), siempre que no prevalezcan tus derechos e intereses.",
          "Puedes retirar el consentimiento en cualquier momento sin que ello afecte a la licitud del tratamiento basado en el consentimiento previo a su retirada. La retirada puede implicar que no podamos seguir contactándote ni mantenerte en el proceso de organización del grupo.",
        ],
      },
      {
        title: "6. Destinatarios y encargados del tratamiento",
        paragraphs: [
          "Tus datos no se venden ni se ceden a terceros para fines comerciales ajenos a Out Of Office LASR.",
          "Pueden acceder a ellos:",
        ],
        bullets: [
          "Las personas organizadoras de Out Of Office LASR, exclusivamente para las finalidades indicadas.",
          "Proveedores tecnológicos que actúan como encargados del tratamiento (por ejemplo, alojamiento de la aplicación y base de datos en la nube), sujetos a obligaciones de confidencialidad y seguridad.",
        ],
        closing:
          "Si en el futuro incorporamos nuevos proveedores relevantes, actualizaremos esta política cuando corresponda.",
      },
      {
        title: "7. Transferencias internacionales",
        paragraphs: [
          "Algunos proveedores de infraestructura pueden tratar datos fuera del Espacio Económico Europeo. En ese caso, se aplicarán las garantías previstas por el RGPD (por ejemplo, cláusulas contractuales tipo u otras medidas adecuadas) en la medida en que el proveedor las ofrezca.",
        ],
      },
      {
        title: "8. Plazo de conservación",
        paragraphs: [
          "Conservaremos tus datos mientras sea necesario para gestionar tu participación o interés en el grupo y, en todo caso, mientras no solicites su supresión, salvo que debamos conservarlos durante un plazo adicional por obligaciones legales o para la formulación, ejercicio o defensa de reclamaciones.",
          "Los borradores no enviados pueden eliminarse o quedar inaccesibles tras un periodo razonable de inactividad o cuando se limpie la sesión técnica asociada.",
        ],
      },
      {
        title: "9. Tus derechos",
        paragraphs: [
          "De acuerdo con el RGPD y la LOPDGDD, puedes solicitar:",
        ],
        bullets: [
          "Acceso a tus datos personales.",
          "Rectificación de datos inexactos.",
          "Supresión («derecho al olvido») cuando proceda.",
          "Limitación del tratamiento.",
          "Oposición al tratamiento.",
          "Portabilidad de los datos, cuando sea técnicamente posible.",
          "Retirada del consentimiento prestado.",
        ],
        closing:
          "También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es). Para ejercer tus derechos frente a nosotros, utiliza el canal provisional descrito en el apartado 1, aportando información suficiente para identificar tu solicitud (por ejemplo, el email o WhatsApp que nos facilitaste).",
      },
      {
        title: "10. Menores",
        paragraphs: [
          "Este formulario está dirigido a personas mayores de 18 años. Si tienes conocimiento de que un menor nos ha facilitado datos, contacta con nosotros para que podamos proceder a su eliminación.",
        ],
      },
      {
        title: "11. Seguridad",
        paragraphs: [
          "Aplicamos medidas técnicas y organizativas razonables para proteger tus datos (control de acceso al panel de administración, transmisión cifrada cuando el hosting lo permite, y minimización de los datos recabados). Ningún sistema es completamente seguro; te pedimos que no nos envíes información sensible innecesaria.",
        ],
      },
      {
        title: "12. Cookies y almacenamiento local",
        paragraphs: [
          "Utilizamos una cookie o mecanismo equivalente de sesión anónima y, en el navegador, almacenamiento local para recordar el progreso del formulario. Estas tecnologías son necesarias para el funcionamiento del servicio y no se usan con fines de publicidad comportamental.",
        ],
      },
      {
        title: "13. Cambios en esta política",
        paragraphs: [
          "Podemos actualizar esta política para reflejar cambios en el servicio, en la organización del grupo o en la normativa aplicable. La fecha de «Última actualización» indica la versión vigente. Si los cambios son relevantes, procuraremos destacarlos en esta página.",
        ],
      },
    ],
  },
} as const;

export type Dictionary = typeof es;
