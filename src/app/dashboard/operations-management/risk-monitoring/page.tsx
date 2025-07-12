"use client";
import { useState } from "react";
import {
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  DocumentChartBarIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface RiskMetrics {
  portfolio_var: number;
  concentration_risk: number;
  sector_exposure: { sector: string; exposure: number; risk_level: string }[];
  geographic_concentration: { region: string; exposure: number; risk_level: string }[];
  risk_grade_distribution: { grade: string; count: number; percentage: number }[];
  early_warning_alerts: { type: string; message: string; severity: string; time: string }[];
}

interface NPAMetrics {
  npa_amount: number;
  npa_percentage: number;
  npa_trend: { month: string; amount: number; percentage: number }[];
  recovery_rate: number;
  write_off_amount: number;
  provision_coverage: number;
}

export default function RiskMonitoringPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedRiskMetric, setSelectedRiskMetric] = useState("portfolio");

  const riskMetrics: RiskMetrics = {
    portfolio_var: 12500000,
    concentration_risk: 15.8,
    sector_exposure: [
      { sector: "Manufacturing", exposure: 35.2, risk_level: "Medium" },
      { sector: "Real Estate", exposure: 28.5, risk_level: "High" },
      { sector: "Agriculture", exposure: 18.3, risk_level: "Low" },
      { sector: "Services", exposure: 12.1, risk_level: "Medium" },
      { sector: "Others", exposure: 5.9, risk_level: "Low" },
    ],
    geographic_concentration: [
      { region: "North India", exposure: 42.3, risk_level: "Medium" },
      { region: "South India", exposure: 28.7, risk_level: "Low" },
      { region: "East India", exposure: 15.2, risk_level: "High" },
      { region: "West India", exposure: 13.8, risk_level: "Medium" },
    ],
    risk_grade_distribution: [
      { grade: "A+", count: 1250, percentage: 25.5 },
      { grade: "A", count: 1850, percentage: 37.8 },
      { grade: "B+", count: 950, percentage: 19.4 },
      { grade: "B", count: 450, percentage: 9.2 },
      { grade: "C", count: 200, percentage: 4.1 },
      { grade: "D", count: 150, percentage: 3.1 },
      { grade: "E", count: 50, percentage: 1.0 },
    ],
    early_warning_alerts: [
      { type: "Concentration Risk", message: "Real Estate sector exposure exceeds 25% threshold", severity: "High", time: "2 hours ago" },
      { type: "Geographic Risk", message: "East India region showing increased default rates", severity: "Medium", time: "4 hours ago" },
      { type: "Sector Risk", message: "Manufacturing sector credit quality deteriorating", severity: "Medium", time: "6 hours ago" },
      { type: "Portfolio Risk", message: "Portfolio VaR increased by 12% this week", severity: "Low", time: "8 hours ago" },
    ],
  };

  const npaMetrics: NPAMetrics = {
    npa_amount: 45000000,
    npa_percentage: 3.2,
    npa_trend: [
      { month: "Jan", amount: 42000000, percentage: 3.0 },
      { month: "Feb", amount: 43500000, percentage: 3.1 },
      { month: "Mar", amount: 45000000, percentage: 3.2 },
      { month: "Apr", amount: 44500000, percentage: 3.1 },
      { month: "May", amount: 44000000, percentage: 3.0 },
      { month: "Jun", amount: 45000000, percentage: 3.2 },
    ],
    recovery_rate: 68.5,
    write_off_amount: 12500000,
    provision_coverage: 85.2,
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "High": return "text-red-600 bg-red-100";
      case "Medium": return "text-yellow-600 bg-yellow-100";
      case "Low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "border-l-red-400 bg-red-50";
      case "Medium": return "border-l-yellow-400 bg-yellow-50";
      case "Low": return "border-l-blue-400 bg-blue-50";
      default: return "border-l-gray-400 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Risk Monitoring Dashboard</h1>
          <p className="text-gray-600">Portfolio risk monitoring and NPA management</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last 1 Year</option>
          </select>
        </div>
      </div>

      {/* Risk Assessment Panel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment Panel</h2>
          
          {/* Key Risk Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Portfolio VaR</p>
                  <p className="text-2xl font-bold text-red-900">₹1.25 Cr</p>
                  <div className="flex items-center mt-2">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-sm font-medium text-red-600">+12%</span>
                  </div>
                </div>
                <ShieldExclamationIcon className="h-8 w-8 text-red-500" />
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Concentration Risk</p>
                  <p className="text-2xl font-bold text-yellow-900">15.8%</p>
                  <div className="flex items-center mt-2">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-yellow-600">+2.1%</span>
                  </div>
                </div>
                <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Sector Exposure</p>
                  <p className="text-lg font-semibold text-blue-900">5 Sectors</p>
                  <p className="text-sm text-blue-600 mt-1">High Risk: 1</p>
                </div>
                <ChartBarIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Geographic Spread</p>
                  <p className="text-lg font-semibold text-green-900">4 Regions</p>
                  <p className="text-sm text-green-600 mt-1">Balanced</p>
                </div>
                <MapPinIcon className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Sector Exposure Chart */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4">Sector Exposure</h3>
            <div className="space-y-3">
              {riskMetrics.sector_exposure.map((sector, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span className="font-medium text-gray-900">{sector.sector}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{sector.exposure}%</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(sector.risk_level)}`}>
                      {sector.risk_level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Concentration */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4">Geographic Concentration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riskMetrics.geographic_concentration.map((region, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{region.region}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(region.risk_level)}`}>
                      {region.risk_level}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${region.exposure}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{region.exposure}% exposure</div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Grade Distribution */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4">Risk Grade Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {riskMetrics.risk_grade_distribution.map((grade, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{grade.grade}</div>
                  <div className="text-sm text-gray-600">{grade.count}</div>
                  <div className="text-xs text-gray-500">{grade.percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Early Warning Alerts */}
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-4">Early Warning Alerts</h3>
            <div className="space-y-3">
              {riskMetrics.early_warning_alerts.map((alert, index) => (
                <div key={index} className={`p-4 border-l-4 ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">{alert.type}</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* NPA Monitoring */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">NPA Monitoring</h2>
          
          {/* NPA Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">NPA Amount</p>
                  <p className="text-2xl font-bold text-red-900">₹4.5 Cr</p>
                  <div className="flex items-center mt-2">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-sm font-medium text-red-600">+3.5%</span>
                  </div>
                </div>
                <CurrencyDollarIcon className="h-8 w-8 text-red-500" />
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">NPA Percentage</p>
                  <p className="text-2xl font-bold text-orange-900">3.2%</p>
                  <div className="flex items-center mt-2">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-sm font-medium text-orange-600">+0.2%</span>
                  </div>
                </div>
                <ChartBarIcon className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Recovery Rate</p>
                  <p className="text-2xl font-bold text-green-900">68.5%</p>
                  <div className="flex items-center mt-2">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">+2.1%</span>
                  </div>
                </div>
                <ArrowTrendingUpIcon className="h-8 w-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Provision Coverage</p>
                  <p className="text-2xl font-bold text-blue-900">85.2%</p>
                  <div className="flex items-center mt-2">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm font-medium text-blue-600">+1.5%</span>
                  </div>
                </div>
                <ShieldExclamationIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>

          {/* NPA Trend Chart */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4">NPA Trend (Last 6 Months)</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-6 gap-4">
                {npaMetrics.npa_trend.map((month, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm font-medium text-gray-900">{month.month}</div>
                    <div className="text-lg font-bold text-gray-900">₹{(month.amount / 10000000).toFixed(1)}Cr</div>
                    <div className="text-xs text-gray-600">{month.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Write-off and Recovery Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Write-off Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Write-off:</span>
                  <span className="text-sm font-medium text-gray-900">₹1.25 Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">This Month:</span>
                  <span className="text-sm font-medium text-gray-900">₹15.2 L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Month:</span>
                  <span className="text-sm font-medium text-gray-900">₹12.8 L</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Recovery Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Recovery:</span>
                  <span className="text-sm font-medium text-gray-900">₹3.08 Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">This Month:</span>
                  <span className="text-sm font-medium text-gray-900">₹28.5 L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Month:</span>
                  <span className="text-sm font-medium text-gray-900">₹32.1 L</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
