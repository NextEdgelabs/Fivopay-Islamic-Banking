"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

export default function ViewReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get('id');

  const [report, setReport] = useState({
    id: 1,
    name: "Q4 2024 Performance Report",
    type: "Performance",
    status: "Completed",
    createdDate: "2024-01-15",
    frequency: "One-time",
    format: "PDF",
    confidentiality: "Internal",
    recipients: ["ceo@fivopay.com", "cfo@fivopay.com"],
    downloadUrl: "#",
    reportPeriod: {
      startDate: "2024-10-01",
      endDate: "2024-12-31"
    },
    includeCharts: true
  });

  useEffect(() => {
    // In a real app, you would fetch report data based on reportId
    console.log("Loading report with ID:", reportId);
  }, [reportId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConfidentialityColor = (level: string) => {
    switch (level) {
      case "Public":
        return "bg-green-100 text-green-800";
      case "Internal":
        return "bg-blue-100 text-blue-800";
      case "Confidential":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "PDF":
        return <DocumentIcon className="h-4 w-4" />;
      case "Excel":
        return <ChartBarIcon className="h-4 w-4" />;
      case "PowerPoint":
        return <PresentationChartBarIcon className="h-4 w-4" />;
      default:
        return <DocumentIcon className="h-4 w-4" />;
    }
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
            <h1 className="text-2xl font-bold text-slate-900">View Report</h1>
            <p className="text-slate-600">Report details and configuration</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
            {report.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidentialityColor(report.confidentiality)}`}>
            {report.confidentiality}
          </span>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">{report.name}</h2>
            </div>
            <div className="flex items-center space-x-2">
              {getFormatIcon(report.format)}
              <span className="text-sm text-slate-600">{report.format}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Report Type</label>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-900">{report.type}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Frequency</label>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-900">{report.frequency}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Report Period</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-900">{report.reportPeriod.startDate}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-900">{report.reportPeriod.endDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Recipients</label>
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {report.recipients.map((email, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    <EnvelopeIcon className="h-3 w-3 mr-1" />
                    {email}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Output Format</label>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  {getFormatIcon(report.format)}
                  <span className="text-slate-900">{report.format}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Confidentiality Level</label>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidentialityColor(report.confidentiality)}`}>
                  {report.confidentiality}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Charts & Visualizations</label>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-900">
                  {report.includeCharts ? "Included" : "Not Included"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
            <button
              onClick={() => router.push(`/dashboard/executive-dashboard/executive-reports/edit-report?id=${report.id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit Report
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 