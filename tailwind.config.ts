import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./stories/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
    },
    extend: {
      height: {
        "21": "5.375rem",
      },
      borderRadius: {
        "48": "48px",
      },
      borderWidth: {
        "0.5": "0.5px",
      },
      colors: {
        white1: "#FFFFFF",
        black1: "#020617",
        black50: "#F8FAFC",
        black200: "#E2E8F0",
        black500: "#64748B",
        black950: "#020617",
        error50: "#FEF2F2",
        error500: "#EF4444",
        error800: "#991B1B",
        primary100: "#E0F2FE",
        primary500: "#0EA5E9",
        primary600: "#4180C6",
        primary800: "#075985",
        success500: "#22C55E",
        yellow100: "#FFC656",
        silver50: "#E2E8F0",
        silver600: "#7F9DCA",
        contentBg: "#F5F5F7",
        gray100: "#E8E8E8",
        gray400: "#5F5F5F",
        blackBlur: "rgba(0, 0, 0, 0.5)",
        yellow50: "rgba(220, 115, 18, 0.08)",
        yellow600: "rgba(220, 115, 18, 0.22)",
        yellow700: "rgba(255, 229, 143, 0.20)",
        copper50: "rgba(185, 100, 21, 0.08)",
        copper600: "rgba(185, 100, 21, 0.22)",
        black400: "rgba(55, 96, 148, 0.22)",
        black700: "rgba(0, 0, 0, 0.68)",

        // update system
        neutral1: "#FFFFFF",
        neutral2: "#F9FAFB",
        neutral3: "#E5E7EB",
        neutral4: "#C4C9D3",
        neutral5: "#6B7280",
        neutral6: "#525A68",
        neutral7: "#374151",
        neutral8: "#111827",
        primary1: "#F0F5FF",
        primary2: "#D6E4FF",
        primary3: "#ADC6FF",
        primary4: "#85A5FF",
        primary5: "#597EF7",
        primary6: "#2F54EB",
        success1: "#B2E4C7",
        success2: "#27AE60",
        warning1: "#FFE58F",
        warning2: "#FAAD14",
        error1: "#FFA39E",
        error2: "#FF4D4F",
        tertiary: "#50E796",
        secondary: "#25D8D3",
        darkBlue: "#50E796",
        characterStrokeBet: "#F0F3F8",
        characterUpcoming: "#294B86",
        magenta3: "#FFADD2",
        cyan3: "#87E8DE",
        characterDown: "#F759AB",
        characterUp: "#13C2C2",
        characterIcon: "#8493B0",
        copper9: "#E09771",
        copper1: "#FEF1EB",
      },
      boxShadow: {
        reward: "0px 0px 12px 0px #FFC656;",
        pair: "0px 4px 8px 0px rgba(14, 165, 233, 0.18)",
        swap: "0px 0px 12px 0px #0EA5E9;",
        topFirst: "0px 4px 16px 0px rgba(252, 151, 0, 0.10)",
        topSecond: "0px 4px 16px 0px rgba(127, 157, 202, 0.10)",
        topThird: "0px 4px 16px 0px rgba(144, 86, 0, 0.10)",
        selfInfo: "0px -1px 12px 0px rgba(20, 88, 172, 0.21)",
        tabLeaderboard: "0px 0px 4px 0px rgba(0, 0, 0, 0.10)",
      },
      backgroundImage: {
        loadingPrimary:
          "linear-gradient(0deg, rgba(14, 165, 233, 0.2) 33%, #0EA5E9 100%);",

        notchDefault: "url('/images/img-payout-notch-default.svg')",
        notchDefaultDown: "url('/images/img-payout-notch-default-down.svg')",
        notchUp: "url('/images/img-payout-notch-success.svg')",
        notchDown: "url('/images/img-payout-notch-error.svg')",
        userDialogHeader: "url('/images/img-account-dialog-header.svg')",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        popUp: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96)",
          },
          to: {
            opacity: "1",
            transform: "translate(-50%, -50%) scale(1)",
          },
        },
        disappear: {
          "0%": {
            left: "0",
          },
          "100%": {
            left: "100%",
          },
        },
        rotate: {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
      },
      animation: {
        disappear: "disappear .6s linear",
        popUp: "popUp 350ms cubic-bezier(0.16, 1, 0.3, 1)",
        rotate: "rotate .3s linear",
      },
    },
  },
  plugins: [],
};
export default config;
