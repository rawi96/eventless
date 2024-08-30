import SidebarNavigation from '@/components/SidebarNavigation';
import ReactSwagger from '@/components/Swagger';

export default async function IndexPage() {
  return (
    <SidebarNavigation currentPage="Documentation">
      <ReactSwagger />
    </SidebarNavigation>
  );
}
