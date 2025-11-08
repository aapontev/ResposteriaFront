import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideServerRendering } from '@angular/platform-server';

export default function bootstrap(context: any) {
  return bootstrapApplication(AppComponent, {
    ...appConfig,
    providers: [
      provideServerRendering(),
      ...(appConfig.providers ?? [])
    ],
  }, context);
}
