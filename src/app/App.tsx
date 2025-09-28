import AppContext, { AppDispatchContext, useAppReducer } from './AppContext';
import GraphRenderer from './graph/GraphRenderer';
import AppMonitor from './AppMonitor';
import { ThemeProvider } from "@/components/theme-provider"

function App() {
    const [context, dispatch] = useAppReducer();
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AppContext value={context}>
                <AppDispatchContext value={dispatch}>
                    <AppMonitor />
                    <GraphRenderer />
                </AppDispatchContext>
            </AppContext>
        </ThemeProvider>
    );
}


export default App;
