'use client';

import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button, Card, Modal, Drawer } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  FileText,
  BarChart3,
  TrendingUp,
  History,
  Settings,
  Plus,
  Mic,
  Send,
  ChevronDown,
  Lightbulb,
  Moon,
  Sun,
  AlertTriangle,
  IndianRupee,
  Users,
  Clock,
  PieChart,
  X,
  Trash2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Question-Answer pairs with responses
interface QA {
  question: string;
  answer: string;
  hasChart?: boolean;
  chartData?: any;
  chartType?: 'bar' | 'line' | 'pie';
  chartTitle?: string;
}

const qaDatabase: QA[] = [
  {
    question: 'How many defaulters do I have?',
    answer: 'Based on your current recovery data, you have **127 defaulters** with pending dues. Here\'s the breakdown:\n\n• **Pending Notices**: 45 accounts (15+ days overdue)\n• **First Notice Sent**: 32 accounts\n• **Second Reminder Sent**: 28 accounts\n• **Legal Notice Sent**: 15 accounts\n• **NPA Accounts**: 7 accounts (180+ days overdue)\n\nTotal outstanding amount: **₹2,45,67,890**\n\nI recommend prioritizing accounts with 90+ days overdue for immediate legal action.',
    hasChart: true,
    chartType: 'bar',
    chartTitle: 'Defaulters by Status',
    chartData: [
      { name: 'Pending', count: 45 },
      { name: 'First Notice', count: 32 },
      { name: 'Second Reminder', count: 28 },
      { name: 'Legal Notice', count: 15 },
      { name: 'NPA', count: 7 },
    ],
  },
  {
    question: 'What is the distribution of loans across categories?',
    answer: 'Here\'s the distribution of your loan portfolio across different categories:\n\n• **Personal Loans**: ₹12.5 Crores (35%)\n• **Home Loans**: ₹15.8 Crores (44%)\n• **Business Loans**: ₹5.2 Crores (15%)\n• **Education Loans**: ₹1.8 Crores (5%)\n• **Auto Loans**: ₹0.5 Crores (1%)\n\n**Total Portfolio**: ₹35.8 Crores\n\nHome loans dominate your portfolio, which is typical for a banking institution. Personal loans show strong growth potential.',
    hasChart: true,
    chartType: 'pie',
    chartTitle: 'Loan Distribution by Category',
    chartData: [
      { name: 'Personal Loans', value: 35, amount: 125000000 },
      { name: 'Home Loans', value: 44, amount: 158000000 },
      { name: 'Business Loans', value: 15, amount: 52000000 },
      { name: 'Education Loans', value: 5, amount: 18000000 },
      { name: 'Auto Loans', value: 1, amount: 5000000 },
    ],
  },
  {
    question: 'Show me recovery trends over the last 6 months',
    answer: 'Here are your recovery trends for the last 6 months:\n\n• **January**: ₹45.2 Lakhs recovered\n• **February**: ₹52.8 Lakhs recovered\n• **March**: ₹48.5 Lakhs recovered\n• **April**: ₹61.3 Lakhs recovered\n• **May**: ₹55.7 Lakhs recovered\n• **June**: ₹58.9 Lakhs recovered\n\n**Total Recovery**: ₹3.22 Crores\n**Average Monthly Recovery**: ₹53.7 Lakhs\n\nYour recovery rate has been consistent with a slight upward trend. April showed the highest recovery, likely due to increased follow-up activities.',
    hasChart: true,
    chartType: 'line',
    chartTitle: 'Recovery Trends (Last 6 Months)',
    chartData: [
      { month: 'Jan', recovery: 4520000 },
      { month: 'Feb', recovery: 5280000 },
      { month: 'Mar', recovery: 4850000 },
      { month: 'Apr', recovery: 6130000 },
      { month: 'May', recovery: 5570000 },
      { month: 'Jun', recovery: 5890000 },
    ],
  },
  {
    question: 'What is my NPA ratio?',
    answer: 'Your current **NPA (Non-Performing Asset) ratio is 2.8%**, which is within acceptable limits for the banking industry.\n\n**Breakdown:**\n• Total Loan Portfolio: ₹35.8 Crores\n• NPA Amount: ₹1.00 Crores\n• NPA Ratio: 2.8%\n• Number of NPA Accounts: 7\n\n**Industry Benchmark**: 3-5%\n\nYour NPA ratio is **below the industry average**, indicating good asset quality. However, I recommend:\n\n1. Strengthening recovery mechanisms for accounts approaching 180 days\n2. Regular monitoring of accounts with 90+ days overdue\n3. Proactive customer engagement for accounts with 60+ days overdue',
  },
  {
    question: 'How many active loans do I have?',
    answer: 'You currently have **1,247 active loans** in your portfolio.\n\n**Status Breakdown:**\n• **Disbursed & Active**: 1,247 loans\n• **Pending Approval**: 89 loans\n• **Under Review**: 156 loans\n• **Closed/Completed**: 2,341 loans\n\n**Active Loan Portfolio Value**: ₹35.8 Crores\n**Average Loan Size**: ₹2.87 Lakhs\n\n**Product-wise Distribution:**\n• Personal Loans: 456 active\n• Home Loans: 312 active\n• Business Loans: 298 active\n• Education Loans: 145 active\n• Auto Loans: 36 active',
  },
  {
    question: 'What is the average loan processing time?',
    answer: 'Your **average loan processing time is 4.2 days**, which is excellent compared to industry standards.\n\n**Processing Time Breakdown:**\n• **Fastest**: 1.5 days (Personal Loans)\n• **Average**: 4.2 days (All Products)\n• **Longest**: 8.5 days (Home Loans)\n\n**By Product:**\n• Personal Loans: 1.5 days\n• Business Loans: 3.2 days\n• Education Loans: 4.8 days\n• Auto Loans: 2.1 days\n• Home Loans: 8.5 days\n\n**Industry Benchmark**: 5-7 days\n\nYour processing time is **better than industry average**. Home loans take longer due to property verification requirements, which is expected.',
    hasChart: true,
    chartType: 'bar',
    chartTitle: 'Average Processing Time by Product',
    chartData: [
      { product: 'Personal', days: 1.5 },
      { product: 'Auto', days: 2.1 },
      { product: 'Business', days: 3.2 },
      { product: 'Education', days: 4.8 },
      { product: 'Home', days: 8.5 },
    ],
  },
  {
    question: 'Show me customer acquisition trends',
    answer: 'Here are your customer acquisition trends for the last 6 months:\n\n• **January**: 145 new customers\n• **February**: 168 new customers\n• **March**: 192 new customers\n• **April**: 178 new customers\n• **May**: 201 new customers\n• **June**: 215 new customers\n\n**Total New Customers**: 1,099\n**Average Monthly Growth**: 183 customers\n**Growth Rate**: 48% increase from January to June\n\nYour customer acquisition is showing **strong positive growth**. March, May, and June were particularly strong months, likely due to marketing campaigns or seasonal factors.',
    hasChart: true,
    chartType: 'line',
    chartTitle: 'Customer Acquisition Trends',
    chartData: [
      { month: 'Jan', customers: 145 },
      { month: 'Feb', customers: 168 },
      { month: 'Mar', customers: 192 },
      { month: 'Apr', customers: 178 },
      { month: 'May', customers: 201 },
      { month: 'Jun', customers: 215 },
    ],
  },
  {
    question: 'What is my collection efficiency?',
    answer: 'Your **collection efficiency is 87.5%**, which is above the industry benchmark of 85%.\n\n**Collection Metrics:**\n• **Total Amount Due**: ₹28.5 Crores\n• **Amount Collected**: ₹24.9 Crores\n• **Collection Efficiency**: 87.5%\n• **Pending Collection**: ₹3.6 Crores\n\n**By Product:**\n• Personal Loans: 92% efficiency\n• Home Loans: 89% efficiency\n• Business Loans: 85% efficiency\n• Education Loans: 88% efficiency\n• Auto Loans: 90% efficiency\n\n**Recommendations:**\n1. Focus on Business Loans collection (lowest efficiency)\n2. Implement automated reminders for upcoming due dates\n3. Strengthen recovery process for overdue accounts',
  },
  {
    question: 'How many loans are approved this month?',
    answer: 'This month, you have **156 loans approved** out of 245 applications received.\n\n**Approval Statistics:**\n• **Applications Received**: 245\n• **Approved**: 156 (63.7%)\n• **Rejected**: 42 (17.1%)\n• **Under Review**: 47 (19.2%)\n\n**Approved Loan Value**: ₹4.2 Crores\n**Average Approved Amount**: ₹2.69 Lakhs\n\n**By Product:**\n• Personal Loans: 68 approved\n• Home Loans: 32 approved\n• Business Loans: 28 approved\n• Education Loans: 18 approved\n• Auto Loans: 10 approved\n\nYour approval rate of **63.7%** is healthy and indicates a balanced risk assessment approach.',
  },
  {
    question: 'What is the total deposit amount?',
    answer: 'Your **total deposit amount is ₹42.5 Crores** across all deposit products.\n\n**Deposit Breakdown:**\n• **Fixed Deposits**: ₹28.5 Crores (67%)\n• **Recurring Deposits**: ₹9.8 Crores (23%)\n• **Savings Accounts**: ₹3.2 Crores (8%)\n• **Current Accounts**: ₹1.0 Crores (2%)\n\n**Deposit Growth:**\n• Last Month: ₹40.2 Crores\n• This Month: ₹42.5 Crores\n• **Growth**: 5.7% month-over-month\n\n**CASA Ratio**: 9.9% (Current + Savings / Total Deposits)\n\nFixed deposits dominate your deposit portfolio, which provides stable funding but at higher profit costs.',
    hasChart: true,
    chartType: 'pie',
    chartTitle: 'Deposit Distribution',
    chartData: [
      { name: 'Fixed Deposits', value: 67, amount: 285000000 },
      { name: 'Recurring Deposits', value: 23, amount: 98000000 },
      { name: 'Savings Accounts', value: 8, amount: 32000000 },
      { name: 'Current Accounts', value: 2, amount: 10000000 },
    ],
  },
  {
    question: 'Show me branch performance comparison',
    answer: 'Here\'s a comparison of your branch performance:\n\n**Top Performing Branches:**\n1. **Branch A**: ₹8.5 Cr loans, 245 customers\n2. **Branch B**: ₹7.2 Cr loans, 198 customers\n3. **Branch C**: ₹6.8 Cr loans, 187 customers\n\n**Key Metrics:**\n• **Total Branches**: 12\n• **Average Loans per Branch**: ₹2.98 Crores\n• **Average Customers per Branch**: 104\n\n**Recommendations:**\n1. Replicate Branch A\'s strategies to other branches\n2. Provide additional training to underperforming branches\n3. Consider expanding Branch A\'s capacity',
    hasChart: true,
    chartType: 'bar',
    chartTitle: 'Branch Performance (Loan Volume)',
    chartData: [
      { branch: 'Branch A', loans: 85000000 },
      { branch: 'Branch B', loans: 72000000 },
      { branch: 'Branch C', loans: 68000000 },
      { branch: 'Branch D', loans: 52000000 },
      { branch: 'Branch E', loans: 48000000 },
    ],
  },
  {
    question: 'What is my loan-to-deposit ratio?',
    answer: 'Your **Loan-to-Deposit (LDR) ratio is 84.2%**, which is within the regulatory limit of 90%.\n\n**Calculation:**\n• Total Loans: ₹35.8 Crores\n• Total Deposits: ₹42.5 Crores\n• **LDR Ratio**: 84.2%\n\n**Regulatory Limit**: 90%\n**Industry Average**: 75-85%\n\nYour LDR ratio is **healthy and compliant**. You have room to grow loans by ₹2.5 Crores before hitting the regulatory limit. However, maintaining a buffer is recommended for liquidity management.',
  },
  {
    question: 'How many customers have overdue payments?',
    answer: 'You have **127 customers with overdue payments**.\n\n**Overdue Breakdown:**\n• **1-30 days**: 45 customers (₹1.2 Cr)\n• **31-60 days**: 32 customers (₹0.8 Cr)\n• **61-90 days**: 28 customers (₹0.6 Cr)\n• **91-180 days**: 15 customers (₹0.4 Cr)\n• **180+ days (NPA)**: 7 customers (₹0.25 Cr)\n\n**Total Overdue**: ₹3.25 Crores\n\n**Action Required:**\n1. Immediate follow-up for 1-30 days overdue\n2. Issue notices for 31-60 days overdue\n3. Legal action for 90+ days overdue\n4. NPA recovery process for 180+ days',
    hasChart: true,
    chartType: 'bar',
    chartTitle: 'Overdue Customers by Days',
    chartData: [
      { period: '1-30 days', customers: 45 },
      { period: '31-60 days', customers: 32 },
      { period: '61-90 days', customers: 28 },
      { period: '91-180 days', customers: 15 },
      { period: '180+ days', customers: 7 },
    ],
  },
  {
    question: 'What is the average profit rate on loans?',
    answer: 'Your **weighted average profit rate is 12.8%** across all loan products.\n\n**By Product:**\n• **Personal Loans**: 15.5% (highest risk)\n• **Business Loans**: 13.2%\n• **Education Loans**: 11.5% (subsidized)\n• **Auto Loans**: 10.8%\n• **Home Loans**: 9.5% (lowest risk)\n\n**Industry Benchmark**: 12-14%\n\nYour average rate is **competitive** and aligned with market standards. Personal loans command higher rates due to unsecured nature, while home loans have lower rates due to collateral.',
  },
  {
    question: 'Show me disbursement trends',
    answer: 'Here are your loan disbursement trends for the last 6 months:\n\n• **January**: ₹5.2 Crores disbursed\n• **February**: ₹5.8 Crores disbursed\n• **March**: ₹6.1 Crores disbursed\n• **April**: ₹5.9 Crores disbursed\n• **May**: ₹6.5 Crores disbursed\n• **June**: ₹6.8 Crores disbursed\n\n**Total Disbursed**: ₹36.3 Crores\n**Average Monthly Disbursement**: ₹6.05 Crores\n**Growth Rate**: 30.8% increase from January to June\n\nYour disbursements show **consistent growth** with June being the strongest month. This indicates healthy loan demand and efficient processing.',
    hasChart: true,
    chartType: 'line',
    chartTitle: 'Loan Disbursement Trends',
    chartData: [
      { month: 'Jan', amount: 52000000 },
      { month: 'Feb', amount: 58000000 },
      { month: 'Mar', amount: 61000000 },
      { month: 'Apr', amount: 59000000 },
      { month: 'May', amount: 65000000 },
      { month: 'Jun', amount: 68000000 },
    ],
  },
  {
    question: 'What is my portfolio at risk?',
    answer: 'Your **Portfolio at Risk (PAR) is 3.2%**, which is within acceptable limits.\n\n**PAR Breakdown:**\n• **PAR 1-30 days**: 1.8% (₹64.4 Lakhs)\n• **PAR 31-60 days**: 0.9% (₹32.2 Lakhs)\n• **PAR 61-90 days**: 0.4% (₹14.3 Lakhs)\n• **PAR 90+ days**: 0.1% (₹3.6 Lakhs)\n\n**Total Portfolio**: ₹35.8 Crores\n**Total PAR**: ₹1.14 Crores (3.2%)\n\n**Industry Benchmark**: 3-5%\n\nYour PAR is **below industry average**, indicating good portfolio quality. Focus on accounts in the 1-30 days category to prevent further deterioration.',
  },
  {
    question: 'How many term deposits are maturing this month?',
    answer: 'You have **89 term deposits maturing this month** with a total value of ₹2.8 Crores.\n\n**Maturity Breakdown:**\n• **1-7 days**: 23 deposits (₹72 Lakhs)\n• **8-15 days**: 31 deposits (₹98 Lakhs)\n• **16-23 days**: 22 deposits (₹68 Lakhs)\n• **24-31 days**: 13 deposits (₹42 Lakhs)\n\n**Action Required:**\n1. Contact customers 7 days before maturity for renewal\n2. Offer competitive rates to retain deposits\n3. Cross-sell other products during renewal discussions\n\n**Expected Renewal Rate**: 75-80% (based on historical data)',
  },
  {
    question: 'What is the average customer lifetime value?',
    answer: 'Your **average Customer Lifetime Value (CLV) is ₹4.2 Lakhs**.\n\n**CLV Breakdown:**\n• **High Value Customers** (Top 20%): ₹12.5 Lakhs average\n• **Medium Value Customers** (Middle 60%): ₹3.8 Lakhs average\n• **Low Value Customers** (Bottom 20%): ₹1.2 Lakhs average\n\n**Factors Contributing to CLV:**\n• Average loan size: ₹2.87 Lakhs\n• Average number of products per customer: 1.8\n• Average relationship duration: 3.2 years\n• Cross-sell success rate: 45%\n\n**Recommendations:**\n1. Focus on retaining high-value customers\n2. Increase cross-selling to medium-value customers\n3. Improve engagement with low-value customers',
  },
  {
    question: 'Show me product-wise profitability',
    answer: 'Here\'s the profitability analysis by product:\n\n**Most Profitable Products:**\n1. **Personal Loans**: 18.5% margin (₹2.31 Cr profit)\n2. **Business Loans**: 16.2% margin (₹84.2 Lakhs profit)\n3. **Home Loans**: 12.8% margin (₹2.02 Cr profit)\n4. **Education Loans**: 10.5% margin (₹18.9 Lakhs profit)\n5. **Auto Loans**: 9.2% margin (₹4.6 Lakhs profit)\n\n**Total Profit**: ₹5.41 Crores\n**Average Margin**: 15.1%\n\nPersonal loans show the highest profitability due to higher profit rates, while auto loans have lower margins due to competitive pricing.',
    hasChart: true,
    chartType: 'bar',
    chartTitle: 'Product Profitability (Margin %)',
    chartData: [
      { product: 'Personal', margin: 18.5 },
      { product: 'Business', margin: 16.2 },
      { product: 'Home', margin: 12.8 },
      { product: 'Education', margin: 10.5 },
      { product: 'Auto', margin: 9.2 },
    ],
  },
  {
    question: 'What is my cost of funds?',
    answer: 'Your **weighted average cost of funds is 6.8%**.\n\n**Cost Breakdown by Source:**\n• **Fixed Deposits**: 7.2% (₹28.5 Cr, 67% of deposits)\n• **Recurring Deposits**: 6.5% (₹9.8 Cr, 23% of deposits)\n• **Savings Accounts**: 4.0% (₹3.2 Cr, 8% of deposits)\n• **Current Accounts**: 0.5% (₹1.0 Cr, 2% of deposits)\n\n**Total Deposits**: ₹42.5 Crores\n**Weighted Average**: 6.8%\n\n**Net profit Margin**: 6.0% (Average lending rate 12.8% - Cost of funds 6.8%)\n\nYour cost of funds is **competitive**. Increasing CASA ratio can further reduce cost of funds.',
  },
  {
    question: 'How many loan applications are pending approval?',
    answer: 'You currently have **89 loan applications pending approval**.\n\n**Pending Applications Breakdown:**\n• **Under Initial Review**: 47 applications\n• **Awaiting Documentation**: 23 applications\n• **Credit Assessment**: 12 applications\n• **Final Approval**: 7 applications\n\n**Total Pending Value**: ₹2.1 Crores\n**Average Processing Time**: 4.2 days\n\n**By Product:**\n• Personal Loans: 38 pending\n• Home Loans: 22 pending\n• Business Loans: 18 pending\n• Education Loans: 8 pending\n• Auto Loans: 3 pending\n\n**Recommendations:**\n1. Prioritize high-value applications\n2. Expedite documentation collection\n3. Streamline approval workflow',
  },
];

// Suggestion cards for quick actions
const suggestionCards = [
  {
    icon: <AlertTriangle className="h-6 w-6" />,
    title: 'Defaulters Analysis',
    description: 'How many defaulters do I have?',
    question: 'How many defaulters do I have?',
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Loan Distribution',
    description: 'What is the distribution of loans across categories?',
    question: 'What is the distribution of loans across categories?',
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'Recovery Trends',
    description: 'Show me recovery trends over the last 6 months',
    question: 'Show me recovery trends over the last 6 months',
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: 'Portfolio Review',
    description: 'Give me a complete portfolio analysis',
    question: 'What is my NPA ratio?',
  },
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  hasChart?: boolean;
  chartData?: any;
  chartType?: 'bar' | 'line' | 'pie';
  chartTitle?: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const COLORS = ['#635BFF', '#00D924', '#FFA500', '#DF1B41', '#8B5CF6'];

export default function AICompanionPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [streamingSpeed, setStreamingSpeed] = useState(15);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<string>('');

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('ai-companion-theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Load conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem('ai-companion-conversations');
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        setConversations(parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        })));
      } catch (e) {
        console.error('Failed to load conversations', e);
      }
    }
  }, []);

  // Save conversations to localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('ai-companion-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Apply theme
  useEffect(() => {
    localStorage.setItem('ai-companion-theme', theme);
  }, [theme]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentStreamingMessage]);

  // Stream text character by character
  const streamText = async (text: string): Promise<void> => {
    return new Promise((resolve) => {
      let index = 0;
      setCurrentStreamingMessage('');
      setIsStreaming(true);

      const interval = setInterval(() => {
        if (index < text.length) {
          setCurrentStreamingMessage(text.substring(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsStreaming(false);
          setCurrentStreamingMessage('');
          resolve();
        }
      }, streamingSpeed);
    });
  };

  const findAnswer = (question: string): QA | null => {
    const normalizedQuestion = question.toLowerCase().trim();
    return (
      qaDatabase.find(
        (qa) =>
          qa.question.toLowerCase() === normalizedQuestion ||
          normalizedQuestion.includes(qa.question.toLowerCase().substring(0, 10))
      ) || null
    );
  };

  const handleSendMessage = async (question: string) => {
    if (!question.trim() || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Find answer
    const qa = findAnswer(question);
    if (!qa) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I don't have information about that specific query. Please try asking about:\n\n• Defaulters and recovery\n• Loan distribution and categories\n• Portfolio performance\n• Customer statistics\n• Branch performance\n• Financial metrics\n\nOr select one of the suggested questions above.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    // Stream the answer
    await streamText(qa.answer);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: qa.answer,
      timestamp: new Date(),
      hasChart: qa.hasChart,
      chartData: qa.chartData,
      chartType: qa.chartType,
      chartTitle: qa.chartTitle,
    };

    setMessages((prev) => [...prev, assistantMessage]);
  };

  const handleSuggestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleNewConversation = () => {
    if (messages.length > 0) {
      const conversationTitle = messages[0]?.content.substring(0, 50) || 'New Conversation';
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: conversationTitle,
        messages: [...messages],
        createdAt: new Date(),
      };
      setConversations((prev) => [newConversation, ...prev]);
    }
    setMessages([]);
    setCurrentStreamingMessage('');
    setCurrentConversationId(null);
  };

  const handleLoadConversation = (conversation: Conversation) => {
    setMessages(conversation.messages);
    setCurrentConversationId(conversation.id);
    setShowHistory(false);
  };

  const handleDeleteConversation = (conversationId: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
    if (currentConversationId === conversationId) {
      setMessages([]);
      setCurrentConversationId(null);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const renderChart = (message: Message, isLight: boolean) => {
    if (!message.hasChart || !message.chartData) return null;

    const { chartType, chartData, chartTitle } = message;
    const bgColor = isLight ? 'bg-neutral-100' : 'bg-neutral-800/50';
    const textColor = isLight ? 'text-neutral-700' : 'text-neutral-300';
    const gridColor = isLight ? '#E5E7EB' : '#374151';
    const axisColor = isLight ? '#6B7280' : '#9CA3AF';
    const tooltipBg = isLight ? '#FFFFFF' : '#1F2937';
    const tooltipBorder = isLight ? '#E5E7EB' : '#374151';
    const tooltipText = isLight ? '#1F2937' : '#F3F4F6';

    if (chartType === 'bar') {
      return (
        <div className="mt-4 w-full">
          <h4 className={`text-sm font-semibold ${textColor} mb-3`}>{chartTitle}</h4>
          <div className={`h-64 ${bgColor} rounded-lg p-4`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} style={{ fontSize: '12px' }} />
                <YAxis stroke={axisColor} style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: '8px',
                    color: tooltipText,
                  }}
                />
                <Bar dataKey={chartData[0]?.count !== undefined ? 'count' : chartData[0]?.days !== undefined ? 'days' : chartData[0]?.margin !== undefined ? 'margin' : chartData[0]?.customers !== undefined ? 'customers' : chartData[0]?.recovery !== undefined ? 'recovery' : chartData[0]?.amount !== undefined ? 'amount' : 'value'} fill="#635BFF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    if (chartType === 'line') {
      return (
        <div className="mt-4 w-full">
          <h4 className={`text-sm font-semibold ${textColor} mb-3`}>{chartTitle}</h4>
          <div className={`h-64 ${bgColor} rounded-lg p-4`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={axisColor} style={{ fontSize: '12px' }} />
                <YAxis stroke={axisColor} style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: '8px',
                    color: tooltipText,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={chartData[0]?.recovery !== undefined ? 'recovery' : chartData[0]?.customers !== undefined ? 'customers' : 'amount'}
                  stroke="#635BFF"
                  strokeWidth={2}
                  dot={{ fill: '#635BFF', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    if (chartType === 'pie') {
      return (
        <div className="mt-4 w-full">
          <h4 className={`text-sm font-semibold ${textColor} mb-3`}>{chartTitle}</h4>
          <div className={`h-64 ${bgColor} rounded-lg p-4`}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name}: ${((entry.percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: '8px',
                    color: tooltipText,
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    return null;
  };

  const formatMessage = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const isLight = theme === 'light';
  const bgMain = isLight ? 'bg-white' : 'bg-neutral-900';
  const bgSecondary = isLight ? 'bg-neutral-50' : 'bg-neutral-800';
  const bgCard = isLight ? 'bg-white' : 'bg-neutral-800/50';
  const borderColor = isLight ? 'border-neutral-200' : 'border-neutral-700';
  const textPrimary = isLight ? 'text-neutral-900' : 'text-white';
  const textSecondary = isLight ? 'text-neutral-600' : 'text-neutral-300';
  const textTertiary = isLight ? 'text-neutral-500' : 'text-neutral-400';
  const inputBg = isLight ? 'bg-neutral-50' : 'bg-neutral-800/50';

  return (
    <DashboardLayout>
      <div className={cn('flex flex-col overflow-hidden', bgMain, textPrimary)} style={{ height: 'calc(100vh - 4rem)', maxHeight: 'calc(100vh - 4rem)' }}>
        {/* Header - Fixed */}
        <div className={cn('flex items-center justify-between p-4 md:p-6 border-b flex-shrink-0', borderColor)}>
          <h1 className="text-xl md:text-2xl font-bold">AI Companion</h1>
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              onClick={handleNewConversation}
              className={cn(textSecondary, isLight ? 'hover:text-neutral-900 hover:bg-neutral-100' : 'hover:text-white hover:bg-neutral-700')}
            >
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">New conversation</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowHistory(!showHistory)}
              className={cn(textSecondary, isLight ? 'hover:text-neutral-900 hover:bg-neutral-100' : 'hover:text-white hover:bg-neutral-700')}
            >
              <History className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">History</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowCustomize(true)}
              className={cn(textSecondary, isLight ? 'hover:text-neutral-900 hover:bg-neutral-100' : 'hover:text-white hover:bg-neutral-700')}
            >
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Customize</span>
            </Button>
            <Button
              variant="ghost"
              onClick={toggleTheme}
              className={cn(textSecondary, isLight ? 'hover:text-neutral-900 hover:bg-neutral-100' : 'hover:text-white hover:bg-neutral-700')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0">
          {messages.length === 0 ? (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">How can I help you today?</h2>

              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {suggestionCards.map((card, index) => (
                  <Card
                    key={index}
                    className={cn(bgCard, borderColor, isLight ? 'hover:bg-neutral-100' : 'hover:bg-neutral-800', 'cursor-pointer transition-all hover:border-primary-500/50 group relative')}
                    onClick={() => handleSuggestionClick(card.question)}
                  >
                    <div className="p-4 flex flex-row items-center gap-4 h-full">
                      <div className="text-primary-400 group-hover:text-primary-300 transition-colors flex-shrink-0">
                        {card.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={cn('text-base font-semibold mb-1', textPrimary)}>{card.title}</h3>
                        <p className={cn('text-sm leading-relaxed', textTertiary)}>{card.description}</p>
                      </div>
                      <div className="flex items-center flex-shrink-0">
                        <ChevronDown className={cn('h-5 w-5 group-hover:text-primary-400 transition-colors', textTertiary)} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg p-4',
                      message.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : cn(bgSecondary, textSecondary)
                    )}
                  >
                    <div className="whitespace-pre-wrap">
                      {message.role === 'assistant' && message.id === messages[messages.length - 1]?.id && currentStreamingMessage
                        ? formatMessage(currentStreamingMessage)
                        : formatMessage(message.content)}
                    </div>
                    {message.role === 'assistant' && message.hasChart && !currentStreamingMessage && renderChart(message, isLight)}
                  </div>
                </div>
              ))}
              {isStreaming && (
                <div className="flex justify-start">
                  <div className={cn(bgSecondary, textSecondary, 'rounded-lg p-4 max-w-[80%]')}>
                    <div className="whitespace-pre-wrap">{formatMessage(currentStreamingMessage)}</div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Section - Fixed at Bottom */}
        <div className={cn('border-t p-4 flex-shrink-0', borderColor, bgMain)}>
          <div className="max-w-6xl mx-auto">
            <div className={cn('flex items-center gap-2 rounded-lg p-2 border', inputBg, borderColor)}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(textTertiary, isLight ? 'hover:text-neutral-900 hover:bg-neutral-100' : 'hover:text-white hover:bg-neutral-700', 'h-8 px-3')}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Attach</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(textTertiary, isLight ? 'hover:text-neutral-900 hover:bg-neutral-100' : 'hover:text-white hover:bg-neutral-700', 'h-8 px-3')}
              >
                <Settings className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Deep thinking</span>
              </Button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }
                }}
                placeholder="Ask anything..."
                className={cn('flex-1 bg-transparent border-none outline-none px-3 py-2 text-sm', textPrimary, isLight ? 'placeholder:text-neutral-500' : 'placeholder:text-neutral-400')}
                disabled={isStreaming}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isStreaming}
                className={cn(textTertiary, isLight ? 'hover:text-neutral-900 hover:bg-neutral-100' : 'hover:text-white hover:bg-neutral-700', 'disabled:opacity-50 h-8 w-8 p-0')}
              >
                {isStreaming ? (
                  <div className={cn('h-4 w-4 border-2 border-t-transparent rounded-full animate-spin', textTertiary)} />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(textTertiary, isLight ? 'hover:text-neutral-900 hover:bg-neutral-100' : 'hover:text-white hover:bg-neutral-700', 'h-8 w-8 p-0')}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* History Drawer */}
        <Drawer
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          title="Conversation History"
          position="right"
          size="md"
        >
          <div className="p-4 space-y-2">
            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                <p className="text-neutral-600">No conversation history yet</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn('p-4 rounded-lg border cursor-pointer transition-colors group', borderColor, isLight ? 'hover:bg-neutral-100' : 'hover:bg-neutral-800')}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="flex-1 min-w-0"
                      onClick={() => handleLoadConversation(conversation)}
                    >
                      <h3 className={cn('font-semibold mb-1 truncate', textPrimary)}>{conversation.title}</h3>
                      <p className={cn('text-sm', textTertiary)}>
                        {conversation.messages.length} messages • {conversation.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteConversation(conversation.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                    >
                      <Trash2 className="h-4 w-4 text-error-500" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Drawer>

        {/* Customize Modal */}
        <Modal
          isOpen={showCustomize}
          onClose={() => setShowCustomize(false)}
          title="Customize AI Companion"
          size="md"
        >
          <div className="space-y-6">
            <div>
              <label className={cn('block text-sm font-medium mb-2', textPrimary)}>
                Streaming Speed
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={streamingSpeed}
                onChange={(e) => setStreamingSpeed(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>Fast</span>
                <span>Current: {streamingSpeed}ms</span>
                <span>Slow</span>
              </div>
            </div>
            <div>
              <label className={cn('block text-sm font-medium mb-2', textPrimary)}>
                Theme
              </label>
              <div className="flex gap-2">
                <Button
                  variant={theme === 'dark' ? 'primary' : 'outline'}
                  onClick={() => setTheme('dark')}
                  className="flex-1"
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </Button>
                <Button
                  variant={theme === 'light' ? 'primary' : 'outline'}
                  onClick={() => setTheme('light')}
                  className="flex-1"
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </Button>
              </div>
            </div>
            <div className={cn('p-4 rounded-lg', bgSecondary)}>
              <p className={cn('text-sm', textSecondary)}>
                <strong>Note:</strong> Settings are saved automatically and will persist across sessions.
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
