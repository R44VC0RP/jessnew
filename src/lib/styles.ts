export const typography = {
  heading: 'font-poppins font-bold',
  body: 'font-poppins font-normal'
} as const;

export const spacing = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-12 sm:py-16 lg:py-20'
} as const;

export const cardStyles = {
  base: 'rounded-2xl transition-all duration-500',
  hover: 'hover:shadow-lg hover:scale-[1.02] duration-300',
  dark: 'bg-[#242424] text-offWhite',
  light: 'bg-white text-offBlack'
} as const;

export const rules = {
  buttons: {
    primary: 'bg-[#557187] text-white rounded-full px-6 py-2 transition-all hover:bg-[#445a6d]',
    secondary: 'border border-[#557187] text-[#557187] rounded-full px-6 py-2 transition-all hover:bg-[#557187] hover:text-white'
  }
} as const; 