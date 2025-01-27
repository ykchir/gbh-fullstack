export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-8">
      <div className="container mx-auto text-center">
        &copy; {new Date().getFullYear()} GBH Vehicle Showcase. All rights
        reserved.
      </div>
    </footer>
  );
}
