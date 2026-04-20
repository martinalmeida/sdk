import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';

import { index } from './pages/Auth/index';
import RoutesDataCore from './pages/DataCore/Routes';
import { NotFound } from './pages/_404';
import './style.css';

export function App() {
	return (
		<LocationProvider>
			<main>
				<Router>
					<Route path="/" component={index} />
					<Route path="/data-core/:rest*" component={RoutesDataCore} />
					<Route default component={NotFound} />
				</Router>
			</main>
		</LocationProvider>
	);
}

if (typeof window !== 'undefined') {
	const appElement = document.getElementById('app')! as HTMLElement;
	hydrate(<App />, appElement);
}

export async function prerender(data: Record<string, unknown>) {
  return await ssr(<App {...data} />);
}