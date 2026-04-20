import { useRoute } from 'preact-iso';
import { DataCoreLayout } from './Core/layouts/DataCoreLayout';
import Home from './Home/index';
import Users from './Users/index';
import { NotFound } from '../_404';
import { FunctionalComponent } from 'preact';
import './style.css';

const routes: Record<string, FunctionalComponent> = {
    '/data-core': Home,
    '/data-core/usuarios': Users,
};

export default function RoutesDataCore() {
    const { path } = useRoute();
    const Component = routes[path] ?? NotFound;

    return (
        <DataCoreLayout>
            <Component />
        </DataCoreLayout>
    );
}