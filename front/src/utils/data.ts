export const KJTOKCAL = 0.239005736;

export const MOCK_DATA = {
  // Data for the gauges and daily averages
  todayMetrics: {
    sugar: { value: 65, max: 90 }, // in grams
    caffeine: { value: 250, max: 400 }, // in mg
    calories: { value: 1800, max: 2500 }, // in kcal
  },
  // Data for the recent consumptions timeline
  recentConsumptions: [
    {
      id: 1,
      product: "Espresso",
      time: "5:15 PM",
      location: "Kitchen",
      sugar: 0,
      caffeine: 75,
      calories: 5,
    },
    {
      id: 2,
      product: "Donut",
      time: "3:30 PM",
      location: "Office",
      sugar: 25,
      caffeine: 0,
      calories: 350,
    },
    {
      id: 3,
      product: "Chicken Salad",
      time: "12:30 PM",
      location: "Home Office",
      sugar: 5,
      caffeine: 0,
      calories: 450,
    },
    {
      id: 4,
      product: "Energy Drink",
      time: "9:00 AM",
      location: "On the go",
      sugar: 30,
      caffeine: 150,
      calories: 180,
    },
    {
      id: 5,
      product: "Black Coffee",
      time: "8:00 AM",
      location: "Kitchen",
      sugar: 0,
      caffeine: 95,
      calories: 5,
    },
  ],
  // Data for the "History of Days with Alerts" card
  alertHistory: [
    "November 10, 2025",
    "November 8, 2025",
    "November 5, 2025",
    "November 1, 2025",
  ],
  // Data for the "Sugar Consumed by Day" bar chart
  sugarByDay: [
    { day: "Mon", sugar: 70 },
    { day: "Tue", sugar: 85 },
    { day: "Wed", sugar: 60 },
    { day: "Thu", sugar: 95 },
    { day: "Fri", sugar: 110 },
    { day: "Sat", sugar: 80 },
    { day: "Sun", sugar: 50 },
  ],
  // Data for the "Caffeine by Time" line chart
  caffeineByTime: [
    { time: "8 AM", caffeine: 95 },
    { time: "9 AM", caffeine: 245 }, // 95 + 150 from energy drink
    { time: "12 PM", caffeine: 245 },
    { time: "3 PM", caffeine: 245 },
    { time: "5 PM", caffeine: 320 }, // 245 + 75 from espresso
    { time: "8 PM", caffeine: 320 },
  ],
  // Data for the Dashboard "Stats" cards
  dashboardStats: {
    avgSugarPerDay: 78, // in grams
    avgCaffeinePerDay: 280, // in mg
    mostConsumedProduct: "Black Coffee",
    topSugarContributor: "Energy Drink",
  },
  // Data for the Analytics page
  analytics: {
    topConsumedProducts: [
      { name: "Black Coffee", count: 45 },
      { name: "Espresso", count: 30 },
      { name: "Energy Drink", count: 22 },
      { name: "Donut", count: 18 },
      { name: "Soda", count: 15 },
      { name: "Chicken Salad", count: 12 },
      { name: "Protein Bar", count: 10 },
      { name: "Green Tea", count: 9 },
      { name: "Apple", count: 8 },
      { name: "Cereal", count: 7 },
    ],
    topContributors: {
      sugar: [
        { name: "Energy Drink", percentage: 30 },
        { name: "Donut", percentage: 25 },
        { name: "Soda", percentage: 20 },
        { name: "Cereal", percentage: 10 },
        { name: "Protein Bar", percentage: 5 },
        { name: "Other", percentage: 10 },
      ],
      caffeine: [
        { name: "Energy Drink", percentage: 40 },
        { name: "Black Coffee", percentage: 35 },
        { name: "Espresso", percentage: 15 },
        { name: "Green Tea", percentage: 5 },
        { name: "Other", percentage: 5 },
      ],
      calories: [
        { name: "Donut", percentage: 20 },
        { name: "Chicken Salad", percentage: 18 },
        { name: "Energy Drink", percentage: 15 },
        { name: "Cereal", percentage: 12 },
        { name: "Soda", percentage: 10 },
        { name: "Other", percentage: 25 },
      ],
    },
    summary: {
      dailyAvgSugar: 78,
      dailyAvgCaffeine: 280,
      daysExceeding: 12,
      totalDays: 30,
      trend: "increasing", // 'increasing', 'decreasing', 'stable'
    },
  },
};
