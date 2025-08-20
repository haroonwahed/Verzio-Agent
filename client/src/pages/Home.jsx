import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Zap, Users, Target } from 'lucide-react';

function Home() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Content",
      description: "Generate high-quality text, images, and voice content using advanced AI models."
    },
    {
      icon: Zap,
      title: "Workflow Automation",
      description: "Build custom workflows to automate your content creation process."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together with your team to create amazing content at scale."
    },
    {
      icon: Target,
      title: "SEO Optimization",
      description: "Optimize your content for search engines and maximize your reach."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">Verzio</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              AI-Powered Content Creation
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                Made Simple
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Generate high-quality text, images, and voice content with our advanced AI platform. 
              Build workflows, optimize for SEO, and scale your content creation like never before.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link 
                to="/signup" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-medium flex items-center space-x-2"
              >
                <span>Start Creating</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/login" 
                className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg text-lg font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to create amazing content
            </h2>
            <p className="text-lg text-gray-600">
              Powerful AI tools designed for modern content creators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <feature.icon className="w-12 h-12 text-purple-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to transform your content creation?
          </h2>
          <p className="text-lg text-purple-100 mb-8">
            Join thousands of creators who are already using Verzio to generate amazing content.
          </p>
          <Link 
            to="/signup" 
            className="bg-white hover:bg-gray-50 text-purple-600 px-8 py-4 rounded-lg text-lg font-medium inline-flex items-center space-x-2"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;