interface AnalyticsCardProps {
  title: string;
  height?: number;
  fullWidth?: boolean;
}

export default function AnalyticsCard({
  title,
  height = 260,
  fullWidth = false,
}: AnalyticsCardProps) {
  return (
    <div
      style={{
        height,
        background: "#0a0a0a",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: 20,
        fontWeight: 600,
        gridColumn: fullWidth ? "span 2" : "auto",
      }}
    >
      {title}
    </div>
  );
}