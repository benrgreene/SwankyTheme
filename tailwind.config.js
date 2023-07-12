module.exports = {
  mode: 'jit',
  safelist: [
    'justify-start', 'justify-center', 'justify-end', 'items-start', 'items-center', 'items-end', 'col-span-2', 'left-[-100vw]',
    'bg-white', 'bg-black', 'bg-primary', 'bg-secondary', 'text-primary', 'text-secondary', 'text-white', 'text-black', 'group-hover:text-primary-active', 'group-hover:text-secondary-active', 'group-hover:text-tertiary-active', 'blur',
    'opacity-0', 'opacity-10', 'opacity-20', 'opacity-30', 'opacity-40', 'opacity-50', 'opacity-60', 'opacity-70', 'opacity-80', 'opacity-90', 'opacity-100',
    'after:opacity-50', 'hover:after:opacity-20', 'lg:row-span-2', 'lg:col-start-2', 'lg:col-span-2', 'lg:col-span-1', 'lg:pb-[50%]', 'lg:pb-[100%]', 'lg:pb-[200%]'
  ],
  content: [
    './src/**/*.html',
    './src/**/*.liquid',
    './src/**/*.js',
    './src/**/*.jsx'
  ],
  theme: {
    container: {
      maxWidth: "1440px"
    },
    colors: {
      // Base Colors
      "transparent": "transparent",
      "white": "var(--white)",
      "black": "var(--black)",
      "true-black": "var(--true-black)",
      // Brand Colors
      "primary": "var(--primary)",
      "primary-active": "var(--primary-active)",
      "secondary": "var(--secondary)",
      "secondary-active": "var(--secondary-active)",
      "tertiary": "var(--tertiary)",
      "tertiary-active": "var(--tertiary-active)",
      // Utilities
      "error": "var(--error)",
      // Greys
      "grey-1": "var(--grey-1)",
      "grey-2": "var(--grey-2)",
      "grey-3": "var(--grey-3)",
      "grey-4": "var(--grey-4)",
      "grey-5": "var(--grey-5)",
      "grey-6": "var(--grey-6)",
      "grey-7": "var(--grey-7)",
      "grey-8": "var(--grey-8)",
      "grey-9": "var(--grey-9)",
    },
    fontFamily: {
      "sans":['Arial', 'sans-serif']
    },
    screens: {
      // Media query breakpoints
      // All breakpoints use min-width
      'xs': '340px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      gridTemplateColumns: {
        'page': '23.25rem 1fr',
        'header': '1fr 7rem 1fr',
      },
      fontSize: {
        // This will need to be customized for each project's font stack based on the Style Guide
        // SEE: https://tailwindcss.com/docs/font-size
      },
      borderRadius: {
        // Add border radius configurations here if Talwind's defaults are not enough.
        // SEE THIS BEFORE ADDING: https://tailwindcss.com/docs/border-radius
      },
      borderColor: theme => theme('colors'),
      fill: theme => theme('colors'),
      stroke: theme => theme('colors')
    }
  },
  variants: {
    extend: {
      backgroundColor: ['hover', 'checked', 'disabled'],
      opacity: ['disabled'],
      borderWidth: ['hover', 'checked'],
      borderColor: ['hover', 'checked'],
      boxShadow: ['hover', 'group-focus'],
      fontFamily: ['hover', 'focus', 'visited'],
      fill: ['hover', 'group-hover'],
      stroke: ['hover', 'group-hover']
    },
  },
  plugins: [],
}
