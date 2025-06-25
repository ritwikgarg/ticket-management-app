export function Footer() {
  return (
    <footer className="w-full p-4 mt-4 bg-gray-100 dark:bg-gray-900 border-t">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-300">
        <div className="mb-2 md:mb-0">
          © {new Date().getFullYear()} Merai. All rights reserved.
        </div>
        <div className="flex gap-4">
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:underline">
            Terms of Service
          </a>
          <a href="mailto:support@example.com" className="hover:underline">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
