import { Button } from "../ui/button";

const CallToActionSection: React.FC = () => (
  <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600 text-white">
    <div className="container px-4 md:px-6 text-center">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">
        Ready to Elevate Your Interview Skills?
      </h2>
      <p className="mb-6">
        Join thousands of users who have transformed their interview performance
        with Clarisma.
      </p>
      <Button className="bg-white text-blue-600 hover:bg-gray-200">
        Get Started
      </Button>
    </div>
  </section>
);

export default CallToActionSection;
