const FeatureItem: React.FC<{
  icon: JSX.Element;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center space-y-4">
    {icon}
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-blue-100">{description}</p>
  </div>
);

export default FeatureItem;
