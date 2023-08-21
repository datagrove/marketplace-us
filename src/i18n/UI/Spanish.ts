export const Spanish = {
  textDirection: 'ltr',

  pageTitles: {
    services: 'Servicios',
    signUp: 'Registrarse',
    login: 'Iniciar sesión',
    home: 'Inicio',
    signIn: 'Iniciar sesión',
    createClientAccount: 'Crear Cuenta de Cliente',
    editClientAccount: 'Editar Cuenta de Cliente',
    viewClientAccount: 'Ver Cuenta de Cliente',
    createPost: 'Crear Publicación',
    createProviderAccount: 'Crear Cuenta de Proveedor',
    editProviderAccount: 'Editar Cuenta de Proveedor',
    viewProviderAccount: 'Mi cuenta de proveedor',
    page404: '404 - Página no Encontrada',
    requestPasswordReset: 'Solicitud para Recuperar la Contraseña',
    resetPassword: 'Resetear la Contraseña',
    terms: 'Términos y Condiciones',
    privacy: "Política de Privacidad",
  },

  buttons: {
    providerProfile: 'Mi Perfil de Proveedor',
    editProfile: 'Editar Perfil',
    register: 'Registro',
    uploadImage: 'Cargar Imagen',
    uploading: 'Cargando ...',
    loading: 'Cargando...',
    login: 'Acceso',
    signUp: 'inscribirse',
    signIn: 'iniciar sesión',
    signOut: 'Desconectar',
    returnHome: 'Haga clic para volver a casa',
    reset: 'Reiniciar',
    post: 'Publicar',
    next: 'Próxima',
    previous: 'Previa',
    delete: 'Borrar',
    contact: 'Correo electrónico',
    phone: 'Llamada',
  },

  messages: {
    noAccount: "¿No tienes una cuenta? Click aquí para ",
    passwordLength: 'La contraseña debe ser \n - al menos 6 caracteres de largo \n - contener al menos un número \n - contener una letra mayúscula \n - contener  1 letra minúscula \n - contener al menos carácter especial: \n   ! @ # $ % ^ & *',
    passwordValid: 'Contraseña valida',
    passwordLackRequirements: 'Contraseña no cumple con los requisitos',  
    passwordMatch: 'Las contraseñas no coinciden',
    passwordReset: 'Restablecimiento de contraseña',
    forgotPassword: '¿Olvidaste tu contraseña? Click aquí para',
    alreadyAccount: '¿Ya tienes una cuenta? Click aquí para',
    error404: 'Algo salió mal',
    onlyProvider: 'Solo las proveedoras pueden crear publicaciones.',
    signInAsProvider: 'Inicie sesión en una cuenta de proveedor antes de publicar.',
    checkEmail: "¡Revise su correo electrónico para ver el enlace de reinicio!",
    checkConfirmEmail: '¡Revisa tu correo electrónico para el link de confirmación!',
    signIn: "Inicia sesión para acceder a esta página",
    createProviderAccount: "Inicie sesión para crear un perfil de proveedor",
    createClientAccount: "Inicie sesión para crear un perfil de cliente",
    viewProviderAccount: "No tiene una cuenta de proveedor, por favor cree una para ver su perfil de proveedor",
    noPosts: "No hay publicaciones disponibles",
    noPost: 'Publicación no encontrada',
    selectAnImage: 'Debe seleccionar una imagen para cargar.',
    noProvider: 'No se encontró ningún proveedor.',
    noValue: 'Sin valor',
    translation: 'Las traducciones',
    translations: ' se proporcionan únicamente por conveniencia. El idioma oficial de enlace es el español.',
    clickWrap1: 'Al hacer clic en',
    clickWrap2: 'estás indicando que has leído y estás de acuerdo con los',
    fetch: 'Obtener Servicios',
    todoFetch: '¡Todo el perro de servicio te traerá los servicios que necesitas!',
    mustSignIn: 'Debe iniciar sesión para ver los servicios disponibles.',
  },

  formLabels: {
    title: 'Título',
    serviceCategory: 'Categoría de servicio',
    postContent: 'Publicar Contenido',
    country: 'País',
    majorMunicipality: 'Provincia',
    minorMunicipality: 'Cantón',
    governingDistrict: 'Distrito',
    search: 'Buscar',
    firstName: 'Primer nombre',
    lastName: 'Apellido',
    providerName: "Nombre del proveedor",
    phone: 'Número de celular',
    email: 'Correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar contraseña',
    displayName: 'Nombre para mostrar',
    enterPostContent: 'Ingrese el contenido de la publicación aquí',
    noValue: 'No proporcionada',
    providerInfo: 'Información del proveedor',
    posts: 'Publicaciones de proveedores',
    profileInfo: 'Información del Perfil',
    yourPosts: 'Tus Publicaciones',
  },

  postLabels: {
    provider: 'Proveedora: ',
    location: 'Ubicación: ',
    category: 'Categoría: ',
    image: 'Publicar imagen',
    slide: 'Diapositiva',
    providerProfileImage: 'Imagen de perfil del proveedor',
  },

  homePageText: {
    headline: "Todo lo que necesita para hacer el trabajo.",
    subHeadline: "Los proveedores publican servicios. Publicaciones de búsqueda de clientes. El trabajo se hace.",
    ariaLabel: "Imagen de información de marcador de posición",
  },

  menus: {
    services: 'Buscar Servicios',
  },

  headerData: {
    links: [
      {
        text: 'Inicio',
        href: '/es',
      },
      {
        text: 'Servicios',
        href: '/es/services',
      },
    ],
    actions: [

    ],
  },

  footerData: {
    links: [
      {
        title: 'Producto',
        links: [
          // { text: 'Features', href: '#' },
          // { text: 'Security', href: '#' },
          // { text: 'Team', href: '#' },
          // { text: 'Enterprise', href: '#' },
          // { text: 'Customer stories', href: '#' },
          // { text: 'Pricing', href: '#' },
          // { text: 'Resources', href: '#' },
        ],
      },
      {
        title: 'Plataforma',
        links: [
          // { text: 'Developer API', href: '#' },
          // { text: 'Partners', href: '#' },
        ],
      },
      {
        title: 'Apoyo',
        links: [
          // { text: 'Docs', href: '#' },
          // { text: 'Community Forum', href: '#' },
          // { text: 'Professional Services', href: '#' },
          // { text: 'Skills', href: '#' },
          // { text: 'Status', href: '#' },
        ],
      },
      {
        title: 'Empresa',
        links: [
          { text: 'Acerca', href: '#' },
          // { text: 'Blog', href: '#' },
          // { text: 'Careers', href: '#' },
          // { text: 'Press', href: '#' },
          // { text: 'Inclusion', href: '#' },
          // { text: 'Social Impact', href: '#' },
          // { text: 'Shop', href: '#' },
        ],
      },
    ],
    secondaryLinks: [
      { text: 'Términos', href: 'terms' },
      { text: 'política de privacidad', href: 'privacy' },
    ],
    socialLinks: [
      { ariaLabel: 'Twitter', icon: 'tabler:brand-twitter', href: '#' },
      { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/todoserviscostarica/' },
      { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/TodoServisCostaRica' },
      { ariaLabel: 'RSS', icon: 'tabler:rss', href: '/rss.xml' },
      { ariaLabel: 'Github', icon: 'tabler:brand-github', href: '#' },
    ],
    footNote: `<span class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 float-left rounded-sm bg-[]"></span>
      Hecho por <a class="text-blue-600 hover:underline dark:text-gray-200" href="https://datagrove.com/"> Datagrove </a> Todos los derechos reservados.`,
  },

  productCategoryInfo: {
    categories: [
      { name: 'Jardinería', description: 'Obtenga ayuda con su jardín y paisajismo.', ariaLabel: "Jardinería", id: "1" },
      { name: 'Construcción', description: 'Nueva construcción, adiciones o servicios de reparación', ariaLabel: "Construcción", id: "3" },
      { name: 'Belleza', description: 'Salones, Barberos, y otros cuidados personales.', ariaLabel: "Belleza", id: "2" },
      { name: 'Automóvil', description: 'Servicios Automotrices', ariaLabel: "Automóvil", id: "5" },
      { name: 'Computadora', description: 'Reparación y servicios de computadoras', ariaLabel: "Computadora", id: "4" },
      { name: 'Creativadad', description: 'Servicios creativos', ariaLabel: "Creatividad", id: "6" },
      { name: 'Financiera', description: 'Servicios financieros', ariaLabel: "Financiera", id: "7" },
      { name: 'Limpieza', description: 'Servicios de Limpieza', ariaLabel: "Limpieza", id: "8" },
      { name: 'Mascotas', description: 'Servicios para mascotas', ariaLabel: "Mascotas", id: "9" },
      { name: 'Legal', description: 'Servicios Legales', ariaLabel: "Servicios Legales", id: "10" },
      { name: 'Salud', description: 'Servicios de salud', ariaLabel: "Salud", id: "11" },
      { name: 'Servicios Laborales', description: 'Servicios Laborales', ariaLabel: "Servicios Laborales", id: "12" },
      { name: 'Viajar', description: 'Servicios de viaje', ariaLabel: "Viajar", id: "13" },
      // Add more products as needed
    ],
  },

  homePageText: {
    headline: "Todo lo que necesita para hacer el trabajo.",
    subHeadline: "Los proveedores publican servicios. Publicaciones de búsqueda de clientes. El trabajo se hace.",
    ariaLabel: "Imagen de información de marcador de posición",
  },

} as const;
