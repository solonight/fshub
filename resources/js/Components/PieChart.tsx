import React from "react";
import { ResponsivePie } from "@nivo/pie";

export type PieChartData = {
    id: string;
    label: string;
    value: number;
    color?: string;
};

interface PieChartProps {
    data: PieChartData[];
    height?: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, height = 400 }) => (
    <div
        style={{
            height,
            width: "100%",
            maxWidth: 500,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
    >
        <div style={{ height: "100%", width: "100%" }}>
            <ResponsivePie
                data={data}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ datum: "data.color" }}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: "color" }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                    from: "color",
                    modifiers: [["darker", 2]],
                }}
            />
        </div>
    </div>
);

export default PieChart;
