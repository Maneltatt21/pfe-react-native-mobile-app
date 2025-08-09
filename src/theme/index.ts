export const lightTheme = {
  colors: {
    background: "#FFFFFF",
    text: "#000000",
    primary: "#465abe",
    card: "#F5F5F5",
    border: "#E0E0E0",
    sidebar: "#F8F8F8", // Light gray for sidebar
    appBar: "#FFFFFF", // White for app bar, matching background
    button: "#4CAF50", // Matches primary for general buttons
    buttonText: "#FFFFFF",
    editButton: "#2196F3", // Blue for edit
    deleteButton: "#F44336", // Red for delete
    viewButton: "#FF9800", // Orange for view
    createButton: "#465abe", // Matches primary for create
  },
  isDark: false,
};

export const darkTheme = {
  colors: {
    background: "#2b2933",
    text: "#FFFFFF",
    primary: "#465abe",
    card: "#1E1E1E",
    border: "#333333",
    sidebar: "#33333D", // Darker shade for sidebar
    appBar: "#2b2933", // Matches background for app bar
    button: "#81C784", // Matches primary for general buttons
    buttonText: "#FFFFFF",
    editButton: "#42A5F5", // Lighter blue for edit
    deleteButton: "#EF5350", // Lighter red for delete
    viewButton: "#FFB300", // Lighter orange for view
    createButton: "#465abe", // Matches primary for create
  },
  isDark: true,
};
export type AppTheme = typeof lightTheme;
