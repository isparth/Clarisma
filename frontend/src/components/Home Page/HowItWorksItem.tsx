const HowItWorksItem: React.FC<{
  number: number;
  title: string;
  description: string;
}> = ({ number, title, description }) => (
  <div className="flex flex-col items-center text-center">
    <span className="text-4xl font-bold text-blue-600">{number}</span>
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default HowItWorksItem;
