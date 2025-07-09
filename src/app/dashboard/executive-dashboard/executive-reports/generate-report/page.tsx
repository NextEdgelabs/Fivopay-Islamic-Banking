"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CalendarIcon,
  EnvelopeIcon,
  DocumentIcon,
  PresentationChartBarIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";

export default function GenerateReportPage() {
  const router = useRouter();
  const [reportConfig, setReportConfig] = useState({
    reportType: "Performance",
    reportPeriod: {
      startDate: "",
      endDate: ""
    },
    reportFrequency: "One-time",
    recipients: [] as string[],
    format: "PDF",
    includeCharts: true,
    confidentialityLevel: "Internal"
  });

  const reportTypes = ["Performance", "Financial", "Compliance", "Strategic"];
  const reportFrequencies = ["One-time", "Daily", "Weekly", "Monthly"];
  const reportFormats = ["PDF", "Excel", "PowerPoint"];
  const confidentialityLevels = ["Public", "Internal", "Confidential"];
  const emailRecipients = [
    "ceo@fivopay.com",
    "cfo@fivopay.com", 
    "cto@fivopay.com",
    "board@fivopay.com",
    "executives@fivopay.com",
    "compliance@fivopay.com",
    "legal@fivopay.com",
    "strategy@fivopay.com",
    "operations@fivopay.com",
    "finance@fivopay.com"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New Report Configuration:", reportConfig);
    // Here you would typically save to database
    router.push("/dashboard/executive-dashboard/executive-reports");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Generate New Report</h1>
            <p className="text-slate-600">Configure and generate comprehensive executive reports</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="text-sm font-medium text-purple-800">Executive</span>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">Report Configuration</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Report Type *
              </label>
              <select
                value={reportConfig.reportType}
                onChange={(e) => setReportConfig(prev => ({ ...prev, reportType: e.target.value }))}
                className="text-slate-900 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="text-slate-900 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {reportFrequencies.map(frequency => (
                  <option key={frequency} value={frequency}>{frequency}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Report Period *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={reportConfig.reportPeriod.startDate}
                  onChange={(e) => setReportConfig(prev => ({ 
                    ...prev, 
                    reportPeriod: { ...prev.reportPeriod, startDate: e.target.value }
                  }))}
                  className="text-slate-900 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={reportConfig.reportPeriod.endDate}
                  onChange={(e) => setReportConfig(prev => ({ 
                    ...prev, 
                    reportPeriod: { ...prev.reportPeriod, endDate: e.target.value }
                  }))}
                  className="text-slate-900 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Recipients *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-4">
              {emailRecipients.map(email => (
                <label key={email} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={reportConfig.recipients.includes(email)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setReportConfig(prev => ({
                          ...prev,
                          recipients: [...prev.recipients, email]
                        }));
                      } else {
                        setReportConfig(prev => ({
                          ...prev,
                          recipients: prev.recipients.filter(r => r !== email)
                        }));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-slate-700">{email}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Output Format *
              </label>
              <select
                value={reportConfig.format}
                onChange={(e) => setReportConfig(prev => ({ ...prev, format: e.target.value }))}
                className="text-slate-900 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="text-slate-900 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {confidentialityLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={reportConfig.includeCharts}
                onChange={(e) => setReportConfig(prev => ({ ...prev, includeCharts: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-slate-700">Include Charts & Visualizations</label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Cancel
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
    </div>
  );
} 