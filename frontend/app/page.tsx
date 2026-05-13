'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { ArrowRight, BookOpen, Users, Calendar, MessageSquare, Star } from 'lucide-react';

export default function HomePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="container-max flex items-center justify-between py-4">
          <div className="text-2xl font-bold text-primary-600">
            🎓 HomeTuition
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {user.name}
                </span>
                <Link
                  href={`/dashboard/${user.role}`}
                  className="btn btn-primary btn-sm"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-secondary btn-sm">
                  Login
                </Link>
                <Link href="/signup" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section container-max">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div>
            <h1 className="heading-1 mb-6">
              Connect with Expert Tutors Online
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              HomeTuition makes it easy to find qualified tutors, book sessions,
              and track progress. Whether you're a student, parent, or tutor,
              our platform has everything you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {!user ? (
                <>
                  <Link href="/signup?role=student" className="btn btn-primary btn-md">
                    Find a Tutor
                    <ArrowRight size={18} className="ml-2" />
                  </Link>
                  <Link href="/signup?role=tutor" className="btn btn-outline btn-md">
                    Become a Tutor
                  </Link>
                </>
              ) : (
                <Link
                  href={`/dashboard/${user.role}`}
                  className="btn btn-primary btn-md"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="bg-primary-100 rounded-2xl h-96 flex items-center justify-center">
            <div className="text-center">
              <BookOpen size={64} className="mx-auto mb-4 text-primary-600" />
              <p className="text-gray-600">Learning Made Easy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-gray-50">
        <div className="container-max">
          <h2 className="heading-2 text-center mb-12">
            Why Choose HomeTuition?
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.id} className="card p-6 text-center hover:shadow-lg transition">
                <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary-600 text-white">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-lg mb-8 text-primary-100 max-w-2xl mx-auto">
            Join thousands of students and tutors already using HomeTuition to
            achieve their educational goals.
          </p>
          {!user && (
            <Link href="/signup" className="btn btn-outline btn-lg">
              Get Started Today
              <ArrowRight size={18} className="ml-2" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container-max">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">HomeTuition</h3>
              <p className="text-sm">
                Connecting students and tutors for effective learning.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 HomeTuition. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    id: 1,
    icon: <Users size={24} className="text-primary-600" />,
    title: 'Find Tutors',
    description:
      'Browse and filter qualified tutors by subject, rates, and availability.',
  },
  {
    id: 2,
    icon: <Calendar size={24} className="text-primary-600" />,
    title: 'Easy Booking',
    description: 'Schedule sessions with a few clicks using our calendar system.',
  },
  {
    id: 3,
    icon: <MessageSquare size={24} className="text-primary-600" />,
    title: 'Direct Messaging',
    description:
      'Communicate directly with your tutor before and after sessions.',
  },
  {
    id: 4,
    icon: <Star size={24} className="text-primary-600" />,
    title: 'Ratings & Reviews',
    description: 'Make informed decisions based on tutor reviews and ratings.',
  },
];
