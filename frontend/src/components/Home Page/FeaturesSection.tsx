import { Brain, Mic, Video } from "lucide-react";
import FeatureItem from "./FeatureItem";

const FeaturesSection: React.FC = () => (
  <section className="w-full py-12 md:py-24 lg:py-32 bg-[#171B42] text-white">
    <div className="container px-4 md:px-6">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl text-center mb-8 sm:mb-12">
        Key Features of Clarisma
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            icon: <Video className="h-12 w-12 text-blue-300" />,
            title: "Video Analysis",
            description:
              "Clarisma assesses your body language and facial expressions for confident communication.",
          },
          {
            icon: <Mic className="h-12 w-12 text-blue-300" />,
            title: "Audio Analysis",
            description:
              "Evaluate speech patterns, pauses, and filler words to improve clarity in your responses.",
          },
          {
            icon: <Brain className="h-12 w-12 text-blue-300" />,
            title: "AI-Powered Feedback",
            description:
              "Receive personalized insights and tips from Clarisma to enhance your interview performance.",
          },
        ].map(({ icon, title, description }) => (
          <FeatureItem
            key={title}
            icon={icon}
            title={title}
            description={description}
          />
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
