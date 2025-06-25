
interface WelcomeContentProps {
  userName: string;
}

const WelcomeContent = ({ userName }: WelcomeContentProps) => {
  return (
    <div className="ml-8 pr-32">
      <h2 className="text-2xl font-bold text-white mb-2">
        Welcome back, {userName}! 👋
      </h2>
      <p className="text-purple-100">
        Ready to continue your amazing learning journey? Choose a subject below to get started!
      </p>
    </div>
  );
};

export default WelcomeContent;
