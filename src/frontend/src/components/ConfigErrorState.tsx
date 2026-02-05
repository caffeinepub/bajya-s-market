import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface ConfigErrorStateProps {
  error: Error;
}

export default function ConfigErrorState({ error }: ConfigErrorStateProps) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-2xl">Configuration Error</CardTitle>
              <CardDescription>Unable to connect to the backend service</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Backend Configuration Missing</AlertTitle>
            <AlertDescription className="mt-2">
              {error.message}
            </AlertDescription>
          </Alert>

          <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
            <h3 className="font-semibold">What does this mean?</h3>
            <p className="text-sm text-muted-foreground">
              The application cannot connect to the Internet Computer backend because the canister ID is not properly configured. 
              This typically happens when the deployment configuration is incomplete.
            </p>
          </div>

          <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
            <h3 className="font-semibold">Next Steps</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">1.</span>
                <span>Ensure the <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">env.json</code> file exists at the root of the deployment</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">2.</span>
                <span>Verify that <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">BACKEND_CANISTER_ID</code> contains a valid canister ID (not a placeholder)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">3.</span>
                <span>Confirm that <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">DFX_NETWORK</code> is set to <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ic</code> for production</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">4.</span>
                <span>Redeploy the application with the correct configuration</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleReload} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Connection
            </Button>
          </div>

          <div className="rounded-lg border border-muted bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">
              <strong>For developers:</strong> Check the browser console for detailed configuration logs. 
              The error indicates that the frontend cannot resolve the backend canister ID from the runtime configuration.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
