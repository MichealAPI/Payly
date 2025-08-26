import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FC, ReactNode } from "react";

type GlassCardProps = {
    children: ReactNode;
};

const GlassCard: FC<GlassCardProps> = ({ children }) => {
    return (
        <View className="relative w-full max-w-sm rounded-2xl overflow-hidden">
            {/* Purple Glow */}
            <LinearGradient
                colors={["#d946ef20", "#9333ea10", "transparent"]}
                start={{ x: 0.1, y: 0.1}}
                end={{ x: 1, y: 1 }}
                style={{
                    position: "absolute",
                    top: -60,
                    left: -60,
                    right: -60,
                    bottom: -60,
                    borderRadius: 30,
                }}
            />

            {/*Glass Effect */}
            <View className="bg-white/20 dark:bg-white/5 backdrop-blur-xl border border-white/20 p-6 shadow-2xl shadow-purple-500/20 rounded-2xl">
                {children}
            </View>
        </View>
    )
}

export default GlassCard;