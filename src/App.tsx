import { AppProviders } from "@/app/providers/AppProviders";
import { AppRouter } from "@/app/router/AppRouter";
import { PageErrorBoundary } from "@/shared/components/feedback/PageErrorBoundary";

const App = () => {
  return (
    <AppProviders>
      <PageErrorBoundary>
        <AppRouter />
      </PageErrorBoundary>
    </AppProviders>
  );
};

export default App;
