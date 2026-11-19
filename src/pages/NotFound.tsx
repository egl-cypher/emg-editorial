import { PageHero } from '../components/Sections';
import { Button } from '../components/ui';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page not found');
  return (
    <PageHero badge="404" title="This page could not be found." aside="The page may have moved. Try our services, or get in touch.">
      <div className="flex flex-wrap gap-3">
        <Button to="/">Back to Home</Button>
        <Button to="/services" variant="secondary">Explore Our Services</Button>
      </div>
    </PageHero>
  );
}
