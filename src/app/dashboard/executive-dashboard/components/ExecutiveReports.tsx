"use client";
import { useState } from "react";
import { 
  DocumentTextIcon,
  CalendarIcon,
  UserGroupIcon,
  CogIcon,
  ChartBarIcon,
  DocumentIcon,
  EyeIcon,
  EyeSlashIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

export default function ExecutiveReports() {
  const [reportConfig, setReportConfig] = useState({
    reportType: "Performance",
    reportPeriod: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    },
    reportFrequency: "One-time",
    recipients: [],
    format: "PDF",
    includeCharts: true,
    confidentialityLevel: "Internal"
  });

  const [reports, setReports] = useState([
    {
      id: 1,
      name: "Q4 Performance Report",
      type: "Performance",
      status: "Completed",
      createdAt: "2024-01-15",
      recipients: ["ceo@fivopay.com", "cfo@fivopay.com"],
      format: "PDF",
      confidentiality: "Internal"
    },
    {
      id: 2,
      name: "Annual Financial Review",
      type: "Financial",
      status: "In Progress",
      createdAt: "2024-01-10",
      recipients: ["board@fivopay.com"],
      format: "PowerPoint",
      confidentiality: "Confidential"
    },
    {
      id: 3,
      name: "Compliance Audit Report",
      type: "Compliance",
      status: "Scheduled",
      createdAt: "2024-01-05",
      recipients: ["compliance@fivopay.com"],
      format: "Excel",
      confidentiality: "Confidential"
    }
  ]);

  const reportTypes = ["Performance", "Financial", "Compliance", "Strategic"];
  const reportFrequencies = ["One-time", "Daily", "Weekly", "Monthly"];
  const reportFormats = ["PDF", "Excel", "PowerPoint"];
  const confidentialityLevels = ["Public", "Internal", "Confidential"];

  const defaultRecipients = [
    "ceo@fivopay.com",
    "cfo@fivopay.com", 
    "cto@fivopay.com",
    "board@fivopay.com",
    "compliance@fivopay.com",
    "operations@fivopay.com"
  ];

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport = {
      id: reports.length + 1,
      name: `${reportConfig.reportType} Report - ${new Date().toLocaleDateString()}`,
      type: reportConfig.reportType,
      status: "Scheduled",
      createdAt: new Date().toISOString().split('T')[0],
      recipients: reportConfig.recipients,
      format: reportConfig.format,
      confidentiality: reportConfig.confidentialityLevel
    };
    setReports(prev => [newReport, ...prev]);
    console.log("New Report:", newReport);
  };

  const addRecipient = (email: string) => {
    if (email && !reportConfig.recipients.includes(email)) {
      setReportConfig(prev => ({
        ...prev,
        recipients: [...prev.recipients, email]
      }));
    }
  };

  const removeRecipient = (email: string) => {
    setReportConfig(prev => ({
      ...prev,
      recipients: prev.recipients.filter(r => r !== email)
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case "In Progress":
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case "Scheduled":
        return <CalendarIcon className="h-5 w-5 text-blue-600" />;
      default:
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Report Configuration</h2>
        <p className="text-slate-600 mb-6">Configure and generate executive reports with custom parameters</p>

        <form onSubmit={handleReportSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Report Type *
              </label>
              <select
                value={reportConfig.reportType}
                onChange={(e) => setReportConfig(prev => ({ ...prev, reportType: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {reportTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Report Frequency *
              </label>
              <select
                value={reportConfig.reportFrequency}
                onChange={(e) => setReportConfig(prev => ({ ...prev, reportFrequency: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {reportFrequencies.map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={reportConfig.reportPeriod.startDate}
                onChange={(e) => setReportConfig(prev => ({
                  ...prev,
                  reportPeriod: { ...prev.reportPeriod, startDate: e.target.value }
                }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={reportConfig.reportPeriod.endDate}
                onChange={(e) => setReportConfig(prev => ({
                  ...prev,
                  reportPeriod: { ...prev.reportPeriod, endDate: e.target.value }
                }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Report Format *
              </label>
              <select
                value={reportConfig.format}
                onChange={(e) => setReportConfig(prev => ({ ...prev, format: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {reportFormats.map(format => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confidentiality Level *
              </label>
              <select
                value={reportConfig.confidentialityLevel}
                onChange={(e) => setReportConfig(prev => ({ ...prev, confidentialityLevel: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {confidentialityLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="includeCharts"
                checked={reportConfig.includeCharts}
                onChange={(e) => setReportConfig(prev => ({ ...prev, includeCharts: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includeCharts" className="text-sm font-medium text-slate-700">
                Include Charts & Graphs
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Recipients *
            </label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const target = e.target as HTMLInputElement;
                      addRecipient(target.value);
                      target.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.querySelector('input[type="email"]') as HTMLInputElement;
                    if (input && input.value) {
                      addRecipient(input.value);
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Quick Add Recipients */}
              <div className="flex flex-wrap gap-2">
                {defaultRecipients.map(email => (
                  <button
                    key={email}
                    type="button"
                    onClick={() => addRecipient(email)}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200"
                  >
                    {email}
                  </button>
                ))}
              </div>

              {/* Selected Recipients */}
              {reportConfig.recipients.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Selected Recipients:</p>
                  <div className="space-y-2">
                    {reportConfig.recipients.map(email => (
                      <div key={email} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                        <span className="text-sm text-blue-800">{email}</span>
                        <button
                          type="button"
                          onClick={() => removeRecipient(email)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Save Configuration
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Generate Report
            </button>
          </div>
        </form>
      </div>

      {/* Report History */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Report History</h2>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DocumentIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-900">{report.name}</h3>
                  <p className="text-xs text-slate-500">
                    {report.type} • {report.format} • {report.confidentiality}
                  </p>
                  <p className="text-xs text-slate-500">Created: {report.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-600 hover:text-blue-800">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:text-green-800">
                    <DocumentIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 