"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  DocumentTextIcon,
  ChartBarIcon,
  CalendarIcon,
  EnvelopeIcon,
  DocumentIcon,
  PresentationChartBarIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline";

export default function ExecutiveReportsPage() {
  const router = useRouter();
  const [reportSearch, setReportSearch] = useState("");
  const [reportFilter, setReportFilter] = useState("all");

  // Mock data for existing reports
  const [reports, setReports] = useState([
    {
      id: 1,
      name: "Q4 2024 Performance Report",
      type: "Performance",
      status: "Completed",
      createdDate: "2024-01-15",
      frequency: "One-time",
      format: "PDF",
      confidentiality: "Internal",
      recipients: ["ceo@fivopay.com", "cfo@fivopay.com"],
      downloadUrl: "#"
    },
    {
      id: 2,
      name: "Monthly Financial Dashboard",
      type: "Financial",
      status: "Scheduled",
      createdDate: "2024-01-10",
      frequency: "Monthly",
      format: "Excel",
      confidentiality: "Confidential",
      recipients: ["board@fivopay.com", "executives@fivopay.com"],
      downloadUrl: "#"
    },
    {
      id: 3,
      name: "Compliance Audit Report",
      type: "Compliance",
      status: "In Progress",
      createdDate: "2024-01-20",
      frequency: "One-time",
      format: "PDF",
      confidentiality: "Confidential",
      recipients: ["compliance@fivopay.com", "legal@fivopay.com"],
      downloadUrl: "#"
    },
    {
      id: 4,
      name: "Strategic Planning Review",
      type: "Strategic",
      status: "Draft",
      createdDate: "2024-01-25",
      frequency: "Weekly",
      format: "PowerPoint",
      confidentiality: "Internal",
      recipients: ["strategy@fivopay.com"],
      downloadUrl: "#"
    }
  ]);



  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(reportSearch.toLowerCase()) ||
                         report.type.toLowerCase().includes(reportSearch.toLowerCase());
    const matchesFilter = reportFilter === "all" || report.status.toLowerCase() === reportFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

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
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Executive Reports Generator</h1>
          <p className="text-slate-600">Generate and manage comprehensive executive reports with advanced configuration options</p>
        </div>
        <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="text-sm font-medium text-purple-800">Executive</span>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Report Configuration</h2>
            </div>
            <button
              onClick={() => router.push("/dashboard/executive-dashboard/executive-reports/generate-report")}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Generate New Report</span>
            </button>
          </div>
        </div>



        {/* Reports Table */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Generated Reports</h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                  className="text-slate-900 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-4 w-4 text-slate-500" />
                <select
                  value={reportFilter}
                  onChange={(e) => setReportFilter(e.target.value)}
                  className="text-slate-900 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Report Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Format</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Confidentiality</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{report.name}</div>
                        <div className="text-sm text-slate-500">{report.frequency} • {report.recipients.length} recipients</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-900">{report.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getFormatIcon(report.format)}
                        <span className="text-sm text-slate-900">{report.format}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidentialityColor(report.confidentiality)}`}>
                        {report.confidentiality}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600">{report.createdDate}</span>
                    </td>
                                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                             <div className="flex items-center space-x-2">
                               <button 
                                 onClick={() => router.push(`/dashboard/executive-dashboard/executive-reports/view-report?id=${report.id}`)}
                                 className="text-blue-600 hover:text-blue-800"
                               >
                                 <EyeIcon className="h-4 w-4" />
                               </button>
                               <button 
                                 onClick={() => router.push(`/dashboard/executive-dashboard/executive-reports/edit-report?id=${report.id}`)}
                                 className="text-green-600 hover:text-green-800"
                               >
                                 <PencilSquareIcon className="h-4 w-4" />
                               </button>
                             </div>
                           </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
