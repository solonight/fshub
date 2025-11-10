import { ImgHTMLAttributes } from "react";
import DashboardLogo from "@/assets/Dashboardlogo.png";

export default function ApplicationLogo(
    props: ImgHTMLAttributes<HTMLImageElement>
) {
    return (
        <img
            src={DashboardLogo}
            alt="Dashboard Logo"
            width={props.width || 40}
            height={props.height || 40}
            style={{ maxWidth: "100%", height: "auto", ...props.style }}
            {...props}
        />
    );
}
