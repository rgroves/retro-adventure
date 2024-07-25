import { defaultDarkModeOverride, Theme } from "@aws-amplify/ui-react";

/**
 * @see https://ui.docs.amplify.aws/react/theming#theme-object
 */
export const theme: Theme = {
    // Note: By default it will extend from the defaultTheme Amplify UI provides.
    name: 'retro-theme',
    overrides: [defaultDarkModeOverride],
    // TODO: override theme
    // tokens: {
    //     colors: {
    //         font: {
    //             primary: { value: 'red' },
    //         },
    //     },
    // },
};