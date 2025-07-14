"use client";
import { useState, useRef, useEffect } from "react";
import {
  ChatBubbleLeftRightIcon,
  DocumentChartBarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserIcon,
  BanknotesIcon,
  ClockIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  CalculatorIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  reportData?: any;
  isLoading?: boolean;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'operational' | 'compliance' | 'analytics';
  icon: any;
}

export default function AICompanionPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [showReportTemplates, setShowReportTemplates] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reportTemplates: ReportTemplate[] = [
    {
      id: "financial_summary",
      name: "Financial Summary Report",
      description: "Generate comprehensive financial overview with key metrics",
      category: "financial",
      icon: ChartBarIcon,
    },
    {
      id: "loan_portfolio",
      name: "Loan Portfolio Analysis",
      description: "Detailed analysis of loan portfolio performance and risk metrics",
      category: "financial",
      icon: BanknotesIcon,
    },
    {
      id: "customer_analytics",
      name: "Customer Analytics Report",
      description: "Customer behavior analysis and segmentation insights",
      category: "analytics",
      icon: UserIcon,
    },
    {
      id: "compliance_report",
      name: "Compliance Status Report",
      description: "Regulatory compliance status and audit trail",
      category: "compliance",
      icon: ShieldCheckIcon,
    },
    {
      id: "operational_metrics",
      name: "Operational Metrics Dashboard",
      description: "Key operational performance indicators and trends",
      category: "operational",
      icon: CalculatorIcon,
    },
    {
      id: "risk_assessment",
      name: "Risk Assessment Report",
      description: "Comprehensive risk analysis and mitigation strategies",
      category: "compliance",
      icon: ExclamationTriangleIcon,
    },
  ];

  const bankingPrompts = [
    "Generate a financial summary for Q4 2024",
    "Show me the loan portfolio performance",
    "Create a customer segmentation report",
    "Analyze NPA trends for the last 6 months",
    "Generate compliance status report",
    "Show operational efficiency metrics",
    "Create a risk assessment report",
    "Analyze deposit growth patterns",
  ];

  // Enhanced auto-scroll with smooth behavior
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current && chatContainerRef.current) {
        const container = chatContainerRef.current;
        const scrollElement = messagesEndRef.current;
        
        container.scrollTo({
          top: scrollElement.offsetTop - container.offsetTop,
          behavior: "smooth"
        });
      }
    };

    // Add a small delay to ensure content is rendered
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      type: "ai",
      content: "Hello! I'm your AI Banking Assistant. I can help you generate reports, analyze data, and provide insights about your banking operations. How can I assist you today?",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setIsTyping(true);

    // Simulate AI response with typing animation
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = generateAIResponse(inputMessage);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse.content,
        timestamp: new Date(),
        reportData: aiResponse.reportData,
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes("financial summary") || input.includes("financial report")) {
      return {
        content: "I've generated a comprehensive financial summary report for you. Here are the key highlights:",
        reportData: {
          type: "financial_summary",
          title: "Financial Summary Report - Q4 2024",
          data: {
            totalAssets: "₹2,450 Cr",
            totalLiabilities: "₹1,890 Cr",
            netProfit: "₹125 Cr",
            loanPortfolio: "₹1,680 Cr",
            depositBase: "₹1,950 Cr",
            npaRatio: "3.2%",
            capitalAdequacy: "15.8%",
          },
          charts: ["revenue_trend", "asset_allocation", "profit_margin"],
        },
      };
    }

    if (input.includes("loan portfolio") || input.includes("loan analysis")) {
      return {
        content: "Here's your loan portfolio analysis with detailed performance metrics:",
        reportData: {
          type: "loan_portfolio",
          title: "Loan Portfolio Analysis Report",
          data: {
            totalLoans: "₹1,680 Cr",
            personalLoans: "₹450 Cr",
            businessLoans: "₹780 Cr",
            homeLoans: "₹320 Cr",
            vehicleLoans: "₹130 Cr",
            averageInterestRate: "12.5%",
            disbursementRate: "94.2%",
            collectionEfficiency: "96.8%",
          },
          charts: ["loan_distribution", "interest_trends", "collection_performance"],
        },
      };
    }

    if (input.includes("customer") || input.includes("segmentation")) {
      return {
        content: "I've analyzed your customer data and created a comprehensive segmentation report:",
        reportData: {
          type: "customer_analytics",
          title: "Customer Analytics Report",
          data: {
            totalCustomers: "125,450",
            activeCustomers: "98,230",
            premiumCustomers: "12,450",
            businessCustomers: "8,920",
            averageAge: "42 years",
            averageIncome: "₹8.5 L",
            customerSatisfaction: "4.2/5",
            retentionRate: "94.5%",
          },
          charts: ["customer_segments", "age_distribution", "income_analysis"],
        },
      };
    }

    if (input.includes("npa") || input.includes("non-performing")) {
      return {
        content: "Here's the NPA analysis with trends and risk assessment:",
        reportData: {
          type: "npa_analysis",
          title: "NPA Trends Analysis Report",
          data: {
            totalNPA: "₹54.2 Cr",
            npaRatio: "3.2%",
            grossNPA: "₹67.8 Cr",
            netNPA: "₹42.1 Cr",
            provisionCoverage: "85.2%",
            recoveryRate: "68.5%",
            writeOffAmount: "₹12.5 Cr",
          },
          charts: ["npa_trends", "recovery_performance", "provision_coverage"],
        },
      };
    }

    if (input.includes("compliance") || input.includes("regulatory")) {
      return {
        content: "Here's your compliance status report with regulatory adherence metrics:",
        reportData: {
          type: "compliance_report",
          title: "Compliance Status Report",
          data: {
            kycCompletion: "98.5%",
            amlCompliance: "100%",
            regulatoryReporting: "100%",
            auditFindings: "2 Minor",
            capitalAdequacy: "15.8%",
            liquidityRatio: "85.2%",
            riskRating: "Low Risk",
          },
          charts: ["compliance_status", "audit_timeline", "risk_metrics"],
        },
      };
    }

    // Default response
    return {
      content: "I understand you're asking about banking operations. I can help you generate various reports including financial summaries, loan portfolio analysis, customer analytics, compliance reports, and more. What specific information would you like me to analyze?",
    };
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
    // Focus the input after setting the prompt
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(0, inputRef.current.value.length);
      }
    }, 100);
  };

  const handleReportGeneration = (reportType: string) => {
    const template = reportTemplates.find(t => t.id === reportType);
    if (template) {
      const message = `Generate a ${template.name.toLowerCase()}`;
      setInputMessage(message);
      // Focus the input after setting the message
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(0, inputRef.current.value.length);
        }
      }, 100);
    }
  };

  const exportReport = (reportData: any) => {
    // Simulate report export with visual feedback
    console.log("Exporting report:", reportData);
    // In a real implementation, this would generate and download a PDF/Excel file
  };

  const renderReportData = (reportData: any) => {
    if (!reportData) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-900">{reportData.title}</h4>
          <button
            onClick={() => exportReport(reportData)}
            className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors duration-200 hover:scale-105 transform"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(reportData.data).map(([key, value]) => (
            <div key={key} className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="text-sm font-medium text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="text-lg font-bold text-gray-900">{String(value)}</div>
            </div>
          ))}
        </div>
        
        {reportData.charts && (
          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Available Charts:</h5>
            <div className="flex flex-wrap gap-2">
              {(reportData.charts as string[]).map((chart: string) => (
                <span key={chart} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 transition-colors duration-200">
                  {chart.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Mock previous chat sessions
  const previousChats = [
    { id: '1', title: 'Financial Summary', lastActive: '2 hours ago' },
    { id: '2', title: 'Loan Portfolio Q1', lastActive: 'yesterday' },
    { id: '3', title: 'Customer Analytics', lastActive: '3 days ago' },
    { id: '4', title: 'Compliance Review', lastActive: 'last week' },
  ];

  return (
  <div className="h-screen w-full max-w-7xl mx-auto flex items-center justify-center bg-gray-100 p-4">
    <div className="w-full h-full max-w-7xl flex rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-lg">
      {/* Previous Chat History Sidebar */}
      <div className="w-64 h-full bg-white border-r border-gray-200 p-4 overflow-y-auto chat-scrollbar rounded-l-2xl flex-shrink-0">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Previous Chats</h3>
          <div className="space-y-2">
            {previousChats.map((chat) => (
              <button
                key={chat.id}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 card-hover"
                // onClick={() => handleLoadChat(chat.id)} // For future functionality
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 truncate">{chat.title}</span>
                  <span className="text-xs text-gray-500">{chat.lastActive}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Left: Chat Section */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-gray-50 p-4">
        {/* Chat Header - Fixed */}
        <div className="flex-shrink-0 mb-4 rounded-lg border border-gray-200 bg-white px-6 py-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Banking Assistant</h1>
              <p className="text-sm text-gray-600">Your intelligent banking companion</p>
            </div>
          </div>
        </div>
        {/* Chat Messages - Scrollable */}
        <div className="flex-1 min-h-0 rounded-xl border border-gray-200 bg-white p-4 overflow-y-auto chat-scrollbar">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end animate-slide-in-right" : "justify-start animate-slide-in-left"}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`text-gray-700 max-w-3xl rounded-lg p-4 shadow-sm message-bubble ${
                  message.type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div className="flex items-start space-x-3">
                  {message.type === "ai" && (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-sm leading-relaxed">
                      {message.content}
                    </div>
                    {message.reportData && renderReportData(message.reportData)}
                    <div className={`text-xs mt-2 ${
                      message.type === "user" ? "text-blue-100" : "text-gray-500"
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  {message.type === "user" && (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <UserIcon className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-slide-in-left">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                    <ChatBubbleLeftRightIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Chat Input - Always visible at bottom */}
        <div className="flex-shrink-0 mt-4 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow">
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask me about banking reports, analytics, or any banking operations..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus text-gray-700 hover:border-gray-400"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed btn-hover shadow-sm hover:shadow-md"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      {/* Right: Chat Recommendations Section */}
      <div className="w-[380px] max-w-xs h-full bg-white border-l border-gray-200 p-4 overflow-y-auto chat-scrollbar rounded-r-2xl flex-shrink-0">
        {/* Place your chat recommendations, quick prompts, etc. here */}
        {/* ...existing recommendations content... */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Prompts</h3>
          <div className="space-y-2">
            {bankingPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleQuickPrompt(prompt)}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 card-hover"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Report Templates</h3>
          <div className="space-y-2">
            {reportTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleReportGeneration(template.id)}
                className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg card-hover"
              >
                <div className="flex items-center space-x-2">
                  <template.icon className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-blue-900">{template.name}</div>
                    <div className="text-xs text-blue-700">{template.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Metrics</h3>
          <div className="space-y-3">
            <div className="bg-green-50 p-3 rounded-lg hover:bg-green-100 transition-colors duration-200 shadow-sm card-hover">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-700">Total Assets</span>
                <span className="text-lg font-bold text-green-900">₹2,450 Cr</span>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition-colors duration-200 shadow-sm card-hover">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700">Loan Portfolio</span>
                <span className="text-lg font-bold text-blue-900">₹1,680 Cr</span>
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg hover:bg-purple-100 transition-colors duration-200 shadow-sm card-hover">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-700">NPA Ratio</span>
                <span className="text-lg font-bold text-purple-900">3.2%</span>
              </div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg hover:bg-orange-100 transition-colors duration-200 shadow-sm card-hover">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-orange-700">Customers</span>
                <span className="text-lg font-bold text-orange-900">125,450</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Conversations</h3>
          <div className="space-y-2">
            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 card-hover">
              <div className="text-sm font-medium text-gray-900">Financial Summary Report</div>
              <div className="text-xs text-gray-600 mt-1">Generated 2 hours ago</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 card-hover">
              <div className="text-sm font-medium text-gray-900">Loan Portfolio Analysis</div>
              <div className="text-xs text-gray-600 mt-1">Generated yesterday</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 card-hover">
              <div className="text-sm font-medium text-gray-900">Customer Analytics</div>
              <div className="text-xs text-gray-600 mt-1">Generated 3 days ago</div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Suggestions</h3>
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 card-hover">
              <div className="text-sm font-medium text-blue-900">Risk Assessment</div>
              <div className="text-xs text-blue-700 mt-1">Based on recent NPA trends</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 card-hover">
              <div className="text-sm font-medium text-green-900">Growth Opportunities</div>
              <div className="text-xs text-green-700 mt-1">Customer acquisition insights</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200 card-hover">
              <div className="text-sm font-medium text-purple-900">Compliance Check</div>
              <div className="text-xs text-purple-700 mt-1">Regulatory updates needed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
