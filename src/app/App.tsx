
import { I18nProvider } from "./providers/I18nProvider";
import { ThemeProvider } from "./providers/ThemeProvider";

import { AppLayout } from "../components/layout/AppLayout";

export function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <AppLayout />
      </ThemeProvider>
    </I18nProvider>
  );
}
