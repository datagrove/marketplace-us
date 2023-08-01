export const Spanish = {
  textDirection: 'ltr',

  pageTitles: {
    services: 'Servicios',
    signup: 'Registrarse',
    login: 'Iniciar sesión',
    home: 'Inicio',
    signIn: 'Iniciar sesión',
    createClientAccount: 'Crear cuenta de cliente',
    editClientAccount: 'Editar Cuenta de Cliente',
    viewClientAccount: 'Ver Cuenta de Cliente',
    createPost: 'Crear Publicación',
    createProviderAccount: 'Crear Cuenta de Proveedor',
    editProviderAccount: 'Editar Cuenta de Proveedor',
    viewProviderAccount: 'Vista Propia del Perfil del Proveedor',
    page404: '404 - Página no Encontrada',
    requestPasswordReset: 'Petición para la Recuperación de Contraseña',
    resetPassword: 'Restablecer la Contraseña',
  },

  buttons: {
    providerProfile: 'Mi Perfil de Proveedor',
    editProfile: 'Editar perfil',
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
  },

  messages: {
    noAccount: "¿No tienes una cuenta? Click aquí para",
    passwordLength: 'La contraseña debe contener 6 caracteres como mínimo',
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
    viewProviderAccount: "No tiene una cuenta de proveedor, cree una para ver su perfil de proveedor",
    noPosts: "No hay publicaciones disponibles",
  },

  formLabels: {
    title: 'Título',
    serviceCategory: 'Categoría de servicio',
    postContent: 'Publicar Contenido',
    country: 'País',
    majorMunicipality: 'Provincia',
    minorMunicipality: 'Canton',
    governingDistrict: 'Districto',
    search: 'Buscar',
    firstName: 'Nombre de pila',
    lastName: 'Apellido',
    providerName: "Nombre del proveedor",
    phone: 'Número de teléfono',
    email: 'Correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'confirmar Contraseña',
    displayName: 'Nombre para mostrar',
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
        title: 'Compañía',
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
      { text: 'Términos', href: 'es/terms' },
      { text: 'política de privacidad', href: 'es/privacy' },
    ],
    socialLinks: [
      { ariaLabel: 'Twitter', icon: 'tabler:brand-twitter', href: '#' },
      { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
      { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
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
      { name: 'Automotor', description: 'Servicios Automotrices', ariaLabel: "Automotor", id: "5" },
      { name: 'Computadora', description: 'Reparación y servicios de computadoras', ariaLabel: "Computadora", id: "4" },
      { name: 'Creativa', description: 'Servicios creativos', ariaLabel: "Creativa", id: "6" },
      { name: 'Financiera', description: 'Servicios financieros', ariaLabel: "Financiera", id: "7" },
      { name: 'Limpieza', description: 'Servicios de Limpieza', ariaLabel: "Limpieza", id: "8" },
      { name: 'Mascotas', description: 'Servicios para mascotas', ariaLabel: "Mascotas", id: "9" },
      { name: 'Legal', description: 'Servicios Legales', ariaLabel: "Servicios Legales", id: "10" },
      { name: 'Salud', description: 'Servicios de salud', ariaLabel: "Salud", id: "11" },
      { name: 'Mano de obra', description: 'Servicios Laborales', ariaLabel: "Mano de obra", id: "12" },
      { name: 'Viajar', description: 'Servicios de viaje', ariaLabel: "Viajar", id: "13" },
      // Add more products as needed
    ],
  }
} as const;
