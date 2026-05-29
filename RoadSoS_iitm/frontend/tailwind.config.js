export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        danger: "#dc2626",
        ink: "#111827",
        amberline: "#f59e0b"
      },
      animation: {
        pulseRing: "pulseRing 1.5s cubic-bezier(0.4,0,0.6,1) infinite"
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(.9)", opacity: ".75" },
          "100%": { transform: "scale(1.35)", opacity: "0" }
        }
      }
    }
  },
  plugins: []
};
