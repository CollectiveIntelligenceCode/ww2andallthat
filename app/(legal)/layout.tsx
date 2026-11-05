import { chrome } from "@/lib/wireframes";
import LinkInterceptor from "@/components/wf/LinkInterceptor";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const { scope, css, header, footer } = chrome();
  return (
    <div data-wf={scope}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="page">
        <div dangerouslySetInnerHTML={{ __html: header }} />
        {children}
        <div dangerouslySetInnerHTML={{ __html: footer }} />
      </div>
      <LinkInterceptor />
    </div>
  );
}
