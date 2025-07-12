"use client";
import { useState } from "react";
import {
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  BellIcon,
  PaperAirplaneIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  EyeIcon,
  PlusIcon,
  XMarkIcon,
  CalendarIcon,
  UserGroupIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

interface Communication {
  id: string;
  communication_date: string;
  communication_type: 'SMS' | 'Email' | 'WhatsApp' | 'Push';
  recipient_count: number;
  delivery_status: 'Sent' | 'Delivered' | 'Failed' | 'Pending';
  open_rate: number;
  response_rate: number;
  message_subject: string;
  message_content: string;
  recipient_type: 'Individual' | 'Segment' | 'All';
  message_priority: 'Low' | 'Medium' | 'High';
}

export default function CommunicationManagementPage() {
  const [messageType, setMessageType] = useState("");
  const [recipientType, setRecipientType] = useState("");
  const [recipientSelection, setRecipientSelection] = useState<string[]>([]);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [sendImmediately, setSendImmediately] = useState(true);
  const [scheduledTime, setScheduledTime] = useState("");
  const [messagePriority, setMessagePriority] = useState("");
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);

  const mockCommunications: Communication[] = [
    {
      id: "COM001",
      communication_date: "2024-01-20 10:30:00",
      communication_type: "Email",
      recipient_count: 2500,
      delivery_status: "Delivered",
      open_rate: 68.5,
      response_rate: 12.3,
      message_subject: "New Investment Opportunities Available",
      message_content: "Dear valued customer, we have exciting new investment opportunities that match your profile...",
      recipient_type: "Segment",
      message_priority: "Medium",
    },
    {
      id: "COM002",
      communication_date: "2024-01-19 15:45:00",
      communication_type: "SMS",
      recipient_count: 1800,
      delivery_status: "Sent",
      open_rate: 95.2,
      response_rate: 8.7,
      message_subject: "Account Statement Ready",
      message_content: "Your monthly account statement is ready. Check your email or mobile app for details.",
      recipient_type: "Individual",
      message_priority: "Low",
    },
    {
      id: "COM003",
      communication_date: "2024-01-18 09:15:00",
      communication_type: "WhatsApp",
      recipient_count: 3200,
      delivery_status: "Delivered",
      open_rate: 89.1,
      response_rate: 15.4,
      message_subject: "Special Offer for Premium Customers",
      message_content: "Exclusive offer for our premium customers: Get 50% off on processing fees for new loans...",
      recipient_type: "Segment",
      message_priority: "High",
    },
    {
      id: "COM004",
      communication_date: "2024-01-17 14:20:00",
      communication_type: "Push",
      recipient_count: 4500,
      delivery_status: "Failed",
      open_rate: 45.6,
      response_rate: 3.2,
      message_subject: "Security Alert",
      message_content: "Important security update for your account. Please verify your recent transactions.",
      recipient_type: "All",
      message_priority: "High",
    },
  ];

  const recipientOptions = [
    "Premium Customers", "Young Professionals", "Business Owners", "Retirees", "Students"
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-800";
      case "Sent": return "bg-blue-100 text-blue-800";
      case "Failed": return "bg-red-100 text-red-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Email": return "bg-blue-100 text-blue-800";
      case "SMS": return "bg-green-100 text-green-800";
      case "WhatsApp": return "bg-green-100 text-green-800";
      case "Push": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleRecipientToggle = (recipient: string) => {
    setRecipientSelection(prev => 
      prev.includes(recipient) 
        ? prev.filter(rec => rec !== recipient)
        : [...prev, recipient]
    );
  };

  const handleSendMessage = () => {
    if (messageType && messageSubject && messageContent) {
      // Handle message sending logic here
      console.log("Sending message:", {
        messageType,
        recipientType,
        recipientSelection,
        messageSubject,
        messageContent,
        sendImmediately,
        scheduledTime,
        messagePriority
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Communication Center</h1>
          <p className="text-gray-600">Manage customer communications across multiple channels</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <PlusIcon className="h-4 w-4" />
            <span>New Message</span>
          </button>
        </div>
      </div>

      {/* Message Composition */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Message Composition</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Message Settings */}
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-4">Message Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
                  <select
                    value={messageType}
                    onChange={(e) => setMessageType(e.target.value)}
                    className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select message type</option>
                    <option value="SMS">SMS</option>
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Push">Push Notification</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Type</label>
                  <select
                    value={recipientType}
                    onChange={(e) => setRecipientType(e.target.value)}
                    className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select recipient type</option>
                    <option value="Individual">Individual</option>
                    <option value="Segment">Segment</option>
                    <option value="All">All Customers</option>
                  </select>
                </div>
                
                {recipientType === "Segment" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Selection</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {recipientOptions.map((recipient) => (
                        <label key={recipient} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={recipientSelection.includes(recipient)}
                            onChange={() => handleRecipientToggle(recipient)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{recipient}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message Priority</label>
                  <select
                    value={messagePriority}
                    onChange={(e) => setMessagePriority(e.target.value)}
                    className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={sendImmediately}
                      onChange={(e) => setSendImmediately(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Send immediately</span>
                  </label>
                </div>
                
                {!sendImmediately && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Time</label>
                    <input
                      type="datetime-local"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Message Content */}
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-4">Message Content</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message Subject</label>
                  <input
                    type="text"
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                    placeholder="Enter message subject"
                    className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
                  <textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    rows={8}
                    placeholder="Enter your message content here..."
                    className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Characters: {messageContent.length}</span>
                  <span>Estimated recipients: {recipientSelection.length > 0 ? recipientSelection.length * 500 : 0}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
              <span>Send Message</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Save Draft
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Communication History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Communication History</h2>
          
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Messages</p>
                  <p className="text-2xl font-bold text-blue-900">{mockCommunications.length}</p>
                </div>
                <EnvelopeIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Delivery Rate</p>
                  <p className="text-2xl font-bold text-green-900">94.2%</p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Avg Open Rate</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {(mockCommunications.reduce((sum, comm) => sum + comm.open_rate, 0) / mockCommunications.length).toFixed(1)}%
                  </p>
                </div>
                <EyeIcon className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Avg Response Rate</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {(mockCommunications.reduce((sum, comm) => sum + comm.response_rate, 0) / mockCommunications.length).toFixed(1)}%
                  </p>
                </div>
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Communications Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Communication</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockCommunications.map((communication) => (
                  <tr key={communication.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{communication.message_subject}</div>
                        <div className="text-sm text-gray-500">{communication.communication_date}</div>
                        <div className="text-xs text-gray-400">{communication.recipient_type}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(communication.communication_type)}`}>
                        {communication.communication_type}
                      </span>
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(communication.message_priority)}`}>
                          {communication.message_priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{communication.recipient_count.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(communication.delivery_status)}`}>
                        {communication.delivery_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">Open: {communication.open_rate}%</div>
                        <div className="text-sm text-gray-500">Response: {communication.response_rate}%</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedCommunication(communication)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Communication Details Modal */}
      {selectedCommunication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Communication Details</h3>
              <button
                onClick={() => setSelectedCommunication(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Message Details</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Subject:</span>
                    <div className="text-sm text-gray-900 mt-1">{selectedCommunication.message_subject}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Content:</span>
                    <div className="text-sm text-gray-900 mt-1">{selectedCommunication.message_content}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Type:</span>
                      <div className="text-sm text-gray-900 mt-1">{selectedCommunication.communication_type}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Priority:</span>
                      <div className="text-sm text-gray-900 mt-1">{selectedCommunication.message_priority}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Recipient Type:</span>
                      <div className="text-sm text-gray-900 mt-1">{selectedCommunication.recipient_type}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Recipients:</span>
                      <div className="text-sm text-gray-900 mt-1">{selectedCommunication.recipient_count.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Performance Metrics</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded">
                      <div className="text-sm font-medium text-blue-600">Delivery Status</div>
                      <div className="text-lg font-bold text-blue-900">{selectedCommunication.delivery_status}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <div className="text-sm font-medium text-green-600">Open Rate</div>
                      <div className="text-lg font-bold text-green-900">{selectedCommunication.open_rate}%</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <div className="text-sm font-medium text-purple-600">Response Rate</div>
                      <div className="text-lg font-bold text-purple-900">{selectedCommunication.response_rate}%</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded">
                      <div className="text-sm font-medium text-orange-600">Sent Date</div>
                      <div className="text-sm font-bold text-orange-900">{selectedCommunication.communication_date}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Resend Message
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Export Report
              </button>
              <button 
                onClick={() => setSelectedCommunication(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 