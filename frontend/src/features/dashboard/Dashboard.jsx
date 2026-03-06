import { useContext, useEffect, useState, useMemo } from "react";
import DashboardContext from "../../contexts/DashboardContext";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const { metrics, fetchMetrics } = useContext(DashboardContext);
  const [popularityView, setPopularityView] = useState("most");
  const [chartView, setChartView] = useState("today");

  useEffect(() => {
    fetchMetrics();
  }, []);

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined) return "0%";
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value}%`;
  };

  const getComparisonClass = (value) => {
    if (value === null || value === undefined) return styles.neutral;
    return value >= 0 ? styles.positive : styles.negative;
  };

  const formatTime12Hour = (timeString) => {
    if (!timeString || timeString === "null") return "--:--";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getPeakTimeToday = () => {
    if (!metrics?.order_over_time?.today) return "--:--";
    const orders = metrics.order_over_time.today;
    let maxHour = 0;
    let maxTotal = -1;
    orders.forEach((order) => {
      if (order.total > maxTotal) {
        maxTotal = order.total;
        maxHour = order.hour;
      }
    });
    if (maxTotal === 0) return "--:--";
    const ampm = maxHour >= 12 ? "PM" : "AM";
    const hour12 = maxHour % 12 || 12;
    return `${hour12}:00 ${ampm}`;
  };

  const getPeakTimeMonth = () => {
    if (!metrics?.peak_ordering_time?.thisMonth) return "--:--";
    return formatTime12Hour(metrics.peak_ordering_time.thisMonth);
  };

  const getTodayOrders = () => {
    if (!metrics?.order_over_time?.today) return [];
    return metrics.order_over_time.today.map((o) => o.total);
  };

  const getMonthOrders = () => {
    if (!metrics?.order_over_time?.thisMonth) return [];
    return metrics.order_over_time.thisMonth.map((o) => o.total);
  };

  const chartData = useMemo(() => {
    if (chartView === "today") {
      return {
        labels: Array.from({ length: 24 }, (_, i) => {
          const hour = i % 12 || 12;
          const ampm = i >= 12 ? "PM" : "AM";
          return i % 3 === 0 ? `${hour} ${ampm}` : "";
        }),
        data: getTodayOrders(),
        label: "Today's Orders",
      };
    } else {
      const daysInMonth = getMonthOrders().length || 30;
      return {
        labels: Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          return day % 5 === 0 ? `${day}` : "";
        }),
        data: getMonthOrders(),
        label: "This Month's Orders",
      };
    }
  }, [chartView, metrics]);

  const getTopProducts = () => {
    if (!metrics?.product_revenue?.thisMonth) return [];
    const sorted = [...metrics.product_revenue.thisMonth].sort(
      (a, b) => b.revenue - a.revenue,
    );
    return popularityView === "most" ? sorted : [...sorted].reverse();
  };

  const getMostPopular = () => {
    if (!metrics?.most_popular?.name) return "No data";
    return `${metrics.most_popular.name} (${metrics.most_popular.quantity} sold)`;
  };

  const getLeastPopular = () => {
    if (!metrics?.least_popular?.name) return "No data";
    return `${metrics.least_popular.name} (${metrics.least_popular.quantity} sold)`;
  };

  const getProductRevenueToday = () => {
    if (!metrics?.product_revenue?.today?.length) {
      return metrics?.product_revenue?.thisMonth?.slice(0, 5) || [];
    }
    return metrics.product_revenue.today.slice(0, 5);
  };

  const maxProductRevenue = () => {
    const products = getProductRevenueToday();
    if (!products.length) return 1;
    return Math.max(...products.map((p) => p.revenue));
  };

  const generateSmoothPath = (data, width, height) => {
    if (!data.length) return "";
    const max = Math.max(...data, 1);
    const points = data.map((val, idx) => ({
      x: (idx / (data.length - 1)) * width,
      y: height - (val / max) * height,
    }));

    if (points.length < 2) return "";

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cp1x = prev.x + (curr.x - prev.x) / 3;
      const cp1y = prev.y;
      const cp2x = prev.x + (2 * (curr.x - prev.x)) / 3;
      const cp2y = curr.y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }

    return path;
  };

  const generateAreaPath = (data, width, height) => {
    const linePath = generateSmoothPath(data, width, height);
    if (!linePath) return "";
    const lastPoint = data.length - 1;
    const max = Math.max(...data, 1);
    const lastX = (lastPoint / (data.length - 1)) * width;
    return `${linePath} L ${lastX} ${height} L 0 ${height} Z`;
  };

  const chartWidth = 800;
  const chartHeight = 240;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard Overview</h1>
          <p className={styles.subtitle}>
            Sales performance and inventory metrics.
          </p>
        </div>
        <button onClick={fetchMetrics} className={styles.refreshButton}>
          <svg
            className={styles.refreshIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh Data
        </button>
      </div>

      <div className={styles.kpiGrid}>
        <div className={`${styles.card} ${styles.cardHover}`}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardLabel}>Total Revenue (Today)</p>
              <h3 className={styles.cardValue}>
                {formatCurrency(metrics?.total_revenue?.today?.total)}
              </h3>
            </div>
            <div className={`${styles.iconBox} ${styles.iconBlue}`}>
              <svg
                className={styles.icon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className={styles.comparison}>
            <span
              className={`${styles.badge} ${getComparisonClass(
                metrics?.revenue_comparison?.daily,
              )}`}
            >
              {metrics?.revenue_comparison?.daily >= 0 ? "↑" : "↓"}
              {formatPercentage(metrics?.revenue_comparison?.daily)}
            </span>
            <span className={styles.comparisonText}>vs yesterday</span>
          </div>
        </div>

        <div className={`${styles.card} ${styles.cardHover}`}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardLabel}>Revenue (Yesterday)</p>
              <h3 className={`${styles.cardValue} ${styles.muted}`}>
                {formatCurrency(metrics?.total_revenue?.yesterday?.total)}
              </h3>
            </div>
            <div className={`${styles.iconBox} ${styles.iconGray}`}>
              <svg
                className={styles.icon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className={styles.comparisonText}>Finalized daily total</div>
        </div>

        <div className={`${styles.card} ${styles.cardHover}`}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardLabel}>Revenue (This Month)</p>
              <h3 className={styles.cardValue}>
                {formatCurrency(metrics?.total_revenue?.thisMonth?.total)}
              </h3>
            </div>
            <div className={`${styles.iconBox} ${styles.iconPurple}`}>
              <svg
                className={styles.icon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <div className={styles.comparison}>
            <span
              className={`${styles.badge} ${getComparisonClass(
                metrics?.revenue_comparison?.monthly,
              )}`}
            >
              {metrics?.revenue_comparison?.monthly >= 0 ? "↑" : "↓"}
              {formatPercentage(metrics?.revenue_comparison?.monthly)}
            </span>
            <span className={styles.comparisonText}>vs last month</span>
          </div>
        </div>

        <div className={`${styles.card} ${styles.cardHover}`}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardLabel}>Revenue (Last Month)</p>
              <h3 className={`${styles.cardValue} ${styles.muted}`}>
                {formatCurrency(metrics?.total_revenue?.lastMonth?.total)}
              </h3>
            </div>
            <div className={`${styles.iconBox} ${styles.iconGray}`}>
              <svg
                className={styles.icon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div className={styles.comparisonText}>Previous cycle benchmark</div>
        </div>
      </div>

      <div className={styles.middleSection}>
        <div className={`${styles.card} ${styles.chartCard}`}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.sectionTitle}>Order Velocity</h3>
              <p className={styles.sectionSubtitle}>
                {chartView === "today"
                  ? "Hourly order distribution for today"
                  : "Daily order distribution for this month"}
              </p>
            </div>
            <div className={styles.chartToggle}>
              <button
                onClick={() => setChartView("today")}
                className={`${styles.chartToggleBtn} ${
                  chartView === "today" ? styles.chartToggleActive : ""
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setChartView("month")}
                className={`${styles.chartToggleBtn} ${
                  chartView === "month" ? styles.chartToggleActive : ""
                }`}
              >
                This Month
              </button>
            </div>
          </div>

          <div className={styles.chartContainer}>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}
              className={styles.lineChart}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="lineGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="0"
                  y1={(chartHeight / 4) * i}
                  x2={chartWidth}
                  y2={(chartHeight / 4) * i}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
              ))}

              <path
                d={generateAreaPath(chartData.data, chartWidth, chartHeight)}
                fill="url(#lineGradient)"
              />

              <path
                d={generateSmoothPath(chartData.data, chartWidth, chartHeight)}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {chartData.data.map((val, idx) => {
                const max = Math.max(...chartData.data, 1);
                const x = (idx / (chartData.data.length - 1)) * chartWidth;
                const y = chartHeight - (val / max) * chartHeight;
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#3b82f6"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                );
              })}

              {chartData.labels.map((label, idx) => {
                if (!label) return null;
                const x = (idx / (chartData.labels.length - 1)) * chartWidth;
                return (
                  <text
                    key={idx}
                    x={x}
                    y={chartHeight + 20}
                    textAnchor="middle"
                    className={styles.axisLabel}
                  >
                    {label}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        <div className={styles.peakTimes}>
          <div className={`${styles.card} ${styles.peakCard}`}>
            <div className={styles.peakHeader}>
              <div className={`${styles.iconBoxSmall} ${styles.iconAmber}`}>
                <svg
                  className={styles.iconSmall}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className={styles.sectionTitle}>Peak Time (Today)</h3>
            </div>
            <div className={styles.peakValue}>
              <span className={styles.peakTime}>{getPeakTimeToday()}</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${styles.progressAmber}`}
                style={{ width: "85%" }}
              />
            </div>
          </div>

          <div className={`${styles.card} ${styles.peakCard}`}>
            <div className={styles.peakHeader}>
              <div className={`${styles.iconBoxSmall} ${styles.iconPurple}`}>
                <svg
                  className={styles.iconSmall}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <h3 className={styles.sectionTitle}>Peak Time (Month)</h3>
            </div>
            <div className={styles.peakValue}>
              <span className={styles.peakTime}>{getPeakTimeMonth()}</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${styles.progressPurple}`}
                style={{ width: "92%" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>Product Revenue Contribution</h3>
          <div className={styles.productList}>
            {getProductRevenueToday().map((product, idx) => (
              <div key={idx} className={styles.productItem}>
                <div className={styles.productInfo}>
                  <span className={styles.productName}>{product.name}</span>
                  <span className={styles.productRevenue}>
                    {formatCurrency(product.revenue)}
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFillBlue}
                    style={{
                      width: `${(product.revenue / maxProductRevenue()) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
            {getProductRevenueToday().length === 0 && (
              <p className={styles.noData}>No product revenue data available</p>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.popularityHeader}>
            <h3 className={styles.sectionTitle}>Product Popularity</h3>
            <div className={styles.toggleGroup}>
              <button
                onClick={() => setPopularityView("most")}
                className={`${styles.toggleBtn} ${
                  popularityView === "most" ? styles.toggleActive : ""
                }`}
              >
                Most
              </button>
              <button
                onClick={() => setPopularityView("least")}
                className={`${styles.toggleBtn} ${
                  popularityView === "least" ? styles.toggleActive : ""
                }`}
              >
                Least
              </button>
            </div>
          </div>

          <div className={styles.popularitySummary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Most Popular:</span>
              <span className={styles.summaryValue}>{getMostPopular()}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Least Popular:</span>
              <span className={styles.summaryValue}>{getLeastPopular()}</span>
            </div>
          </div>

          <div className={styles.popularityScrollContainer}>
            <div className={styles.popularityList}>
              {getTopProducts().map((product, idx) => {
                const rank =
                  popularityView === "most"
                    ? idx + 1
                    : getTopProducts().length - idx;
                return (
                  <div key={idx} className={styles.popularityItem}>
                    <div className={styles.popularityRank}>
                      <span
                        className={`${styles.rankNumber} ${
                          rank === 1
                            ? styles.rankGold
                            : rank === 2
                              ? styles.rankSilver
                              : rank === 3
                                ? styles.rankBronze
                                : styles.rankDefault
                        }`}
                      >
                        #{rank}
                      </span>
                      <div className={styles.rankAvatar}>
                        {product.name.charAt(0)}
                      </div>
                      <div>
                        <div className={styles.rankName}>{product.name}</div>
                        <div className={styles.rankRevenue}>
                          {formatCurrency(product.revenue)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
