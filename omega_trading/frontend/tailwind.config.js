const colors = require('tailwindcss/colors')

module.exports = {
    purge: ['./dist/*.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            black: colors.black,
            white: colors.white,
            gray: colors.trueGray,
            indigo: colors.indigo,
            red: colors.rose,
            yellow: colors.amber,
            main: {
                light: '#2a2d49',
                dark: '#17182a',
                area: '#31323f',
                text: '#fff',
                gold: '#f3b629'
            }
        }
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
