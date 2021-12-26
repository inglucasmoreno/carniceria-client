const { guessProductionMode } = require("@ngneat/tailwind");
const { teal } = require("tailwindcss/colors");
const colors = require('tailwindcss/colors');

module.exports = {
    prefix: '',
    purge: {
        enabled: guessProductionMode(),
        content: [
            './src/**/*.{html,ts}',
        ]
    },
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                primary: colors.gray,
                secondary: colors.red,
                primaryColor: "#79222a",
                secondaryColor: "#79222a",
                orange: colors.orange
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};