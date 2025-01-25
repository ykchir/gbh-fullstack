import Breadcrumb from "../ui/Breadcrumb";

export default function Header() {
  return (
    <header className="bg-white shadow p-4">
      <nav className="container mx-auto">
        <Breadcrumb />
      </nav>
    </header>
  );
}
