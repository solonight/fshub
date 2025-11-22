import { ImgHTMLAttributes } from "react";
import DashboardLogo from "@/assets/Dashboardlogo.png";

export default function ApplicationLogo(
    props: ImgHTMLAttributes<HTMLImageElement>
) {
    return (
        <img
            src={DashboardLogo}
            alt="Dashboard Logo"
            width={props.width || 77}
            height={props.height || 77}
            style={{ maxWidth: "100%", height: "auto", ...props.style }}
            {...props}
        />
    );
}
