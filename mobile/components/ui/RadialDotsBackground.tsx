import { Dimensions } from "react-native";
import Svg, { Circle, Defs, Pattern, Rect } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export default function RadialDotsBackground() { 
    return (
        <Svg
            width={width}
            height={height}
            style={{position: "absolute", top: 0, left: 0}}
        >

            <Defs>
                <Pattern
                    id="dotPattern"
                    patternUnits="userSpaceOnUse"
                    width={30}
                    height={30}
                >
                    <Circle cx={10} cy={10} r={1} fill="#fff" />
                </Pattern>
            </Defs>
            
            <Rect width="100%" height="100%" fill="url(#dotPattern)" />
        </Svg>
    )
}