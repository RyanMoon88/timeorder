import { createGlobalState } from 'react-hooks-global-state';

export const { GlobalStateProvider, useGlobalState } = createGlobalState({
    login: null,
    backdrop: false,
    errorDialog: false,
    errorMessage: ""
});
