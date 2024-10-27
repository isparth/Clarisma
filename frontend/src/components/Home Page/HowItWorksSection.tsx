import HowItWorksItem from "./HowItWorksItem";

const HowItWorksSection: React.FC = () => (
  <section className="w-full py-12 md:py-24 lg:py-32">
    <div className="container px-4 md:px-6">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl text-center mb-8 sm:mb-12 text-[#171B42]">
        How Clarisma Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            number: 1,
            title: "Practice Interview",
            description:
              "Answer common interview questions in Clarisma's simulated environment.",
          },
          {
            number: 2,
            title: "AI Analysis",
            description:
              "Clarisma's AI evaluates your performance across multiple dimensions.",
          },
          {
            number: 3,
            title: "Receive Feedback",
            description:
              "Get detailed insights and actionable tips from Clarisma to improve your skills.",
          },
        ].map(({ number, title, description }) => (
          <HowItWorksItem
            key={title}
            number={number}
            title={title}
            description={description}
          />
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
