import React from "react";
import { ResponsiveAreaBump } from "@nivo/bump";

interface AreaBumpChartProps {
    data: any[]; // You can refine this type based on your data structure
}

const AreaBumpChart: React.FC<AreaBumpChartProps> = ({ data }) => (
    <ResponsiveAreaBump
        data={data}
        margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
        blendMode="multiply"
    />
);

export default AreaBumpChart;
