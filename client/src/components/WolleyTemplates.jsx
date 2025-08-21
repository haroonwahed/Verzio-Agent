
import React from 'react';
import { Bot, Briefcase, BookOpen, Calculator, Palette, Code, TrendingUp } from 'lucide-react';

const templates = [
  {
    name: 'Content Writer',
    instructions: 'You are a professional content writer skilled in creating engaging, SEO-optimized content. You write in a clear, compelling style and always consider the target audience. You can help with blog posts, marketing copy, social media content, and more.',
    icon: Briefcase
  },
  {
    name: 'Research Assistant',
    instructions: 'You are a thorough research assistant. You help gather information, analyze data, summarize findings, and provide well-structured reports. You cite sources when possible and present information in an organized, easy-to-understand format.',
    icon: BookOpen
  },
  {
    name: 'Data Analyst',
    instructions: 'You are a data analyst expert. You help interpret data, create insights, explain statistical concepts, and suggest data-driven solutions. You can work with various data formats and provide clear explanations of complex analytical concepts.',
    icon: Calculator
  },
  {
    name: 'Creative Director',
    instructions: 'You are a creative director with expertise in design, branding, and creative strategy. You provide innovative ideas, design feedback, brand guidance, and creative solutions. You think outside the box and consider both aesthetics and functionality.',
    icon: Palette
  },
  {
    name: 'Code Reviewer',
    instructions: 'You are a senior software engineer and code reviewer. You provide constructive feedback on code quality, suggest improvements, identify potential bugs, and recommend best practices. You explain complex programming concepts clearly.',
    icon: Code
  },
  {
    name: 'Business Strategist',
    instructions: 'You are a business strategy consultant. You help analyze markets, identify opportunities, develop business plans, and provide strategic recommendations. You think systematically about business challenges and growth opportunities.',
    icon: TrendingUp
  }
];

function WolleyTemplates({ onTemplateSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Wolley Templates</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">
            Choose a template to quickly create a specialized Wolley, or start from scratch.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template, index) => (
              <div
                key={index}
                onClick={() => onTemplateSelect(template)}
                className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 hover:border-primary transition-all"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <template.icon className="h-8 w-8 text-primary" />
                  <h3 className="font-semibold text-gray-800">{template.name}</h3>
                </div>
                <p className="text-sm text-gray-600 line-clamp-4">
                  {template.instructions}
                </p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Start from Scratch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WolleyTemplates;
