import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50">
      <div className="container-custom py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-neutral-900">
              FivoPay <span className="text-gradient-primary">Banking</span>
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Modern Islamic Banking Management System
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/login"
              className="btn-base bg-primary-500 text-white hover:bg-primary-600 shadow-stripe"
            >
              Go to Login
            </Link>
            <Link
              href="/dashboard"
              className="btn-base bg-white text-primary-600 border-2 border-primary-500 hover:bg-primary-50"
            >
              View Dashboard
            </Link>
            <Link
              href="/components-showcase"
              className="btn-base bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
            >
              Component Library
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="card p-6 card-hover">
              <div className="w-12 h-12 bg-primary-100 rounded-stripe flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Component Library</h3>
              <p className="text-neutral-600">
                Comprehensive set of reusable UI components following Stripe design guidelines
              </p>
            </div>

            <div className="card p-6 card-hover">
              <div className="w-12 h-12 bg-success-100 rounded-stripe flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Islamic Banking</h3>
              <p className="text-neutral-600">
                Built specifically for ethical and conventional banking operations
              </p>
            </div>

            <div className="card p-6 card-hover">
              <div className="w-12 h-12 bg-warning-100 rounded-stripe flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Modern Stack</h3>
              <p className="text-neutral-600">
                Built with Next.js, TypeScript, and Tailwind CSS for optimal performance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
