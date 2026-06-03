import { PageContainer, PageHeader, SiteFooter } from "@/components/console-ui";
import { sectionStack } from "@/lib/design-tokens";

type SitePageProps = {
  eyebrow: string;
  title: string;
  description?: string;
  wide?: boolean;
  children: React.ReactNode;
};

export function SitePage({
  eyebrow,
  title,
  description,
  wide = false,
  children,
}: SitePageProps) {
  return (
    <div
      className={`relative isolate text-white ${sectionStack} pb-16 pt-6 md:pb-24 md:pt-8`}
    >
      <PageContainer>
        <div className={`mx-auto ${wide ? "max-w-6xl" : "max-w-3xl"}`}>
          <PageHeader label={eyebrow} title={title} note={description} />
          {children}
        </div>
      </PageContainer>

      <SiteFooter />
    </div>
  );
}
