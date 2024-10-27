import { Button } from "../ui/button";

const HeroSection: React.FC = () => (
  <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
    <div className="container px-4 md:px-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-[#171B42]">
          Master Your Interview Skills with Clarisma
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
          Practice, improve, and excel in your interviews with Clarisma's
          advanced AI-powered coaching system.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            Start Practicing Now
          </Button>
          <Button
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
