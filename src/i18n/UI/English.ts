export const English = {
  textDirection: 'ltr',

  pageTitles: {
    services: 'Services',
    signUp: 'Sign Up',
    login: 'Login',
    home: 'Home',
    signIn: 'Sign In',
    createClientAccount: 'Create Client Account',
    editClientAccount: 'Edit Client Account',
    viewClientAccount: 'View Client Account',
    createPost: 'Create Post',
    createProviderAccount: 'Create Provider Account',
    editProviderAccount: 'Edit Provider Account',
    viewProviderAccount: 'Provider Profile Self View',
    page404: '404 - Page Not Found',
    requestPasswordReset: 'Request Password Reset',
    resetPassword: 'Set New Password',
  },

  buttons: {
    providerProfile: 'My Provider Profile',
    editProfile: 'Edit Profile',
    register: 'Register',
    uploadImage: 'Upload Image',
    uploading: 'Uploading ...',
    loading: 'Loading...',
    login: 'Login',
    signUp: 'sign up',
    signIn: 'sign in',
    signOut: 'Sign Out',
    returnHome: 'Click to Return Home',
    reset: 'Reset',
  },

  messages: {
    noAccount: "Don't have an account? Click here to",
    passwordLength: 'Password must be at least 6 characters long',
    passwordMatch: 'Passwords do not match',
    passwordReset: 'Password Reset',
    forgotPassword: 'Forgot your password? Click here to',
    alreadyAccount: 'Already have an account? Click here to',
    error404: 'Something went wrong',
    onlyProvider: "Only providers can create posts.",
    signInAsProvider: "Please sign in to a provider account before posting.",
    checkEmail: "Check your email for the reset link!",
    checkConfirmEmail: 'Check your email for the confirmation link!',
    signIn: "Please sign in to access this page.",
    createProviderAccount: "Please sign in to create a provider profile.",
    createClientAccount: "Please sign in to create a client profile.",
    viewProviderAccount: "You do not have a provider account please create one to view your provider profile.",
    noPosts: "No posts available.",
  },

  formLabels: {
    title: 'Title',
    serviceCategory: 'Service Category',
    postContent: 'Post Content',
    country: 'Country',
    majorMunicipality: 'Major Municipality',
    minorMunicipality: 'Minor Municipality',
    governingDistrict: 'Governing District',
    search: 'Search',
    firstName: 'First Name',
    lastName: 'Last Name',
    providerName: "Provider Name",
    phone: 'Phone Number',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    displayName: 'Display Name',
  },

  headerData: {
    links: [
      {
        text: 'Home',
        href: '/',
      },
      {
        text: 'Services',
        href: '/services',
      },
    ],
    actions: [

    ],
  },

  footerData: {
    links: [
      {
        title: 'Product',
        links: [
          { text: 'Features', href: '#' },
          { text: 'Security', href: '#' },
          { text: 'Team', href: '#' },
          { text: 'Enterprise', href: '#' },
          { text: 'Customer stories', href: '#' },
          { text: 'Pricing', href: '#' },
          { text: 'Resources', href: '#' },
        ],
      },
      {
        title: 'Platform',
        links: [
          { text: 'Developer API', href: '#' },
          { text: 'Partners', href: '#' },
        ],
      },
      {
        title: 'Support',
        links: [
          { text: 'Docs', href: '#' },
          { text: 'Community Forum', href: '#' },
          { text: 'Professional Services', href: '#' },
          { text: 'Skills', href: '#' },
          { text: 'Status', href: '#' },
        ],
      },
      {
        title: 'Company',
        links: [
          { text: 'About', href: '#' },
          { text: 'Blog', href: '#' },
          { text: 'Careers', href: '#' },
          { text: 'Press', href: '#' },
          { text: 'Inclusion', href: '#' },
          { text: 'Social Impact', href: '#' },
          { text: 'Shop', href: '#' },
        ],
      },
    ],
    secondaryLinks: [
      { text: 'Terms', href: '/terms' },
      { text: 'Privacy Policy', href: '/privacy' },
    ],
    socialLinks: [
      { ariaLabel: 'Twitter', icon: 'tabler:brand-twitter', href: '#' },
      { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
      { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
      { ariaLabel: 'RSS', icon: 'tabler:rss', href: '/rss.xml' },
      { ariaLabel: 'Github', icon: 'tabler:brand-github', href: '#' },
    ],
    footNote: `
      <span class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 float-left rounded-sm bg-[]"></span>
      Made by <a class="text-blue-600 hover:underline dark:text-gray-200" href="https://datagrove.com/"> Datagrove </a> All rights reserved.
    `,
  },

productCategoryInfo:{
    categories: [
      { name: 'Gardening', description: 'Get help with your garden and landscaping.', ariaLabel: "Gardening", id: "1" },
      { name: 'Construction', description: 'New Construction, Additions, or Repair Services', ariaLabel: "Construction", id: "3" },
      { name: 'Beauty', description: 'Salons, Barbers, and other personal care.', ariaLabel: "Beauty", id: "2" },
      { name: 'Automotive', description: 'Automotive Services', ariaLabel: "Automotive", id: "5" },
      { name: 'Computer', description: 'Computer Repair and Services', ariaLabel: "Computer", id: "4" },
      { name: 'Creative', description: 'Creative Services', ariaLabel: "Creative", id: "6" },
      { name: 'Financial', description: 'Financial Services', ariaLabel: "Financial", id: "7" },
      { name: 'Cleaning', description: 'Cleaning Services', ariaLabel: "Cleaning", id: "8" },
      { name: 'Pets', description: 'Pet Services', ariaLabel: "Pets", id: "9" },
      { name: 'Legal', description: 'Legal Services', ariaLabel: "Legal", id: "10" },
      { name: 'Health', description: 'Health Services', ariaLabel: "Health", id: "11" },
      { name: 'Labor', description: 'Labor Services', ariaLabel: "Labor", id: "12" },
      { name: 'Travel', description: 'Travel Services', ariaLabel: "Travel", id: "13" },
      // Add more products as needed
    ]
  }
} as const;
