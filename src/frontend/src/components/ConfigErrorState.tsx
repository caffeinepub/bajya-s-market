import { AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface ConfigErrorStateProps {
  error: Error;
}

export default function ConfigErrorState({ error }: ConfigErrorStateProps) {
  const handleReload = () => {
    // Clear any cached config and reload
    window.location.reload();
  };

  const handleCheckEnvJson = () => {
    // Open env.json in new tab with cache-busting
    const timestamp = Date.now();
    window.open(`/env.json?t=${timestamp}`, '_blank');
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
            <AlertTitle>Backend Configuration Missing or Invalid</AlertTitle>
            <AlertDescription className="mt-2">
              {error.message}
            </AlertDescription>
          </Alert>

          <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
            <h3 className="font-semibold">What does this mean?</h3>
            <p className="text-sm text-muted-foreground">
              The application cannot connect to the Internet Computer backend because the runtime configuration is missing or contains invalid values. 
              This typically happens when:
            </p>
            <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
              <li>The <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">env.json</code> file is missing from the deployment</li>
              <li>The <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">BACKEND_CANISTER_ID</code> contains a placeholder value instead of the actual IC mainnet canister ID</li>
              <li>The deployment process did not complete successfully</li>
            </ul>
          </div>

          <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
            <h3 className="font-semibold">Required Configuration</h3>
            <p className="text-sm text-muted-foreground">
              The <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">env.json</code> file must exist at the deployment root with:
            </p>
            <div className="mt-2 rounded bg-muted p-3 font-mono text-xs">
              <pre className="text-foreground">{`{
  "BACKEND_CANISTER_ID": "xxxxx-xxxxx-xxxxx-xxxxx-xxx",
  "DFX_NETWORK": "ic"
}`}</pre>
            </div>
            <p className="text-sm text-muted-foreground">
              Where <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">xxxxx-xxxxx-xxxxx-xxxxx-xxx</code> is your actual backend canister ID from the IC mainnet.
            </p>
          </div>

          <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
            <h3 className="font-semibold">Troubleshooting Steps</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">1.</span>
                <span>Click "Check env.json" below to verify the file exists and contains valid values (not placeholders)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">2.</span>
                <span>Ensure <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">BACKEND_CANISTER_ID</code> is set to your actual backend canister ID from IC mainnet</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">3.</span>
                <span>Confirm <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">DFX_NETWORK</code> is set to <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">"ic"</code> for production deployments</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">4.</span>
                <span>If the configuration is incorrect, redeploy the application with the correct values</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">5.</span>
                <span>After fixing the configuration, click "Retry Connection" to reload the application</span>
              </li>
            </ol>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleCheckEnvJson} variant="outline" className="flex-1">
              <ExternalLink className="mr-2 h-4 w-4" />
              Check env.json
            </Button>
            <Button onClick={handleReload} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Connection
            </Button>
          </div>

          <div className="rounded-lg border border-muted bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">
              <strong>For developers:</strong> Check the browser console for detailed configuration logs and error messages. 
              The smoke check will show exactly which step failed (configuration loading vs. backend connectivity).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
