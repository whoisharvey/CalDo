export const styleLibrary = {
  // Styles for progress bars
  progressBar: {
    // Container for the progress bar
    container: `
      border border-gray-100 dark:border-gray-700 rounded-lg p-2
    `,
    // The actual progress bar element
    bar: `
      h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden
    `,
    // The fill of the progress bar
    fill: `
      h-full bg-[var(--primary)]
    `,
     // The empty state of the progress bar
    empty: `
      h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden
    `
  },
  // Styles for buttons
  button: {
    // Primary button style
    primary: `
      bg-[var(--primary)] hover:bg-[var(--primary-dark)]
      text-white rounded-full shadow-md
      transition-all duration-200 ease-in-out
      hover:shadow-lg active:scale-95
      flex items-center justify-center
    `,
    // Secondary button style
    secondary: `
      bg-[var(--hover)] text-[var(--primary)]
      hover:bg-[var(--primary-light)] hover:bg-opacity-20
      rounded-lg transition-colors duration-200
    `
  },
  // Styles for header elements
  header: {
    // Icon button style in header
    iconButton: `
      p-1 rounded-full hover:bg-white/20 transition-colors
    `
  },
  // Styles for icons
  icon: {
    // Container for icons
    container: `
      w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center mx-auto transition-all
    `,
    // Text style for icons
    text: `
      text-base md:text-lg transition-opacity
    `
  },
  // Styles for task cards
  taskCard: {
    // Container for task cards with hover effect
    container: `
      border border-gray-100 dark:border-gray-700 rounded-lg p-2 md:p-4 
      hover:shadow-md hover:border-[var(--primary-light)] dark:hover:border-[var(--primary-light)]
      transition-all duration-200 ease-in-out
      transform hover:-translate-y-0.5
      cursor-pointer
    `,
    // Container for task cards without hover effect
    noHover: `
      border border-gray-100 dark:border-gray-700 rounded-lg p-2 md:p-4
    `
  },
  // Styles for dialogs
  dialog: {
    // Overlay for dialogs
    overlay: `
      fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm
      transition-opacity duration-300
    `,
    // Content container for dialogs
    content: `
      fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
      bg-white dark:bg-gray-700 rounded-lg shadow-xl z-50 w-[95%] max-w-md 
      max-h-[90vh] overflow-y-auto p-4 md:p-6
      transition-all duration-300 ease-out
    `
  },
  // Styles for input fields
  input: {
    // Default style for input fields
    field: `
      w-full px-3 py-2 
      bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg
      text-gray-700 dark:text-gray-100 text-sm
      transition-all duration-200 ease-in-out
      outline-none
      focus:border-[var(--primary)]
      focus:ring-2
      focus:ring-[var(--primary)]
      focus:ring-opacity-20
    `,
    // Style for checkboxes
    checkbox: `
      rounded border-gray-300 
      text-[var(--primary)]
      focus:ring-[var(--primary)]
      focus:ring-opacity-25
      transition-all duration-200
    `
  },
  // Styles for focus effects
  focus: {
    // Default focus effect
    default: `
      focus:outline-none
      focus:ring-2
      focus:ring-[var(--primary)]
      focus:ring-opacity-20
    `
  },
  // Styles for text
  text: {
    // Default text color
    default: `
      text-gray-700 dark:text-gray-100
    `,
    // Secondary text color
    secondary: `
      text-gray-500 dark:text-gray-400
    `
  }
}
